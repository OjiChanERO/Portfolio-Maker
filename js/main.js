import state from './state.js';
import * as api from './services/api.js';
import { supabaseClient, signUp, signIn, signOut, onAuthStateChange } from './services/auth.js';
import { renderNavbar } from './components/Navbar.js';
import { renderAuthView } from './components/AuthView.js';
import { renderDashboardPage } from './components/Dashboard.js';
import { renderSkillMapPage } from './components/SkillMap.js';
import { renderPublicPage } from './components/PublicView.js';
import { renderIconPickerModal } from './components/IconPicker.js';
import { renderFormModal, getSkillFormHTML, getProjectFormHTML } from './components/Modal.js';

const navbarRoot = document.getElementById('navbar-root');
const app = document.getElementById('app');

const routes = {
    '#/dashboard': () => renderDashboardPage(),
    '#/skillmap': () => renderSkillMapPage(),
};

async function router() {
    const path = window.location.hash || '#/dashboard';
    const [route, userId] = path.split('/');

    navbarRoot.innerHTML = '';
    app.innerHTML = '';

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
}

function openModal(modal) {
    document.querySelector('.modal.is-active')?.remove();
    app.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('is-active'));
}

// Event listeners
app.addEventListener('click', async (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const { action, id, tab } = target.dataset;

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
            const authAction = action === 'signin' ? signIn : signUp;
            const { error } = await authAction(
                form.email.value, 
                form.password.value,
                action === 'signup' ? form.fullName.value : undefined
            );
            if (error) {
                notie.alert({ type: 'error', text: error.message });
            } else {
                notie.alert({ type: 'success', text: action === 'signup' ? 'Account created!' : 'Signed in!' });
            }
            break;
        }
        
        case 'signout': 
            await signOut(); 
            state.user = null;
            window.location.hash = '#/auth'; 
            router();
            break;
            
        case 'open-skill-modal': 
        case 'edit-skill': {
            state.editingSkillId = (id === 'new') ? null : id;
            const skillsWithScores = state.skills.map(s => ({
                ...s, 
                score: state.userSkills.find(us => us.skill_id === s.id)?.score || ''
            }));
            const skillToEdit = state.editingSkillId ? skillsWithScores.find(s => s.id == state.editingSkillId) : null;
            const formHTML = getSkillFormHTML(skillToEdit, state.capabilities);
            const modal = renderFormModal('skill-modal', skillToEdit ? 'Edit Skill' : 'Add New Skill', formHTML);
            openModal(modal);
            break;
        }
        
        case 'delete-skill':
            if (confirm('Are you sure you want to delete this skill?')) {
                await api.deleteSkill(id);
                state.skills = state.skills.filter(s => s.id != id);
                state.userSkills = state.userSkills.filter(us => us.skill_id != id);
                notie.alert({ type: 'success', text: 'Skill deleted!' });
                router();
            }
            break;

        case 'open-project-modal':
        case 'edit-project': {
            state.editingProjectId = (id === 'new') ? null : id;
            const projectToEdit = state.editingProjectId ? state.projects.find(p => p.id == state.editingProjectId) : null;
            const formHTML = getProjectFormHTML(projectToEdit, state.skills);
            const modal = renderFormModal('project-modal', projectToEdit ? 'Edit Project' : 'Add New Project', formHTML);
            openModal(modal);
            break;
        }

        case 'delete-project':
            if (confirm('Are you sure you want to delete this project?')) {
                await api.deleteProject(id);
                state.projects = state.projects.filter(p => p.id != id);
                notie.alert({ type: 'success', text: 'Project deleted!' });
                router();
            }
            break;
            
        case 'open-icon-picker': {
            // Ensure the icon picker modal exists
            let iconModal = document.getElementById('icon-picker-modal');
            if (!iconModal) {
                iconModal = renderIconPickerModal();
                document.body.appendChild(iconModal);
            }
            iconModal.classList.add('is-active');
            break;
        }
            
        case 'select-icon': {
            const iconClass = target.dataset.iconClass;
            const iconInput = document.getElementById('icon-input');
            const iconPreview = document.getElementById('icon-preview');
            
            if (iconInput && iconPreview) {
                iconInput.value = iconClass;
                iconPreview.innerHTML = `<i class="${iconClass}"></i>`;
                
                // Add visual feedback
                iconPreview.style.borderColor = 'var(--primary-accent)';
                iconPreview.style.background = 'rgba(137, 180, 250, 0.1)';
                
                // Show success message
                notie.alert({ 
                    type: 'success', 
                    text: 'Icon selected!',
                    time: 1
                });
            }
            
            target.closest('.modal').classList.remove('is-active');
            break;
        }
        
        case 'copy-public-link': {
            const linkInput = document.getElementById('public-link-input');
            linkInput.select();
            document.execCommand('copy');
            notie.alert({ type: 'success', text: 'Link copied to clipboard!' });
            break;
        }
        
        case 'close-modal': 
        case 'close-icon-picker': 
            target.closest('.modal').remove(); 
            break;
    }
});

// Handle icon input changes
app.addEventListener('input', (event) => {
    if (event.target.id === 'icon-input') {
        const preview = document.getElementById('icon-preview');
        if (preview) {
            preview.innerHTML = `<i class="${event.target.value}"></i>`;
        }
    }
});

// Handle form submissions
app.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Add loading state
    submitButton.classList.add('is-loading');
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (form.id === 'skill-form') {
            const { data: savedData, error } = await api.saveSkill(data, state.editingSkillId, state.user.id);
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
            notie.alert({ type: 'success', text: '✅ Skill saved successfully!', time: 2 });
            form.closest('.modal').remove();
            router();
        }

        if (form.id === 'project-form') {
            // Get selected skills
            const selectedSkills = Array.from(form.querySelectorAll('input[name="skills"]:checked'))
                .map(checkbox => parseInt(checkbox.value));
            
            const projectData = {
                title: data.title,
                description: data.description,
                url: data.url || null
            };

            const { data: savedProject, error } = await api.saveProject(projectData, selectedSkills, state.editingProjectId, state.user.id);
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
            notie.alert({ type: 'success', text: '✅ Project saved successfully!', time: 2 });
            form.closest('.modal').remove();
            router();
        }

        if (form.id === 'profile-form') {
            const profileData = { 
                full_name: formData.get('full_name'), 
                bio: formData.get('bio'), 
                is_public: formData.has('is_public') 
            };
            const { data: updatedProfile, error } = await api.updateProfile(profileData, state.user.id);
            if (error) {
                throw new Error(error.message);
            }
            state.profile = updatedProfile;
            notie.alert({ type: 'success', text: '✅ Profile updated successfully!', time: 2 });
        }
    } catch (error) {
        notie.alert({ 
            type: 'error', 
            text: `❌ Error: ${error.message}`,
            time: 3
        }); 
    } finally {
        // Remove loading state
        submitButton.classList.remove('is-loading');
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
});

// Initialize app
onAuthStateChange(async (user) => {
    state.user = user;
    if (user) {
        const data = await api.fetchUserData(user.id);
        if (data) {
            state.profile = data.profile;
            state.capabilities = data.capabilities || [];
            state.skills = data.skills || [];
            state.userSkills = data.userSkills || [];
            state.projects = data.projects || [];
        }
    }
    await router();
});

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    if (!window.location.hash) window.location.hash = '#/dashboard';
    router();
});
