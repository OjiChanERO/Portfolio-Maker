import state from './state.js';
import { onAuthStateChange, signUp, signIn, signOut } from './services/auth.js';
import * as api from './services/api.js';
import { renderNavbar } from './components/Navbar.js';
import { renderAuthView } from './components/AuthView.js';
import { renderDashboardPage, updateCapabilityForm, updateProjectForm } from './components/Dashboard.js';
import { renderSkillMapPage, initializeSkillMap } from './components/SkillMap.js';
import { renderSidebar } from './components/Sidebar.js';

const navbarRoot = document.getElementById('navbar-root');
const app = document.getElementById('app');
let vantaEffect = null;

const routes = {
    '#/dashboard': renderDashboardPage,
    '#/skillmap': renderSkillMapPage,
};

async function router() {
    const path = window.location.hash || '#/dashboard';
    
    navbarRoot.innerHTML = '';
    app.innerHTML = '';

    if (state.user) {
        navbarRoot.appendChild(renderNavbar(state.user));

        if (path === '#/skillmap') {
            document.body.style.overflow = 'hidden';
            app.appendChild(renderSkillMapPage());

            const sidebar = renderSidebar(path);
            sidebar.classList.add('sidebar-on-map');
            app.appendChild(sidebar);
            
            requestAnimationFrame(() => initializeSkillMap());

        } else {
            document.body.style.overflow = 'auto';
            const mainContent = document.createElement('div');
            mainContent.className = 'columns';

            const sidebarContainer = document.createElement('div');
            sidebarContainer.className = 'column is-narrow';
            sidebarContainer.appendChild(renderSidebar(path));

            const pageContainer = document.createElement('div');
            pageContainer.className = 'column';
            pageContainer.appendChild(renderDashboardPage());

            mainContent.appendChild(sidebarContainer);
            mainContent.appendChild(pageContainer);
            app.appendChild(mainContent);
        }

        if (path === '#/skillmap' && vantaEffect) {
            vantaEffect.destroy();
            vantaEffect = null;
        } else if (path !== '#/skillmap' && !vantaEffect) {
            vantaEffect = VANTA.WAVES({
                el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x0f172a,
                shininess: 30.00,
                waveHeight: 15.00,
                waveSpeed: 0.75,
                zoom: 0.85
            });
        }
    } else {
        app.appendChild(renderAuthView());
        if (vantaEffect) {
            vantaEffect.destroy();
            vantaEffect = null;
        }
    }
}

app.addEventListener('click', async (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const { action, id } = target.dataset;
    switch (action) {
        case 'signup': case 'signin': {
            const form = document.getElementById('auth-form');
            const authAction = action === 'signin' ? signIn : signUp;
            const { error } = await authAction(form.email.value, form.password.value, form.fullName?.value);
            if (error) notie.alert({ type: 'error', text: error.message });
            else if (action === 'signup') notie.alert({ type: 'success', text: 'Success! Please check your email to verify.' });
            break;
        }
        case 'signout': await signOut(); window.location.hash = ''; break;
        case 'edit-cap': case 'edit-cap-from-modal':
            state.editingCapabilityId = id;
            if (action === 'edit-cap-from-modal') target.closest('.modal').classList.remove('is-active');
            updateCapabilityForm(state.capabilities.find(c => c.id === id));
            document.querySelector('#capability-form-box').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'cancel-edit-cap': state.editingCapabilityId = null; updateCapabilityForm(null); break;
        case 'delete-cap':
            notie.confirm({ text: 'Are you sure?' }, async () => {
                const { error } = await api.deleteCapability(id);
                if (error) return notie.alert({ type: 'error', text: error.message });
                state.capabilities = state.capabilities.filter(c => c.id !== id);
                notie.alert({ type: 'success', text: 'Capability deleted!' });
                router();
            });
            break;
        case 'edit-proj':
            state.editingProjectId = id;
            updateProjectForm(state.projects.find(p => p.id === id));
            document.querySelector('#project-form-box').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'cancel-edit-proj': state.editingProjectId = null; updateProjectForm(null); break;
        case 'delete-proj':
            notie.confirm({ text: 'Are you sure?' }, async () => {
                const { error } = await api.deleteProject(id);
                if (error) return notie.alert({ type: 'error', text: error.message });
                state.projects = state.projects.filter(p => p.id !== id);
                notie.alert({ type: 'success', text: 'Project deleted!' });
                router();
            });
            break;
        case 'show-details': {
            const capability = state.capabilities.find(c => c.id === id);
            const linkedProjects = state.projects.filter(p => p.project_capabilities.some(pc => pc.capabilities.id === id));
            const modal = document.getElementById('capability-modal');
            document.getElementById('modal-header').innerHTML = `<p class="modal-card-title">${capability.skill_name}</p><button class="delete" aria-label="close" data-action="close-modal"></button>`;
            document.getElementById('modal-body').innerHTML = `<p class="subtitle">${capability.category || 'No Category'}</p><p>${capability.skill_description || 'No description provided.'}</p><hr><h3 class="title is-5">Related Projects</h3>${linkedProjects.length > 0 ? `<ul>${linkedProjects.map(p => `<li>${p.title}</li>`).join('')}</ul>` : '<p>No projects are linked to this capability yet.</p>'}`;
            document.getElementById('modal-edit-button').dataset.id = id;
            modal.classList.add('is-active');
            break;
        }
        case 'close-modal': target.closest('.modal').classList.remove('is-active'); break;
    }
});

app.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    if (form.id === 'capability-form') {
        const capabilityData = {
            user_id: state.user.id,
            skill_name: data.skill_name,
            category: data.category,
            skill_description: data.skill_description,
            skill_score: data.skill_score ? parseInt(data.skill_score) : null,
            icon: data.icon
        };
        if (state.editingCapabilityId) capabilityData.id = state.editingCapabilityId;
        const { data: savedCapability, error } = await api.saveCapability(capabilityData);
        if (error) return notie.alert({ type: 'error', text: `Error: ${error.message}` });
        if (state.editingCapabilityId) {
            const index = state.capabilities.findIndex(c => c.id === state.editingCapabilityId);
            if (index !== -1) state.capabilities[index] = savedCapability;
        } else {
            state.capabilities.push(savedCapability);
        }
        state.editingCapabilityId = null;
        notie.alert({ type: 'success', text: 'Capability saved!' });
        router();
    }
    if (form.id === 'project-form') {
        const projectDetails = {
            user_id: state.user.id,
            title: data.title,
            description: data.description
        };
        if (state.editingProjectId) projectDetails.id = state.editingProjectId;
        const selectedCapIds = formData.getAll('capabilities');
        const { error } = await api.saveProject(projectDetails, selectedCapIds);
        if (error) return notie.alert({ type: 'error', text: `Error: ${error.message}` });
        const updatedUserData = await api.fetchUserData(state.user.id);
        if (updatedUserData) state.projects = updatedUserData.projects || [];
        state.editingProjectId = null;
        notie.alert({ type: 'success', text: 'Project saved!' });
        router();
    }
});

onAuthStateChange(async (user) => {
    state.user = user;
    if (user) {
        const data = await api.fetchUserData(user.id);
        if (data) {
            state.profile = data;
            state.capabilities = data.capabilities || [];
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
