// Tools comparison page functionality

let currentRecommendation = null;

// Initialize tools page
document.addEventListener('DOMContentLoaded', function() {
    // Set up filters
    PortalUtils.initFilters('type-filter', 'tool-card', 'type');
    PortalUtils.initFilters('difficulty-filter', 'tool-card', 'difficulty');
    
    // Initialize decision tree
    initDecisionTree();
    
    // Set up tool interactions
    setupToolInteractions();
});

function setupToolInteractions() {
    // Add hover effects and additional interactions
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add comparison feature
    let selectedTools = [];
    document.querySelectorAll('.tool-card .card-footer button:first-child').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const toolName = this.closest('.tool-card').querySelector('.card-title').textContent;
            toggleToolComparison(toolName);
        });
    });
}

function toggleToolComparison(toolName) {
    const selectedTools = PortalUtils.loadFromLocalStorage('selectedTools', []);
    
    if (selectedTools.includes(toolName)) {
        const index = selectedTools.indexOf(toolName);
        selectedTools.splice(index, 1);
        PortalUtils.showNotification(`Removed ${toolName} from comparison`, 'info');
    } else if (selectedTools.length < 3) {
        selectedTools.push(toolName);
        PortalUtils.showNotification(`Added ${toolName} to comparison`, 'success');
    } else {
        PortalUtils.showNotification('Maximum 3 tools can be compared', 'warning');
        return;
    }
    
    PortalUtils.saveToLocalStorage('selectedTools', selectedTools);
    updateComparisonUI(selectedTools);
}

function updateComparisonUI(selectedTools) {
    // Update button states
    document.querySelectorAll('.tool-card').forEach(card => {
        const toolName = card.querySelector('.card-title').textContent;
        const button = card.querySelector('.card-footer button:first-child');
        
        if (selectedTools.includes(toolName)) {
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');
            button.innerHTML = '<i class="fas fa-check"></i> Selected';
        } else {
            button.classList.remove('btn-success');
            button.classList.add('btn-primary');
            button.textContent = `Try ${toolName}`;
        }
    });
    
    // Show/hide comparison panel
    if (selectedTools.length > 0) {
        showComparisonPanel(selectedTools);
    } else {
        hideComparisonPanel();
    }
}

function showComparisonPanel(selectedTools) {
    let existingPanel = document.getElementById('comparison-panel');
    
    if (!existingPanel) {
        existingPanel = document.createElement('div');
        existingPanel.id = 'comparison-panel';
        existingPanel.className = 'fixed-bottom bg-white border-top p-3 shadow';
        document.body.appendChild(existingPanel);
    }
    
    existingPanel.innerHTML = `
        <div class="container">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">Selected for Comparison (${selectedTools.length})</h6>
                    <small class="text-muted">${selectedTools.join(', ')}</small>
                </div>
                <div>
                    <button class="btn btn-primary me-2" onclick="compareTools()">
                        <i class="fas fa-balance-scale"></i> Compare
                    </button>
                    <button class="btn btn-outline-secondary" onclick="clearComparison()">
                        <i class="fas fa-times"></i> Clear
                    </button>
                </div>
            </div>
        </div>
    `;
    
    existingPanel.style.display = 'block';
}

function hideComparisonPanel() {
    const panel = document.getElementById('comparison-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}

function compareTools() {
    const selectedTools = PortalUtils.loadFromLocalStorage('selectedTools', []);
    
    if (selectedTools.length < 2) {
        PortalUtils.showNotification('Select at least 2 tools to compare', 'warning');
        return;
    }
    
    // Create detailed comparison modal
    showDetailedComparison(selectedTools);
}

function showDetailedComparison(tools) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'comparisonModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detailed Tool Comparison</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${generateDetailedComparisonTable(tools)}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="exportComparison()">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Clean up modal when hidden
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
}

function generateDetailedComparisonTable(tools) {
    const features = [
        { name: 'Interface Type', values: { 'Flowise': 'Visual', 'LangChain': 'Code', 'HuggingFace Transformers': 'Code' }},
        { name: 'Learning Curve', values: { 'Flowise': 'Low', 'LangChain': 'High', 'HuggingFace Transformers': 'Medium' }},
        { name: 'Customization', values: { 'Flowise': 'Medium', 'LangChain': 'High', 'HuggingFace Transformers': 'High' }},
        { name: 'Community Size', values: { 'Flowise': 'Growing', 'LangChain': 'Large', 'HuggingFace Transformers': 'Very Large' }},
        { name: 'Documentation', values: { 'Flowise': 'Good', 'LangChain': 'Excellent', 'HuggingFace Transformers': 'Excellent' }},
        { name: 'Production Ready', values: { 'Flowise': 'Yes', 'LangChain': 'Yes', 'HuggingFace Transformers': 'Yes' }},
        { name: 'Cost', values: { 'Flowise': 'Free', 'LangChain': 'Free', 'HuggingFace Transformers': 'Free/Paid' }},
        { name: 'Use Case', values: { 'Flowise': 'Rapid Prototyping', 'LangChain': 'Production Apps', 'HuggingFace Transformers': 'Research/ML' }}
    ];
    
    let table = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Feature</th>
                        ${tools.map(tool => `<th class="text-center">${tool}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
    `;
    
    features.forEach(feature => {
        table += `
            <tr>
                <td><strong>${feature.name}</strong></td>
                ${tools.map(tool => {
                    const value = feature.values[tool] || 'N/A';
                    const badgeClass = getBadgeClass(feature.name, value);
                    return `<td class="text-center"><span class="badge ${badgeClass}">${value}</span></td>`;
                }).join('')}
            </tr>
        `;
    });
    
    table += `
                </tbody>
            </table>
        </div>
    `;
    
    return table;
}

function getBadgeClass(feature, value) {
    const badgeMap = {
        'Learning Curve': { 'Low': 'bg-success', 'Medium': 'bg-warning', 'High': 'bg-danger' },
        'Customization': { 'Low': 'bg-danger', 'Medium': 'bg-warning', 'High': 'bg-success' },
        'Community Size': { 'Small': 'bg-danger', 'Growing': 'bg-warning', 'Large': 'bg-success', 'Very Large': 'bg-success' }
    };
    
    return badgeMap[feature]?.[value] || 'bg-secondary';
}

function clearComparison() {
    PortalUtils.saveToLocalStorage('selectedTools', []);
    updateComparisonUI([]);
    PortalUtils.showNotification('Comparison cleared', 'info');
}

function exportComparison() {
    const selectedTools = PortalUtils.loadFromLocalStorage('selectedTools', []);
    const comparisonData = generateComparisonData(selectedTools);
    
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tool-comparison-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    PortalUtils.showNotification('Comparison exported successfully', 'success');
}

function generateComparisonData(tools) {
    return {
        timestamp: new Date().toISOString(),
        tools: tools,
        comparison: 'AI Tools Comparison',
        source: 'Flowise Learning Portal'
    };
}

// Decision Tree functionality
function initDecisionTree() {
    resetDecisionTree();
}

function nextQuestion(currentQuestion, answer) {
    // Hide current question
    document.querySelector(`.question-node[data-question="${currentQuestion}"]`).style.display = 'none';
    
    // Determine next question based on answer
    let nextQuestionId = null;
    
    if (currentQuestion === 'coding') {
        if (answer === 'yes') {
            nextQuestionId = 'experience';
        } else {
            nextQuestionId = 'purpose';
        }
    }
    
    if (nextQuestionId) {
        document.querySelector(`.question-node[data-question="${nextQuestionId}"]`).style.display = 'block';
    }
}

function showResult(category) {
    // Hide all questions
    document.querySelectorAll('.question-node').forEach(node => {
        node.style.display = 'none';
    });
    
    // Show recommendation
    const resultDiv = document.getElementById('recommendation-result');
    const contentDiv = document.getElementById('recommendation-content');
    
    const recommendations = {
        'beginner': {
            tool: 'Flowise',
            reason: 'Perfect for beginners with its visual interface and no coding required.',
            nextSteps: ['Start with our Flowise tutorial', 'Join the community', 'Try the interactive demo']
        },
        'intermediate': {
            tool: 'LangChain',
            reason: 'Great for developers who want full control and customization.',
            nextSteps: ['Learn LangChain basics', 'Practice with code examples', 'Build a production app']
        },
        'advanced': {
            tool: 'LangChain + HuggingFace',
            reason: 'Combine the power of LangChain with cutting-edge models from HuggingFace.',
            nextSteps: ['Explore advanced patterns', 'Contribute to open source', 'Build enterprise solutions']
        },
        'prototype': {
            tool: 'Flowise',
            reason: 'Fastest way to build and test your ideas without writing code.',
            nextSteps: ['Use pre-built templates', 'Iterate quickly', 'Deploy with one click']
        },
        'learning': {
            tool: 'Start with Flowise, progress to LangChain',
            reason: 'Learn concepts visually first, then dive into coding for deeper understanding.',
            nextSteps: ['Complete all tutorials', 'Practice regularly', 'Join study groups']
        },
        'production': {
            tool: 'LangChain',
            reason: 'Production-ready framework with enterprise features and scalability.',
            nextSteps: ['Plan architecture', 'Implement monitoring', 'Set up CI/CD']
        }
    };
    
    const rec = recommendations[category];
    currentRecommendation = rec;
    
    contentDiv.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <div class="recommendation-icon me-3">
                <i class="fas fa-lightbulb fa-2x text-warning"></i>
            </div>
            <div>
                <h5 class="mb-1">${rec.tool}</h5>
                <p class="mb-0">${rec.reason}</p>
            </div>
        </div>
        <div class="next-steps">
            <h6>Recommended Next Steps:</h6>
            <ul class="list-unstyled">
                ${rec.nextSteps.map(step => `<li><i class="fas fa-arrow-right text-primary me-2"></i>${step}</li>`).join('')}
            </ul>
        </div>
        <div class="mt-3">
            <button class="btn btn-primary me-2" onclick="startRecommendedPath()">
                <i class="fas fa-rocket"></i> Get Started
            </button>
            <button class="btn btn-outline-secondary" onclick="shareRecommendation()">
                <i class="fas fa-share"></i> Share
            </button>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    
    // Animate result appearance
    PortalUtils.animateElement(resultDiv, 'fade-in');
}

function restartDecisionTree() {
    resetDecisionTree();
}

function resetDecisionTree() {
    // Hide all questions except the first
    document.querySelectorAll('.question-node').forEach(node => {
        node.style.display = 'none';
    });
    
    document.querySelector('.question-node[data-question="coding"]').style.display = 'block';
    document.getElementById('recommendation-result').style.display = 'none';
    
    currentRecommendation = null;
}

function startRecommendedPath() {
    if (!currentRecommendation) return;
    
    const tool = currentRecommendation.tool.toLowerCase();
    
    if (tool.includes('flowise')) {
        // Redirect to Flowise tutorial
        window.location.href = '/learn#tutorial-1';
    } else if (tool.includes('langchain')) {
        // Redirect to LangChain resources
        window.location.href = '/learn#tutorial-2';
    } else {
        // General learning path
        window.location.href = '/learn';
    }
}

function shareRecommendation() {
    if (!currentRecommendation) return;
    
    const text = `My AI tool recommendation: ${currentRecommendation.tool} - ${currentRecommendation.reason}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'AI Tool Recommendation',
            text: text,
            url: window.location.href
        });
    } else {
        PortalUtils.copyToClipboard(text, 'Recommendation copied to clipboard!');
    }
}

function tryTool(toolName) {
    // Redirect to appropriate demo or tutorial
    const toolRoutes = {
        'flowise': '/demos',
        'langchain': '/learn#tutorial-2',
        'huggingface': '/learn#tutorial-3'
    };
    
    const route = toolRoutes[toolName] || '/demos';
    window.location.href = route;
}

function learnMore(toolName) {
    // Show detailed information modal
    const toolDetails = {
        'flowise': {
            description: 'Flowise is a visual tool for building AI workflows without coding.',
            features: ['Drag-and-drop interface', 'Pre-built components', 'Easy deployment'],
            links: ['https://flowiseai.com', 'https://docs.flowiseai.com']
        },
        'langchain': {
            description: 'LangChain is a framework for developing applications powered by language models.',
            features: ['Modular design', 'Extensive integrations', 'Production-ready'],
            links: ['https://langchain.com', 'https://python.langchain.com']
        },
        'huggingface': {
            description: 'HuggingFace provides state-of-the-art machine learning models and tools.',
            features: ['Large model library', 'Easy fine-tuning', 'Community-driven'],
            links: ['https://huggingface.co', 'https://huggingface.co/docs']
        }
    };
    
    const details = toolDetails[toolName];
    if (details) {
        PortalUtils.showNotification(`Learn more about ${toolName}: ${details.description}`, 'info');
    }
}

// Make functions globally available
window.nextQuestion = nextQuestion;
window.showResult = showResult;
window.restartDecisionTree = restartDecisionTree;
window.startRecommendedPath = startRecommendedPath;
window.shareRecommendation = shareRecommendation;
window.tryTool = tryTool;
window.learnMore = learnMore;
window.compareTools = compareTools;
window.clearComparison = clearComparison;
window.exportComparison = exportComparison;
