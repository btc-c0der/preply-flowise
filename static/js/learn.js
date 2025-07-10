// Learn page functionality

let currentTutorial = null;
let currentStep = 0;
let tutorialSteps = [];

// Tutorial data (extended from backend)
const tutorialDetails = {
    1: {
        title: "Building Your First Chatbot with Flowise",
        description: "Learn to create a simple Q&A chatbot using Flowise visual interface",
        level: "Beginner",
        duration: "30 minutes",
        steps: [
            {
                title: "Introduction to Flowise",
                content: "Welcome to Flowise! This visual tool makes it easy to build AI workflows without coding. Let's start by understanding the interface.",
                interactive: "demo",
                code: `// No code needed - we'll use the visual interface!
console.log("Welcome to Flowise!");`
            },
            {
                title: "Setting Up Your Environment",
                content: "First, let's set up Flowise. You can run it locally or use the cloud version.",
                interactive: "setup",
                code: `# Install Flowise
npm install -g flowise

# Start Flowise
npx flowise start`
            },
            {
                title: "Creating Your First Flow",
                content: "Now we'll create a simple chatbot flow. Drag and drop components to build your workflow.",
                interactive: "builder",
                code: `{
  "nodes": [
    {
      "id": "chatOpenAI_0",
      "type": "ChatOpenAI",
      "data": {
        "temperature": 0.7,
        "modelName": "gpt-3.5-turbo"
      }
    }
  ]
}`
            },
            {
                title: "Adding Memory",
                content: "Let's add conversation memory so your chatbot can remember previous messages.",
                interactive: "memory",
                code: `{
  "id": "bufferMemory_0",
  "type": "BufferMemory",
  "data": {
    "memoryKey": "chat_history",
    "returnMessages": true
  }
}`
            },
            {
                title: "Testing Your Chatbot",
                content: "Time to test your chatbot! Use the chat interface to see how it responds.",
                interactive: "test",
                code: `// Test your chatbot
const response = await chatbot.invoke({
  input: "Hello, how are you?"
});
console.log(response);`
            },
            {
                title: "Customizing Responses",
                content: "Learn how to customize your chatbot's personality and responses with prompts.",
                interactive: "customize",
                code: `const promptTemplate = \`
You are a helpful assistant. 
Context: {context}
Question: {question}
Answer:\`;`
            },
            {
                title: "Deployment",
                content: "Finally, let's deploy your chatbot so others can use it!",
                interactive: "deploy",
                code: `# Deploy to Railway
railway login
railway deploy

# Or use Docker
docker build -t my-chatbot .
docker run -p 3000:3000 my-chatbot`
            }
        ]
    },
    2: {
        title: "Document Q&A with Vector Embeddings",
        description: "Create a document question-answering system using embeddings",
        level: "Intermediate",
        duration: "45 minutes",
        steps: [
            {
                title: "Understanding RAG",
                content: "RAG (Retrieval Augmented Generation) combines document retrieval with language models for accurate answers.",
                interactive: "concept",
                code: `// RAG Architecture
Document → Embeddings → Vector Store → Retriever → LLM → Answer`
            },
            {
                title: "Setting Up Vector Store",
                content: "We'll use Pinecone as our vector database to store document embeddings.",
                interactive: "vectorstore",
                code: `const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT
});`
            },
            {
                title: "Document Processing",
                content: "Learn how to split and process documents for optimal retrieval.",
                interactive: "processing",
                code: `const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
});

const docs = await textSplitter.splitDocuments(documents);`
            },
            {
                title: "Creating Embeddings",
                content: "Convert text chunks into vector embeddings using OpenAI's embedding model.",
                interactive: "embeddings",
                code: `const embeddings = new OpenAIEmbeddings();
const vectorStore = await PineconeStore.fromDocuments(docs, embeddings);`
            },
            {
                title: "Building the RAG Chain",
                content: "Combine the retriever with a language model to create the Q&A system.",
                interactive: "chain",
                code: `const retriever = vectorStore.asRetriever();
const chain = RetrievalQAChain.fromLLM(llm, retriever);`
            }
        ]
    },
    3: {
        title: "Advanced Agent Workflows",
        description: "Build multi-step agents with tool calling capabilities",
        level: "Advanced", 
        duration: "60 minutes",
        steps: [
            {
                title: "Agent Architecture",
                content: "Learn how agents work - they can reason, plan, and use tools to accomplish complex tasks.",
                interactive: "architecture",
                code: `// Agent Flow
Input → Reasoning → Tool Selection → Tool Execution → Response`
            },
            {
                title: "Creating Custom Tools",
                content: "Build custom tools that your agent can use to interact with external APIs and services.",
                interactive: "tools",
                code: `const weatherTool = new DynamicTool({
  name: "Weather",
  description: "Get current weather for a location",
  func: async (location) => {
    const response = await fetch(\`/api/weather?location=\${location}\`);
    return response.json();
  }
});`
            },
            {
                title: "Agent Configuration",
                content: "Configure your agent with the right tools and reasoning strategy.",
                interactive: "config",
                code: `const agent = await initializeAgentExecutorWithOptions(
  tools,
  llm,
  { agentType: "zero-shot-react-description" }
);`
            },
            {
                title: "Error Handling",
                content: "Implement robust error handling and fallback strategies for your agent.",
                interactive: "errors",
                code: `try {
  const result = await agent.call({ input: userInput });
  return result.output;
} catch (error) {
  console.error("Agent error:", error);
  return "I encountered an error. Please try again.";
}`
            },
            {
                title: "Production Deployment",
                content: "Deploy your agent with proper monitoring and scaling considerations.",
                interactive: "production",
                code: `// Add monitoring
const monitoring = new AgentMonitoring({
  logLevel: "info",
  metrics: true,
  tracing: true
});

agent.use(monitoring);`
            }
        ]
    }
};

// Initialize learn page
document.addEventListener('DOMContentLoaded', function() {
    // Set up search functionality
    PortalUtils.initSearch('tutorial-search', 'tutorial-card', ['title', 'description']);
    
    // Set up filters
    PortalUtils.initFilters('level-filter', 'tutorial-card', 'level');
    
    // Set up learning path interaction
    setupLearningPath();
    
    // Load saved progress
    loadProgress();
});

function setupLearningPath() {
    const pathSteps = document.querySelectorAll('.path-step');
    pathSteps.forEach(step => {
        step.addEventListener('click', function() {
            const level = this.dataset.level;
            filterByLevel(level);
            
            // Update active step
            pathSteps.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterByLevel(level) {
    const levelFilter = document.getElementById(`${level}-filter`);
    if (levelFilter) {
        levelFilter.checked = true;
        levelFilter.dispatchEvent(new Event('change'));
    }
}

function startTutorial(tutorialId) {
    currentTutorial = tutorialId;
    currentStep = 0;
    tutorialSteps = tutorialDetails[tutorialId]?.steps || [];
    
    if (tutorialSteps.length === 0) {
        PortalUtils.showNotification('Tutorial not found', 'error');
        return;
    }
    
    // Show tutorial player
    const tutorialPlayer = document.getElementById('tutorial-player');
    tutorialPlayer.style.display = 'block';
    
    // Initialize tutorial
    setupTutorialNavigation();
    loadTutorialStep(0);
    
    // Scroll to tutorial player
    tutorialPlayer.scrollIntoView({ behavior: 'smooth' });
    
    // Save progress
    saveProgress();
    
    PortalUtils.showNotification(`Started tutorial: ${tutorialDetails[tutorialId].title}`);
}

function setupTutorialNavigation() {
    const stepsNav = document.getElementById('tutorial-steps-nav');
    stepsNav.innerHTML = '';
    
    tutorialSteps.forEach((step, index) => {
        const stepButton = document.createElement('button');
        stepButton.className = 'btn btn-outline-primary btn-sm mb-2 w-100';
        stepButton.textContent = `${index + 1}. ${step.title}`;
        stepButton.addEventListener('click', () => loadTutorialStep(index));
        
        if (index === 0) {
            stepButton.classList.add('active');
        }
        
        stepsNav.appendChild(stepButton);
    });
}

function loadTutorialStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= tutorialSteps.length) return;
    
    currentStep = stepIndex;
    const step = tutorialSteps[stepIndex];
    
    // Update tutorial content
    document.getElementById('current-tutorial-title').textContent = tutorialDetails[currentTutorial].title;
    document.getElementById('current-step-title').textContent = step.title;
    document.getElementById('current-step-content').innerHTML = step.content;
    
    // Update progress
    PortalUtils.updateProgress(stepIndex + 1, tutorialSteps.length);
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    
    prevBtn.disabled = stepIndex === 0;
    nextBtn.textContent = stepIndex === tutorialSteps.length - 1 ? 'Complete' : 'Next';
    
    // Update step navigation
    document.querySelectorAll('#tutorial-steps-nav .btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === stepIndex);
        if (index < stepIndex) {
            btn.classList.add('btn-success');
            btn.classList.remove('btn-outline-primary');
        }
    });
    
    // Load interactive content
    loadInteractiveContent(step);
    
    // Save progress
    saveProgress();
}

function loadInteractiveContent(step) {
    const interactiveDiv = document.getElementById('tutorial-interactive');
    
    switch (step.interactive) {
        case 'demo':
            interactiveDiv.innerHTML = `
                <div class="alert alert-info">
                    <h6><i class="fas fa-play-circle"></i> Try the Demo</h6>
                    <p>Experience what we'll build in this tutorial.</p>
                    <a href="/demos" class="btn btn-primary btn-sm" target="_blank">Open Demo</a>
                </div>
            `;
            break;
            
        case 'setup':
            interactiveDiv.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h6>Setup Instructions</h6>
                    </div>
                    <div class="card-body">
                        <ol>
                            <li>Install Node.js from <a href="https://nodejs.org" target="_blank">nodejs.org</a></li>
                            <li>Open terminal and run: <code>npm install -g flowise</code></li>
                            <li>Start Flowise: <code>npx flowise start</code></li>
                            <li>Open <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></li>
                        </ol>
                        <button class="btn btn-success btn-sm" onclick="markStepComplete()">
                            <i class="fas fa-check"></i> Mark Complete
                        </button>
                    </div>
                </div>
            `;
            break;
            
        case 'builder':
            interactiveDiv.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h6>Visual Builder Simulation</h6>
                    </div>
                    <div class="card-body">
                        <div class="mini-builder">
                            <div class="builder-node" draggable="true">
                                <i class="fas fa-brain"></i>
                                <span>ChatOpenAI</span>
                            </div>
                            <div class="builder-node" draggable="true">
                                <i class="fas fa-keyboard"></i>
                                <span>Input</span>
                            </div>
                            <div class="builder-canvas" ondrop="drop(event)" ondragover="allowDrop(event)">
                                <p>Drag nodes here to build your workflow</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'test':
            interactiveDiv.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h6>Test Your Chatbot</h6>
                    </div>
                    <div class="card-body">
                        <div class="mini-chat">
                            <div class="chat-messages" id="tutorial-chat">
                                <div class="message bot-message">
                                    <i class="fas fa-robot"></i>
                                    <span>Hello! I'm your new chatbot. How can I help you?</span>
                                </div>
                            </div>
                            <div class="input-group">
                                <input type="text" class="form-control" id="tutorial-chat-input" placeholder="Type a message...">
                                <button class="btn btn-primary" onclick="sendTutorialMessage()">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        default:
            interactiveDiv.innerHTML = `
                <div class="alert alert-light">
                    <h6><i class="fas fa-code"></i> Code Example</h6>
                    <pre><code class="language-javascript">${step.code}</code></pre>
                    <button class="btn btn-outline-primary btn-sm" onclick="copyCode()">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                </div>
            `;
            
            // Highlight code
            if (window.Prism) {
                Prism.highlightAll();
            }
    }
}

function nextStep() {
    if (currentStep < tutorialSteps.length - 1) {
        loadTutorialStep(currentStep + 1);
    } else {
        completeTutorial();
    }
}

function previousStep() {
    if (currentStep > 0) {
        loadTutorialStep(currentStep - 1);
    }
}

function completeTutorial() {
    PortalUtils.showNotification('Congratulations! You completed the tutorial!', 'success');
    
    // Mark tutorial as completed
    const completedTutorials = PortalUtils.loadFromLocalStorage('completedTutorials', []);
    if (!completedTutorials.includes(currentTutorial)) {
        completedTutorials.push(currentTutorial);
        PortalUtils.saveToLocalStorage('completedTutorials', completedTutorials);
    }
    
    // Show completion modal or redirect
    setTimeout(() => {
        closeTutorial();
    }, 2000);
}

function closeTutorial() {
    document.getElementById('tutorial-player').style.display = 'none';
    currentTutorial = null;
    currentStep = 0;
    tutorialSteps = [];
    
    // Clear saved progress
    localStorage.removeItem('currentTutorial');
    localStorage.removeItem('currentStep');
}

function toggleTutorialDetails(tutorialId) {
    const modal = document.getElementById('tutorialModal');
    const tutorial = tutorialDetails[tutorialId];
    
    if (!tutorial) return;
    
    // Update modal content
    document.getElementById('tutorialModalTitle').textContent = tutorial.title;
    document.getElementById('tutorialModalBody').innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Tutorial Details</h6>
                <p><strong>Level:</strong> ${tutorial.level}</p>
                <p><strong>Duration:</strong> ${tutorial.duration}</p>
                <p><strong>Description:</strong> ${tutorial.description}</p>
            </div>
            <div class="col-md-6">
                <h6>What You'll Learn</h6>
                <ul>
                    ${tutorial.steps.map(step => `<li>${step.title}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    // Update start button
    document.getElementById('startTutorialBtn').onclick = () => {
        bootstrap.Modal.getInstance(modal).hide();
        startTutorial(tutorialId);
    };
    
    // Show modal
    new bootstrap.Modal(modal).show();
}

function saveProgress() {
    if (currentTutorial) {
        PortalUtils.saveToLocalStorage('currentTutorial', currentTutorial);
        PortalUtils.saveToLocalStorage('currentStep', currentStep);
    }
}

function loadProgress() {
    const savedTutorial = PortalUtils.loadFromLocalStorage('currentTutorial');
    const savedStep = PortalUtils.loadFromLocalStorage('currentStep');
    
    if (savedTutorial && savedStep !== null) {
        // Show resume option
        PortalUtils.showNotification(
            `Resume tutorial: ${tutorialDetails[savedTutorial]?.title}?`,
            'info'
        );
        
        // Add resume button to notification (would need custom notification system)
        setTimeout(() => {
            if (confirm('Resume your previous tutorial?')) {
                startTutorial(savedTutorial);
                loadTutorialStep(savedStep);
            }
        }, 1000);
    }
}

// Helper functions for interactive content
function markStepComplete() {
    PortalUtils.showNotification('Step completed!', 'success');
    setTimeout(() => nextStep(), 1000);
}

function sendTutorialMessage() {
    const input = document.getElementById('tutorial-chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatDiv = document.getElementById('tutorial-chat');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.innerHTML = `<i class="fas fa-user"></i><span>${message}</span>`;
    chatDiv.appendChild(userMsg);
    
    // Add bot response
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot-message';
        botMsg.innerHTML = `<i class="fas fa-robot"></i><span>Great question! I can help you with that.</span>`;
        chatDiv.appendChild(botMsg);
        
        // Scroll to bottom
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }, 1000);
    
    input.value = '';
}

function copyCode() {
    const codeElement = document.querySelector('#tutorial-interactive code');
    if (codeElement) {
        PortalUtils.copyToClipboard(codeElement.textContent);
    }
}

// Drag and drop for builder simulation
function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const canvas = ev.currentTarget;
    canvas.innerHTML = '<p>Great! You\'ve added a node to your workflow.</p>';
    canvas.classList.add('alert', 'alert-success');
}

// Make functions globally available
window.startTutorial = startTutorial;
window.toggleTutorialDetails = toggleTutorialDetails;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.closeTutorial = closeTutorial;
window.markStepComplete = markStepComplete;
window.sendTutorialMessage = sendTutorialMessage;
window.copyCode = copyCode;
window.allowDrop = allowDrop;
window.drop = drop;
