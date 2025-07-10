// Main JavaScript file for Flowise Learning Portal

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function animateElement(element, animationClass) {
    element.classList.add(animationClass);
    element.addEventListener('animationend', () => {
        element.classList.remove(animationClass);
    }, { once: true });
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to buttons on click
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled && !this.classList.contains('no-loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });

    // Auto-hide alerts after 5 seconds
    document.querySelectorAll('.alert:not(.alert-permanent)').forEach(alert => {
        setTimeout(() => {
            if (alert.parentNode) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    });
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = input.parentNode.querySelector('.invalid-feedback');
        
        // Remove previous error state
        input.classList.remove('is-invalid', 'is-valid');
        if (errorElement) errorElement.style.display = 'none';
        
        // Validate based on input type
        let inputValid = true;
        let errorMessage = '';
        
        if (!value) {
            inputValid = false;
            errorMessage = 'This field is required.';
        } else if (input.type === 'email' && !validateEmail(value)) {
            inputValid = false;
            errorMessage = 'Please enter a valid email address.';
        } else if (input.minLength && value.length < input.minLength) {
            inputValid = false;
            errorMessage = `Minimum ${input.minLength} characters required.`;
        }
        
        // Apply validation state
        if (inputValid) {
            input.classList.add('is-valid');
        } else {
            input.classList.add('is-invalid');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
            isValid = false;
        }
    });
    
    return isValid;
}

// API helper functions
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showNotification(`Error: ${error.message}`, 'danger');
        throw error;
    }
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('LocalStorage Error:', error);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('LocalStorage Error:', error);
        return defaultValue;
    }
}

// Progress tracking
function updateProgress(current, total) {
    const percentage = Math.round((current / total) * 100);
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        bar.style.width = `${percentage}%`;
        bar.setAttribute('aria-valuenow', percentage);
        bar.textContent = `${percentage}%`;
    });
    
    // Update progress text
    const progressTexts = document.querySelectorAll('#progress-text');
    progressTexts.forEach(text => {
        text.textContent = `Step ${current} of ${total}`;
    });
}

// Search functionality
function initSearch(inputId, targetClass, searchFields = ['title', 'description']) {
    const searchInput = document.getElementById(inputId);
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const items = document.querySelectorAll(`.${targetClass}`);
        
        items.forEach(item => {
            if (!query) {
                item.style.display = '';
                return;
            }
            
            let matches = false;
            searchFields.forEach(field => {
                const value = item.dataset[field] || '';
                if (value.toLowerCase().includes(query)) {
                    matches = true;
                }
            });
            
            item.style.display = matches ? '' : 'none';
        });
    });
}

// Filter functionality
function initFilters(filterName, targetClass, dataAttribute) {
    const filters = document.querySelectorAll(`input[name="${filterName}"]`);
    if (!filters.length) return;
    
    filters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (!this.checked) return;
            
            const filterValue = this.value;
            const items = document.querySelectorAll(`.${targetClass}`);
            
            items.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = '';
                } else {
                    const itemValue = item.dataset[dataAttribute];
                    item.style.display = itemValue === filterValue ? '' : 'none';
                }
            });
        });
    });
}

// Copy to clipboard functionality
function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(successMessage);
        }).catch(err => {
            console.error('Could not copy text: ', err);
            fallbackCopyTextToClipboard(text, successMessage);
        });
    } else {
        fallbackCopyTextToClipboard(text, successMessage);
    }
}

function fallbackCopyTextToClipboard(text, successMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification(successMessage);
        } else {
            showNotification('Failed to copy text', 'danger');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showNotification('Failed to copy text', 'danger');
    }
    
    document.body.removeChild(textArea);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Export functions for use in other scripts
window.PortalUtils = {
    showNotification,
    animateElement,
    validateForm,
    apiRequest,
    saveToLocalStorage,
    loadFromLocalStorage,
    updateProgress,
    initSearch,
    initFilters,
    copyToClipboard
};
