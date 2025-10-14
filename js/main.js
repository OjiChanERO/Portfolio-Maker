import state, { stateMutations } from './state.js';
import * as api from './services/api.js';
import { supabaseClient, signUp, signIn, signOut, onAuthStateChange } from './services/auth.js';
import { renderNavbar } from './components/Navbar.js';
import { renderAuthView } from './components/AuthView.js';
import { renderDashboardPage } from './components/Dashboard.js';
import { renderSkillMapPage } from './components/SkillMap.js';
import { renderPublicPage } from './components/PublicView.js';
import { renderIconPickerModal } from './components/IconPicker.js';
import { renderFormModal, getSkillFormHTML, getProjectFormHTML } from './components/Modal.js';

// Safety check for notie
if (typeof notie === 'undefined') {
    console.error('Notie library not loaded. Check script order in index.html');
}

const navbarRoot = document.getElementById('navbar-root');
const app = document.getElementById('app');

const routes = {
    '#/dashboard': () => renderDashboardPage(),
    '#/skillmap': () => renderSkillMapPage(),
};

// Enhanced router with loading states
async function router() {
    const path = window.location.hash || '#/dashboard';
    const [route, userId] = path.split('/');

    // Clear previous content
    navbarRoot.innerHTML = '';
    app.innerHTML = '';
    
    // Show loading state
    showGlobalLoader();

    try {
        if (route === '#view') {
            // Public view
            const publicData = await api.fetchPublicUserData(userId);
            app.appendChild(renderPublicPage(publicData));
        } else if (state.user) {
            // Render navbar with navigation tabs
            navbarRoot.appendChild(renderNavbar(state.user, path));
            
            // Create main content container
            const mainContent = document.createElement('div');
            mainContent.className = 'main-container';
            mainContent.style.padding = '2rem 1rem';
            
            // Render the appropriate page based on current route
            if (path === '#/skillmap') {
                mainContent.appendChild(renderSkillMapPage());
            } else {
                mainContent.appendChild(renderDashboardPage());
            }
            
            app.appendChild(mainContent);
            
            // Add icon picker modal to the app if user is logged in
            if (!document.getElementById('icon-picker-modal')) {
                app.appendChild(renderIconPickerModal());
            }
        } else {
            app.appendChild(renderAuthView());
        }
    } catch (error) {
        console.error('Router error:', error);
        showErrorState('Failed to load page. Please refresh and try again.');
    } finally {
        hideGlobalLoader();
    }
}

// Loading state management
function showGlobalLoader() {
    const loader = document.getElementById('global-loader') || createGlobalLoader();
    loader.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideGlobalLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function createGlobalLoader() {
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.className = 'global-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p class="loader-text">Loading...</p>
        </div>
    `;
    document.body.appendChild(loader);
    return loader;
}

function showErrorState(message) {
    app.innerHTML = `
        <div class="error-state">
            <div class="error-content">
                <i class="fas fa-exclamation-triangle error-icon"></i>
                <h2 class="title is-4">Something went wrong</h2>
                <p class="subtitle">${message}</p>
                <button class="button is-primary" onclick="window.location.reload()">
                    <span class="icon"><i class="fas fa-refresh"></i></span>
                    <span>Refresh Page</span>
                </button>
            </div>
        </div>
    `;
}

// Enhanced modal management
function openModal(modal) {
    const existingModal = document.querySelector('.modal.is-active');
    if (existingModal) existingModal.remove();
    
    app.appendChild(modal);
    
    // Add smooth transition
    requestAnimationFrame(() => {
        modal.classList.add('is-active');
        modal.querySelector('.modal-card').style.transform = 'scale(1)';
        modal.querySelector('.modal-card').style.opacity = '1';
    });
    
    // Focus management for accessibility
    const firstInput = modal.querySelector('input, textarea, select, button');
    if (firstInput) firstInput.focus();
    
    // Escape key handler
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Enhanced form validation with better error messages
function validateSkillForm(formData) {
    const errors = [];
    
    if (!formData.name?.trim()) {
        errors.push('Skill name is required and cannot be empty');
    } else if (formData.name.trim().length < 2) {
        errors.push('Skill name must be at least 2 characters long');
    } else if (formData.name.trim().length > 50) {
        errors.push('Skill name must be less than 50 characters');
    }
    
    if (!formData.capability_id) {
        errors.push('Please select a category for this skill');
    }
    
    if (formData.score && (isNaN(formData.score) || formData.score < 0 || formData.score > 100)) {
        errors.push('Score must be a number between 0 and 100');
    }
    
    if (formData.description && formData.description.length > 500) {
        errors.push('Description must be less than 500 characters');
    }
    
    return errors;
}

function validateProjectForm(formData) {
    const errors = [];
    
    if (!formData.title?.trim()) {
        errors.push('Project title is required');
    } else if (formData.title.trim().length < 3) {
        errors.push('Project title must be at least 3 characters long');
    } else if (formData.title.trim().length > 100) {
        errors.push('Project title must be less than 100 characters');
    }
    
    if (formData.description && formData.description.length > 1000) {
        errors.push('Description must be less than 1000 characters');
    }
    
    if (formData.url && formData.url.trim()) {
        try {
            new URL(formData.url);
        } catch {
            errors.push('Please enter a valid URL (must include http:// or https://)');
        }
    }
    
    return errors;
}

function validateProfileForm(formData) {
    const errors = [];
    
    if (formData.full_name && formData.full_name.length > 100) {
        errors.push('Full name must be less than 100 characters');
    }
    
    if (formData.bio && formData.bio.length > 1000) {
        errors.push('Bio must be less than 1000 characters');
    }
    
    return errors;
}

// Enhanced input sanitization
function sanitizeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.trim();
}

// Debounced functions for better performance
function debounce(func, wait) {
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

// Enhanced search functionality
const debouncedSearch = debounce((searchTerm, type) => {
    const newFilters = {};
    if (type === 'skills') {
        newFilters.skillSearch = searchTerm;
    } else if (type === 'projects') {
        newFilters.projectSearch = searchTerm;
    }
    stateMutations.updateFilters(newFilters);
    router();
}, 300);

// Event listeners with enhanced error handling
app.addEventListener('click', async (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const { action, id, tab } = target.dataset;

    // Prevent double-clicking
    if (target.classList.contains('is-processing')) return;
    target.classList.add('is-processing');

    try {
        switch (action) {
            case 'switch-tab': 
                state.activeDashboardTab = tab; 
                router(); 
                break;

            case 'switch-to-skills':
                state.activeDashboardTab = 'skills';
                target.closest('.modal')?.remove();
                router();
                break;
                
            case 'signup': 
            case 'signin': {
                const form = document.getElementById('auth-form');
                if (!form) return;
                
                // Validate email format
                const email = form.email.value.trim();
                const password = form.password.value;
                
                if (!email || !password) {
                    throw new Error('Email and password are required');
                }
                
                if (!isValidEmail(email)) {
                    throw new Error('Please enter a valid email address');
                }
                
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                }
                
                const authAction = action === 'signin' ? signIn : signUp;
                const fullName = action === 'signup' ? form.fullName.value.trim() : undefined;
                
                if (action === 'signup' && !fullName) {
                    throw new Error('Full name is required for signup');
                }
                
                const { error } = await authAction(email, password, fullName);
                
                if (error) {
                    throw new Error(error.message);
                } else {
                    notie.alert({ 
                        type: 'success', 
                        text: action === 'signup' ? 'Account created successfully!' : 'Welcome back!' 
                    });
                }
                break;
            }
            
            case 'signout': 
                if (confirm('Are you sure you want to sign out?')) {
                    await signOut(); 
                    state.user = null;
                    // Clear any cached data
                    Object.keys(state).forEach(key => {
                        if (Array.isArray(state[key])) state[key] = [];
                        else if (typeof state[key] === 'object' && state[key] !== null) state[key] = null;
                    });
                    window.location.hash = '#/auth'; 
                    router();
                }
                break;
                
            case 'open-skill-modal': 
            case 'edit-skill': {
                state.editingSkillId = (id === 'new') ? null : id;
                const skillsWithScores = state.skills.map(s => ({
                    ...s, 
                    score: state.userSkills.find(us => us.skill_id === s.id)?.score || ''
                }));
                const skillToEdit = state.editingSkillId ? 
                    skillsWithScores.find(s => s.id == state.editingSkillId) : null;
                const formHTML = getSkillFormHTML(skillToEdit, state.capabilities);
                const modal = renderFormModal('skill-modal', 
                    skillToEdit ? 'Edit Skill' : 'Add New Skill', formHTML);
                openModal(modal);
                break;
            }
            
            case 'delete-skill':
                if (confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
                    await api.deleteSkill(id);
                    state.skills = state.skills.filter(s => s.id != id);
                    state.userSkills = state.userSkills.filter(us => us.skill_id != id);
                    notie.alert({ type: 'success', text: 'Skill deleted successfully!' });
                    router();
                }
                break;

            case 'open-project-modal':
            case 'edit-project': {
                state.editingProjectId = (id === 'new') ? null : id;
                const projectToEdit = state.editingProjectId ? 
                    state.projects.find(p => p.id == state.editingProjectId) : null;
                const formHTML = getProjectFormHTML(projectToEdit, state.skills);
                const modal = renderFormModal('project-modal', 
                    projectToEdit ? 'Edit Project' : 'Add New Project', formHTML);
                openModal(modal);
                break;
            }

            case 'delete-project':
                if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                    await api.deleteProject(id);
                    state.projects = state.projects.filter(p => p.id != id);
                    notie.alert({ type: 'success', text: 'Project deleted successfully!' });
                    router();
                }
                break;
                
            case 'open-icon-picker': {
                let iconModal = document.getElementById('icon-picker-modal');
                if (!iconModal) {
                    iconModal = renderIconPickerModal();
                    document.body.appendChild(iconModal);
                }
                iconModal.classList.add('is-active');
                // Focus search input
                const searchInput = iconModal.querySelector('#icon-search-input');
                if (searchInput) setTimeout(() => searchInput.focus(), 100);
                break;
            }
                
            case 'select-icon': {
                const iconClass = target.dataset.iconClass;
                const iconInput = document.getElementById('icon-input');
                const iconPreview = document.getElementById('icon-preview');
                
                if (iconInput && iconPreview) {
                    iconInput.value = iconClass;
                    iconPreview.innerHTML = `<i class="${iconClass}"></i>`;
                    
                    // Enhanced visual feedback
                    iconPreview.style.borderColor = 'var(--primary-accent)';
                    iconPreview.style.background = 'rgba(137, 180, 250, 0.1)';
                    iconPreview.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        if (iconPreview) {
                            iconPreview.style.transform = 'scale(1)';
                        }
                    }, 200);
                    
                    // Show success message
                    notie.alert({ 
                        type: 'success', 
                        text: 'Icon selected successfully!',
                        time: 1.5
                    });
                }
                
                target.closest('.modal').classList.remove('is-active');
                break;
            }
            
            case 'copy-public-link': {
                const linkInput = document.getElementById('public-link-input');
                if (!linkInput) return;
                
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(linkInput.value);
                    } else {
                        // Fallback for older browsers or non-HTTPS
                        linkInput.select();
                        linkInput.setSelectionRange(0, 99999); // For mobile devices
                        document.execCommand('copy');
                    }
                    
                    notie.alert({ 
                        type: 'success', 
                        text: 'Portfolio link copied to clipboard!' 
                    });
                    
                    // Visual feedback
                    const button = target;
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<span class="icon"><i class="fas fa-check"></i></span>';
                    button.classList.add('is-success');
                    
                    setTimeout(() => {
                        if (button) {
                            button.innerHTML = originalHTML;
                            button.classList.remove('is-success');
                        }
                    }, 2000);
                    
                } catch (err) {
                    console.error('Failed to copy: ', err);
                    notie.alert({ 
                        type: 'error', 
                        text: 'Failed to copy link. Please copy manually.' 
                    });
                }
                break;
            }
            
            case 'close-modal': 
            case 'close-icon-picker': 
                const modal = target.closest('.modal');
                if (modal) {
                    modal.classList.remove('is-active');
                    setTimeout(() => modal.remove(), 150);
                }
                break;
        }
    } catch (error) {
        console.error('Action error:', error);
        notie.alert({ 
            type: 'error', 
            text: `Error: ${error.message}`,
            time: 4
        });
    } finally {
        target.classList.remove('is-processing');
    }
});

// Enhanced input handling with debouncing
app.addEventListener('input', (event) => {
    if (event.target.id === 'icon-input') {
        const preview = document.getElementById('icon-preview');
        if (preview && event.target.value) {
            preview.innerHTML = `<i class="${event.target.value}"></i>`;
        }
    }
    
    // Real-time search
    if (event.target.hasAttribute('data-search-type')) {
        const searchType = event.target.getAttribute('data-search-type');
        debouncedSearch(event.target.value, searchType);
    }
});

app.addEventListener('change', (event) => {
    const { action, sortDirection = 'asc' } = event.target.dataset;
    if (action === 'sort-skills') {
        const sortBy = event.target.value;
        stateMutations.updateSorting('skills', sortBy, sortDirection);
        router();
    }
});

// Enhanced form submission with better error handling
app.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    const originalText = submitButton.innerHTML;
    
    // Enhanced loading state
    submitButton.classList.add('is-loading');
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (form.id === 'skill-form') {
            // Enhanced validation
            const validationErrors = validateSkillForm(data);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join('\n'));
            }

            const sanitizedData = {
                ...data,
                name: sanitizeHTML(data.name),
                description: sanitizeHTML(data.description),
                score: data.score ? parseInt(data.score) : null
            };

            const { data: savedData, error } = await api.saveSkill(sanitizedData, state.editingSkillId, state.user.id);
            if (error) {
                throw new Error(error.message);
            }
            
            const { skill: savedSkill, userSkill: savedUserSkill } = savedData;
            if (state.editingSkillId) {
                const skillIndex = state.skills.findIndex(s => s.id == state.editingSkillId);
                if (skillIndex !== -1) state.skills[skillIndex] = savedSkill;
                const scoreIndex = state.userSkills.findIndex(us => us.skill_id == state.editingSkillId);
                if (scoreIndex !== -1 && savedUserSkill) {
                    state.userSkills[scoreIndex] = savedUserSkill;
                } else if (savedUserSkill) {
                    state.userSkills.push(savedUserSkill);
                }
            } else {
                state.skills.push(savedSkill);
                if (savedUserSkill) state.userSkills.push(savedUserSkill);
            }
            
            state.editingSkillId = null;
            notie.alert({ 
                type: 'success', 
                text: state.editingSkillId ? 'Skill updated successfully!' : 'Skill added successfully!', 
                time: 2 
            });
            form.closest('.modal')?.remove();
            router();
        }

        if (form.id === 'project-form') {
            // Enhanced validation
            const validationErrors = validateProjectForm(data);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join('\n'));
            }

            // Get selected skills
            const selectedSkills = Array.from(form.querySelectorAll('input[name="skills"]:checked'))
                .map(checkbox => parseInt(checkbox.value));
            
            const projectData = {
                title: sanitizeHTML(data.title.trim()),
                description: sanitizeHTML(data.description?.trim() || ''),
                url: data.url?.trim() || null
            };

            const { data: savedProject, error } = await api.saveProject(
                projectData, selectedSkills, state.editingProjectId, state.user.id
            );
            if (error) {
                throw new Error(error.message);
            }

            // Update state
            if (state.editingProjectId) {
                const projectIndex = state.projects.findIndex(p => p.id == state.editingProjectId);
                if (projectIndex !== -1) {
                    state.projects[projectIndex] = {
                        ...savedProject,
                        project_skills: selectedSkills.map(skillId => ({ skill_id: skillId }))
                    };
                }
            } else {
                state.projects.push({
                    ...savedProject,
                    project_skills: selectedSkills.map(skillId => ({ skill_id: skillId }))
                });
            }

            state.editingProjectId = null;
            notie.alert({ 
                type: 'success', 
                text: state.editingProjectId ? 'Project updated successfully!' : 'Project added successfully!', 
                time: 2 
            });
            form.closest('.modal')?.remove();
            router();
        }

        if (form.id === 'profile-form') {
            const validationErrors = validateProfileForm(data);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join('\n'));
            }

            const profileData = { 
                full_name: sanitizeHTML(formData.get('full_name')?.trim() || ''), 
                bio: sanitizeHTML(formData.get('bio')?.trim() || ''), 
                is_public: formData.has('is_public') 
            };
            
            const { data: updatedProfile, error } = await api.updateProfile(profileData, state.user.id);
            if (error) {
                throw new Error(error.message);
            }
            state.profile = updatedProfile;
            notie.alert({ type: 'success', text: 'Profile updated successfully!', time: 2 });
        }
    } catch (error) {
        console.error('Form submission error:', error);
        notie.alert({ 
            type: 'error', 
            text: error.message.includes('\n') ? error.message.split('\n')[0] : error.message,
            time: 5
        }); 
    } finally {
        // Remove loading state
        if (submitButton) {
            submitButton.classList.remove('is-loading');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Don't show error for script loading issues
    if (event.error && event.error.message.includes('Script error')) {
        return;
    }
    
    notie.alert({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please refresh the page if the problem persists.',
        time: 5
    });
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    notie.alert({ 
        type: 'error', 
        text: 'A network error occurred. Please check your connection and try again.',
        time: 5
    });
});

// Performance monitoring
let pageLoadTime = performance.now();
window.addEventListener('load', () => {
    pageLoadTime = performance.now() - pageLoadTime;
    console.log(`Page loaded in ${Math.round(pageLoadTime)}ms`);
});

// Initialize app with enhanced error handling
onAuthStateChange(async (user) => {
    state.user = user;
    if (user) {
        try {
            showGlobalLoader();
            const data = await api.fetchUserData(user.id);
            if (data) {
                state.profile = data.profile;
                state.capabilities = data.capabilities || [];
                state.skills = data.skills || [];
                state.userSkills = data.userSkills || [];
                state.projects = data.projects || [];
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            notie.alert({ 
                type: 'error', 
                text: 'Failed to load your data. Please refresh the page or contact support if the problem persists.',
                time: 6
            });
        } finally {
            hideGlobalLoader();
        }
    }
    await router();
});

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    if (!window.location.hash) window.location.hash = '#/dashboard';
    router();
});
