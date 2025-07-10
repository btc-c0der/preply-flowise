// Community page functionality

let currentTab = 'discussions';

// Initialize community page
document.addEventListener('DOMContentLoaded', function() {
    // Set up tab switching
    setupTabSwitching();
    
    // Set up form handlers
    setupFormHandlers();
    
    // Initialize search and filters
    initializeCommunityFeatures();
    
    // Load community data
    loadCommunityData();
});

function setupTabSwitching() {
    const tabs = document.querySelectorAll('#communityTabs button');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            currentTab = this.getAttribute('data-bs-target').replace('#', '');
            loadTabContent(currentTab);
        });
    });
}

function setupFormHandlers() {
    // New discussion form
    const discussionForm = document.getElementById('new-discussion-form');
    if (discussionForm) {
        discussionForm.addEventListener('submit', handleNewDiscussion);
    }
    
    // Add reply handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('reply-btn')) {
            showReplyForm(e.target);
        }
        
        if (e.target.classList.contains('like-btn')) {
            handleLike(e.target);
        }
    });
}

function initializeCommunityFeatures() {
    // Search functionality for discussions
    const searchInput = document.getElementById('discussion-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterDiscussions(this.value);
        });
    }
    
    // Tag filters
    document.querySelectorAll('.badge').forEach(badge => {
        badge.addEventListener('click', function() {
            filterByTag(this.textContent);
        });
    });
}

function loadTabContent(tabName) {
    switch (tabName) {
        case 'discussions':
            loadDiscussions();
            break;
        case 'projects':
            loadProjects();
            break;
        case 'help':
            loadQA();
            break;
        case 'resources':
            loadResources();
            break;
    }
}

function loadCommunityData() {
    // Load initial discussions
    loadDiscussions();
    
    // Update stats
    updateCommunityStats();
    
    // Load user profile if logged in
    loadUserProfile();
}

function handleNewDiscussion(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const discussionData = {
        title: formData.get('title') || e.target.querySelector('input').value,
        content: formData.get('content') || e.target.querySelector('textarea').value,
        category: formData.get('category') || e.target.querySelector('select').value,
        author: 'current_user', // Replace with actual user
        timestamp: new Date().toISOString()
    };
    
    // Validate form
    if (!discussionData.title || !discussionData.content) {
        PortalUtils.showNotification('Please fill in all required fields', 'warning');
        return;
    }
    
    // Submit discussion
    submitDiscussion(discussionData);
    
    // Reset form
    e.target.reset();
}

async function submitDiscussion(discussionData) {
    try {
        // In a real app, this would be an API call
        // const response = await PortalUtils.apiRequest('/api/discussions', 'POST', discussionData);
        
        // For demo, add to local storage
        const discussions = PortalUtils.loadFromLocalStorage('community_discussions', []);
        discussionData.id = Date.now();
        discussionData.replies = 0;
        discussionData.likes = 0;
        discussions.unshift(discussionData);
        PortalUtils.saveToLocalStorage('community_discussions', discussions);
        
        PortalUtils.showNotification('Discussion posted successfully!', 'success');
        
        // Refresh discussions
        loadDiscussions();
        
    } catch (error) {
        PortalUtils.showNotification('Failed to post discussion', 'danger');
    }
}

function loadDiscussions() {
    const discussionsContainer = document.querySelector('#discussions .card-body');
    if (!discussionsContainer) return;
    
    // Get discussions from localStorage (in real app, from API)
    const discussions = PortalUtils.loadFromLocalStorage('community_discussions', []);
    
    // If no custom discussions, show default ones
    if (discussions.length === 0) {
        return; // Keep the default HTML discussions
    }
    
    // Render custom discussions
    let discussionsHTML = '';
    discussions.forEach(discussion => {
        discussionsHTML += createDiscussionHTML(discussion);
    });
    
    discussionsContainer.innerHTML = discussionsHTML;
}

function createDiscussionHTML(discussion) {
    const timeAgo = getTimeAgo(new Date(discussion.timestamp));
    return `
        <div class="discussion-item" data-id="${discussion.id}">
            <div class="d-flex">
                <div class="flex-shrink-0">
                    <img src="https://via.placeholder.com/40" class="rounded-circle" alt="User">
                </div>
                <div class="flex-grow-1 ms-3">
                    <h6><a href="#" class="text-decoration-none">${discussion.title}</a></h6>
                    <p class="text-muted small">${discussion.content.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between">
                        <span class="text-muted small">
                            <i class="fas fa-user"></i> ${discussion.author}
                            <i class="fas fa-clock ms-2"></i> ${timeAgo}
                        </span>
                        <span class="text-muted small">
                            <button class="btn btn-sm btn-outline-primary reply-btn" data-id="${discussion.id}">
                                <i class="fas fa-comments"></i> ${discussion.replies} replies
                            </button>
                            <button class="btn btn-sm btn-outline-danger like-btn ms-1" data-id="${discussion.id}">
                                <i class="fas fa-heart"></i> ${discussion.likes}
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <hr>
    `;
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

function showReplyForm(button) {
    const discussionId = button.dataset.id;
    const discussionItem = button.closest('.discussion-item');
    
    // Check if reply form already exists
    if (discussionItem.querySelector('.reply-form')) {
        return;
    }
    
    const replyForm = document.createElement('div');
    replyForm.className = 'reply-form mt-3';
    replyForm.innerHTML = `
        <div class="card">
            <div class="card-body">
                <textarea class="form-control mb-2" rows="3" placeholder="Write your reply..."></textarea>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-secondary me-2" onclick="cancelReply(this)">Cancel</button>
                    <button class="btn btn-sm btn-primary" onclick="submitReply(this, '${discussionId}')">Reply</button>
                </div>
            </div>
        </div>
    `;
    
    discussionItem.appendChild(replyForm);
    
    // Focus on textarea
    replyForm.querySelector('textarea').focus();
}

function submitReply(button, discussionId) {
    const replyForm = button.closest('.reply-form');
    const content = replyForm.querySelector('textarea').value.trim();
    
    if (!content) {
        PortalUtils.showNotification('Please write a reply', 'warning');
        return;
    }
    
    // Submit reply (in real app, API call)
    const discussions = PortalUtils.loadFromLocalStorage('community_discussions', []);
    const discussion = discussions.find(d => d.id == discussionId);
    
    if (discussion) {
        discussion.replies = (discussion.replies || 0) + 1;
        PortalUtils.saveToLocalStorage('community_discussions', discussions);
    }
    
    PortalUtils.showNotification('Reply posted!', 'success');
    
    // Remove reply form
    replyForm.remove();
    
    // Update reply count
    const replyBtn = document.querySelector(`.reply-btn[data-id="${discussionId}"]`);
    if (replyBtn) {
        replyBtn.innerHTML = `<i class="fas fa-comments"></i> ${discussion?.replies || 0} replies`;
    }
}

function cancelReply(button) {
    button.closest('.reply-form').remove();
}

function handleLike(button) {
    const discussionId = button.dataset.id;
    
    // Toggle like (in real app, API call)
    const discussions = PortalUtils.loadFromLocalStorage('community_discussions', []);
    const discussion = discussions.find(d => d.id == discussionId);
    
    if (discussion) {
        discussion.likes = (discussion.likes || 0) + 1;
        PortalUtils.saveToLocalStorage('community_discussions', discussions);
        
        // Update button
        button.innerHTML = `<i class="fas fa-heart"></i> ${discussion.likes}`;
        button.classList.add('text-danger');
        
        PortalUtils.showNotification('Liked!', 'success');
    }
}

function filterDiscussions(query) {
    const discussions = document.querySelectorAll('.discussion-item');
    
    discussions.forEach(discussion => {
        const title = discussion.querySelector('h6').textContent.toLowerCase();
        const content = discussion.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query.toLowerCase()) || content.includes(query.toLowerCase())) {
            discussion.style.display = '';
        } else {
            discussion.style.display = 'none';
        }
    });
}

function filterByTag(tag) {
    const cleanTag = tag.replace('#', '').toLowerCase();
    PortalUtils.showNotification(`Filtering by tag: ${cleanTag}`, 'info');
    
    // In a real app, this would filter discussions by tag
    // For demo, just show notification
}

function loadProjects() {
    // Load project gallery data
    // This would typically be an API call
    console.log('Loading projects...');
}

function loadQA() {
    // Load Q&A data
    console.log('Loading Q&A...');
}

function loadResources() {
    // Load resources data
    console.log('Loading resources...');
}

function updateCommunityStats() {
    // Update community statistics
    // This would typically fetch real data from API
    
    const stats = {
        members: 1247 + Math.floor(Math.random() * 10),
        projects: 356 + Math.floor(Math.random() * 5),
        questions: 892 + Math.floor(Math.random() * 20),
        tutorials: 124 + Math.floor(Math.random() * 3)
    };
    
    // Update DOM elements if they exist
    const statsElements = {
        members: document.querySelector('.card:nth-child(1) h3'),
        projects: document.querySelector('.card:nth-child(2) h3'),
        questions: document.querySelector('.card:nth-child(3) h3'),
        tutorials: document.querySelector('.card:nth-child(4) h3')
    };
    
    Object.keys(stats).forEach(key => {
        if (statsElements[key]) {
            statsElements[key].textContent = stats[key].toLocaleString();
        }
    });
}

function loadUserProfile() {
    // Load user profile data
    // This would check if user is logged in and load their data
    const user = PortalUtils.loadFromLocalStorage('current_user');
    
    if (user) {
        // Update UI for logged in user
        updateUIForLoggedInUser(user);
    }
}

function updateUIForLoggedInUser(user) {
    // Update forms and UI elements for logged in user
    // Add user avatar, name, etc.
    console.log('User logged in:', user);
}

// Project interaction functions
function viewProject(projectId) {
    PortalUtils.showNotification(`Opening project ${projectId}`, 'info');
    // In real app, would open project details
}

function forkProject(projectId) {
    PortalUtils.showNotification(`Forked project ${projectId}`, 'success');
    // In real app, would create a copy of the project
}

function rateProject(projectId, rating) {
    PortalUtils.showNotification(`Rated project ${projectId}: ${rating} stars`, 'success');
    // In real app, would submit rating
}

// Share project function
function shareProject(projectId) {
    const url = `${window.location.origin}/project/${projectId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Check out this AI project',
            url: url
        });
    } else {
        PortalUtils.copyToClipboard(url, 'Project link copied to clipboard!');
    }
}

// Export community data
function exportCommunityData() {
    const discussions = PortalUtils.loadFromLocalStorage('community_discussions', []);
    const data = {
        discussions: discussions,
        exportDate: new Date().toISOString(),
        source: 'Flowise Learning Portal Community'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `community-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize real-time features (if WebSocket available)
function initializeRealTimeFeatures() {
    // In a real app, this would set up WebSocket connections
    // for real-time updates of discussions, new projects, etc.
    console.log('Real-time features initialized');
}

// Make functions globally available
window.submitReply = submitReply;
window.cancelReply = cancelReply;
window.viewProject = viewProject;
window.forkProject = forkProject;
window.rateProject = rateProject;
window.shareProject = shareProject;
window.exportCommunityData = exportCommunityData;
