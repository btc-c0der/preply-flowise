// Study Guide Enhanced Functionality

class StudyGuideManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeFilters();
        this.setupProgressTracking();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.filterProjects();
            }, 300));
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterProjects();
            });
        }

        // Difficulty filter (if we add one)
        const difficultyFilter = document.getElementById('difficultyFilter');
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', () => {
                this.filterProjects();
            });
        }
    }

    initializeFilters() {
        // Populate category filter options based on available projects
        const categories = new Set();
        document.querySelectorAll('.project-card').forEach(card => {
            const category = card.dataset.category;
            if (category && category !== 'undefined') {
                categories.add(category);
            }
        });

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter && categories.size > 0) {
            // Clear existing options except "All Categories"
            const defaultOption = categoryFilter.querySelector('option[value=""]');
            categoryFilter.innerHTML = '';
            categoryFilter.appendChild(defaultOption);

            // Add new options
            Array.from(categories).sort().forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    }

    filterProjects() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const projectCards = document.querySelectorAll('.project-card');
        let visibleCount = 0;

        projectCards.forEach(card => {
            const title = card.dataset.title || '';
            const uses = card.dataset.uses || '';
            const category = card.dataset.category || '';
            
            const matchesSearch = title.includes(searchTerm) || 
                                uses.includes(searchTerm) ||
                                card.textContent.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || category === categoryFilter;
            
            if (matchesSearch && matchesCategory) {
                this.showCard(card);
                visibleCount++;
            } else {
                this.hideCard(card);
            }
        });

        // Show/hide no results message
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Update results count
        this.updateResultsCount(visibleCount);
    }

    showCard(card) {
        card.style.display = 'block';
        card.classList.remove('filtering-out');
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 10);
    }

    hideCard(card) {
        card.classList.add('filtering-out');
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    updateResultsCount(count) {
        let countElement = document.getElementById('resultsCount');
        if (!countElement) {
            // Create results count element if it doesn't exist
            const searchContainer = document.querySelector('.row.mb-4');
            if (searchContainer) {
                countElement = document.createElement('div');
                countElement.id = 'resultsCount';
                countElement.className = 'col-12 text-muted small mt-2';
                searchContainer.appendChild(countElement);
            }
        }
        
        if (countElement) {
            const total = document.querySelectorAll('.project-card').length;
            countElement.textContent = `Showing ${count} of ${total} projects`;
        }
    }

    setupProgressTracking() {
        // Track which projects user has viewed
        const viewedProjects = JSON.parse(localStorage.getItem('viewedProjects') || '[]');
        
        // Mark viewed projects
        viewedProjects.forEach(projectId => {
            const card = document.querySelector(`[data-project-id="${projectId}"]`);
            if (card) {
                card.classList.add('viewed');
                // Add a small indicator
                const indicator = document.createElement('span');
                indicator.className = 'badge bg-success position-absolute top-0 end-0 m-2';
                indicator.innerHTML = '<i class="fas fa-check"></i>';
                indicator.style.transform = 'translate(50%, -50%)';
                card.querySelector('.card').style.position = 'relative';
                card.querySelector('.card').appendChild(indicator);
            }
        });
    }

    markProjectAsViewed(projectIndex) {
        const viewedProjects = JSON.parse(localStorage.getItem('viewedProjects') || '[]');
        if (!viewedProjects.includes(projectIndex)) {
            viewedProjects.push(projectIndex);
            localStorage.setItem('viewedProjects', JSON.stringify(viewedProjects));
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    exportProgress() {
        const viewedProjects = JSON.parse(localStorage.getItem('viewedProjects') || '[]');
        const progressData = {
            viewedProjects,
            totalProjects: document.querySelectorAll('.project-card').length,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(progressData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'study-guide-progress.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

// Enhanced project modal functionality
function showProjectModal(index) {
    if (!window.projectsData || !window.projectsData[index]) {
        console.error('Project data not found for index:', index);
        return;
    }

    const project = window.projectsData[index];
    const modal = new bootstrap.Modal(document.getElementById('projectModal'));
    
    // Mark as viewed
    if (window.studyGuideManager) {
        window.studyGuideManager.markProjectAsViewed(index);
    }
    
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalBody').innerHTML = `
        <div class="mb-3">
            <h6 class="text-primary"><i class="fas fa-cogs me-1"></i> Technology Stack</h6>
            <p class="text-secondary">${project.uses}</p>
        </div>
        <div class="mb-3">
            <h6 class="text-success"><i class="fas fa-lightbulb me-1"></i> Project Description</h6>
            <p class="text-secondary">${project.notes || 'No detailed description available.'}</p>
        </div>
        ${project.more_notes ? `
        <div class="mb-3">
            <h6 class="text-info"><i class="fas fa-info-circle me-1"></i> Implementation Notes</h6>
            <p class="text-secondary">${project.more_notes}</p>
        </div>
        ` : ''}
        <div class="mb-3">
            <h6 class="text-warning"><i class="fas fa-book me-1"></i> Learning Objectives</h6>
            <ul class="list-unstyled">
                ${project.learning_points.map(point => `<li class="text-secondary"><i class="fas fa-arrow-right text-primary me-2"></i>${point}</li>`).join('')}
            </ul>
        </div>
        <div class="mb-3">
            <h6 class="text-danger"><i class="fas fa-prerequisite me-1"></i> Recommended Prerequisites</h6>
            <ul class="list-unstyled">
                ${project.prerequisites.map(prereq => `<li class="text-secondary"><i class="fas fa-check text-success me-2"></i>${prereq}</li>`).join('')}
            </ul>
        </div>
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Difficulty Level:</strong> ${project.difficulty}
        </div>
    `;
    
    modal.show();
}

function startProject() {
    // This could redirect to a tutorial or implementation guide
    alert('This feature would typically redirect to a detailed tutorial, implementation guide, or external resources for the selected project.');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press '/' to focus search
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Press 'Escape' to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
            if (window.studyGuideManager) {
                window.studyGuideManager.filterProjects();
            }
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.studyGuideManager = new StudyGuideManager();
    
    // Add keyboard shortcut hint
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = 'Search projects... (Press / to focus)';
    }
});
