import state from '../state.js';

function renderCapabilityManagement(editingCapability) {
    const capToEdit = editingCapability || {};
    return `
        <div class="column is-one-third">
            <h2 class="title is-4">Manage Capabilities</h2>
            <div class="box glass-effect" id="capability-form-box">
                <h3 class="title is-5">${capToEdit.id ? 'Edit Capability' : 'Add New'}</h3>
                <form id="capability-form">
                    <div class="field"><label class="label">Skill Name</label><div class="control"><input name="skill_name" class="input" value="${capToEdit.skill_name || ''}" required></div></div>
                    <div class="field"><label class="label">Category</label><div class="control"><input name="category" class="input" value="${capToEdit.category || ''}" placeholder="e.g., Programming, Design"></div></div>
                    <div class="field"><label class="label">Description</label><div class="control"><textarea name="skill_description" class="textarea is-small">${capToEdit.skill_description || ''}</textarea></div></div>
                    <div class="field"><label class="label">Skill Score (0-100)</label><div class="control"><input type="number" name="skill_score" class="input" value="${capToEdit.skill_score || ''}"></div></div>
                    <div class="field is-grouped">
                        <div class="control"><button type="submit" class="button is-primary">${capToEdit.id ? 'Update' : 'Save'}</button></div>
                        ${capToEdit.id ? `<div class="control"><button type="button" class="button is-light" data-action="cancel-edit-cap">Cancel</button></div>` : ''}
                    </div>
                </form>
            </div>
        </div>
    `;
}

function renderProjectManagement(projects, capabilities, editingProject) {
    const projToEdit = editingProject || {};
    const projToEditCaps = projToEdit?.project_capabilities?.map(pc => pc.capabilities.id) || [];
    return `
        <div class="column">
            <h2 class="title is-4">Manage Projects</h2>
            <div class="box glass-effect">
                 <div class="list has-hoverable-list-items">
                    ${projects.map(p => `
                        <div class="list-item">
                            <div class="list-item-content">
                                <p class="list-item-title">${p.title}</p>
                                <p class="list-item-description">${p.description || ''}</p>
                                <div class="tags mt-2">${p.project_capabilities.map(pc => `<span class="tag is-light">${pc.capabilities.skill_name}</span>`).join('')}</div>
                            </div>
                            <div class="list-item-controls">
                                <div class="buttons is-right">
                                    <button class="button is-small is-light" data-action="edit-proj" data-id="${p.id}"><span class="icon"><i class="fas fa-pencil-alt"></i></span></button>
                                    <button class="button is-small is-danger is-light" data-action="delete-proj" data-id="${p.id}"><span class="icon"><i class="fas fa-trash"></i></span></button>
                                </div>
                            </div>
                        </div>
                    `).join('') || '<p class="p-4">No projects added yet.</p>'}
                </div>
            </div>
            <div class="box glass-effect mt-4" id="project-form-box">
                <h3 class="title is-5">${projToEdit.id ? 'Edit Project' : 'Add New'}</h3>
                <form id="project-form">
                    <div class="field"><label class="label">Title</label><div class="control"><input name="title" class="input" value="${projToEdit.title || ''}" required></div></div>
                    <div class="field"><label class="label">Description</label><div class="control"><textarea name="description" class="textarea is-small">${projToEdit.description || ''}</textarea></div></div>
                    <div class="field"><label class="label">Link Capabilities</label>
                        <div class="control capability-checklist">
                            ${capabilities.map(c => `<label class="checkbox"><input type="checkbox" name="capabilities" value="${c.id}" ${projToEditCaps.includes(c.id) ? 'checked' : ''}> ${c.skill_name}</label>`).join('') || '<p>Add capabilities first.</p>'}
                        </div>
                    </div>
                    <div class="field is-grouped">
                        <div class="control"><button type="submit" class="button is-primary">${projToEdit.id ? 'Update' : 'Save'}</button></div>
                        ${projToEdit.id ? `<div class="control"><button type="button" class="button is-light" data-action="cancel-edit-proj">Cancel</button></div>` : ''}
                    </div>
                </form>
            </div>
        </div>
    `;
}

export function renderDashboardPage() {
    const container = document.createElement('div');
    container.className = 'main-container';
    const { profile, capabilities, projects, editingCapabilityId, editingProjectId } = state;
    
    container.innerHTML = `
        <section class="hero is-primary is-small mb-5 glass-effect">
          <div class="hero-body"><p class="title">${profile?.full_name || 'Your Name'}</p><p class="subtitle">${profile?.bio || 'Add a bio by editing your profile in Supabase.'}</p></div>
        </section>
        <div class="columns">
            ${renderCapabilityManagement(capabilities.find(c => c.id === editingCapabilityId))}
            ${renderProjectManagement(projects, capabilities, projects.find(p => p.id === editingProjectId))}
        </div>
    `;
    return container;
}

export function updateCapabilityForm(capability) {
    const formContainer = document.querySelector('.columns > .column:first-child');
    if (formContainer) formContainer.outerHTML = renderCapabilityManagement(capability);
}
export function updateProjectForm(project) {
    const formContainer = document.querySelector('.columns > .column:last-child');
    const { capabilities, projects } = state;
    if (formContainer) formContainer.outerHTML = renderProjectManagement(projects, capabilities, project);
}
