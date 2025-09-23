// A reusable function to create the shell for our forms.
export function renderFormModal(modalId, title, formHTML) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = modalId;
    modal.innerHTML = `
        <div class="modal-background" data-action="close-modal"></div>
        <div class="modal-card glass-effect">
            <header class="modal-card-head">
                <p class="modal-card-title">${title}</p>
                <button class="delete" aria-label="close" data-action="close-modal"></button>
            </header>
            <section class="modal-card-body">
                ${formHTML}
            </section>
        </div>
    `;
    return modal;
}

// Generates the raw HTML for the skill form, to be placed inside a modal.
export function getSkillFormHTML(skillToEdit, capabilities) {
    const skill = skillToEdit || {};
    return `
        <form id="skill-form">
            <div class="field">
                <label class="label">Skill Name</label>
                <div class="control">
                    <input name="name" class="input" value="${skill.name || ''}" required placeholder="e.g., React, Node.js, Python">
                </div>
            </div>
            <div class="field">
                <label class="label">Parent Capability</label>
                <div class="control">
                    <div class="select is-fullwidth">
                        <select name="capability_id" required>
                            <option value="">Select a category...</option>
                            ${capabilities.map(c => `
                                <option value="${c.id}" ${skill.capability_id == c.id ? 'selected' : ''}>${c.name}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <p class="help">Choose the category that best describes this skill</p>
            </div>
            <div class="field">
                <label class="label">Icon</label>
                <div class="field has-addons">
                    <div class="control is-expanded">
                        <input name="icon" id="icon-input" class="input" value="${skill.icon || ''}" placeholder="e.g., fab fa-react">
                    </div>
                    <div class="control">
                        <button type="button" class="button is-light" data-action="open-icon-picker">Choose</button>
                    </div>
                    <div class="control">
                        <span id="icon-preview" class="icon-preview">
                            <i class="${skill.icon || 'fas fa-question-circle'}"></i>
                        </span>
                    </div>
                </div>
                <p class="help">Use FontAwesome icon classes or click "Choose" to browse available icons</p>
            </div>
            <div class="field">
                <label class="label">Your Score (0-100)</label>
                <div class="control">
                    <input name="score" type="number" min="0" max="100" class="input" value="${skill.score || ''}" placeholder="Rate your proficiency">
                </div>
                <p class="help">0 = Beginner, 50 = Intermediate, 80+ = Expert</p>
            </div>
            <div class="field">
                <label class="label">Description</label>
                <div class="control">
                    <textarea name="description" class="textarea is-small" placeholder="Brief description of your experience with this skill...">${skill.description || ''}</textarea>
                </div>
            </div>
            <div class="field is-grouped is-justify-content-flex-end">
                <div class="control">
                    <button type="button" class="button is-light" data-action="close-modal">Cancel</button>
                </div>
                <div class="control">
                    <button type="submit" class="button is-primary">${skill.id ? 'Update Skill' : 'Save Skill'}</button>
                </div>
            </div>
        </form>
    `;
}

// Generates the raw HTML for the project form.
export function getProjectFormHTML(projectToEdit, skills) {
    const project = projectToEdit || {};
    const projToEditSkills = project.project_skills?.map(ps => ps.skill_id) || [];
    
    return `
        <form id="project-form">
            <div class="field">
                <label class="label">Project Title</label>
                <div class="control">
                    <input name="title" class="input" value="${project.title || ''}" required placeholder="My Awesome Project">
                </div>
                <p class="help">Choose a clear, descriptive name for your project</p>
            </div>
            <div class="field">
                <label class="label">Description</label>
                <div class="control">
                    <textarea name="description" class="textarea" placeholder="Describe what you built, the problem it solves, and what makes it interesting..." rows="4">${project.description || ''}</textarea>
                </div>
                <p class="help">Explain your project's purpose, features, and impact</p>
            </div>
            <div class="field">
                <label class="label">Project URL (optional)</label>
                <div class="control has-icons-left">
                    <input name="url" type="url" class="input" value="${project.url || ''}" placeholder="https://github.com/username/project or https://myproject.com">
                    <span class="icon is-small is-left">
                        <i class="fas fa-link"></i>
                    </span>
                </div>
                <p class="help">Link to GitHub repository, live demo, or project homepage</p>
            </div>
            <div class="field">
                <label class="label">Technologies & Skills Used</label>
                <div class="control">
                    ${skills.length > 0 ? `
                        <div class="skill-selection-grid">
                            ${skills.map(s => `
                                <label class="skill-checkbox">
                                    <input type="checkbox" name="skills" value="${s.id}" ${projToEditSkills.includes(s.id) ? 'checked' : ''}> 
                                    <span class="skill-checkbox-content">
                                        <span class="skill-icon">
                                            <i class="${s.icon || 'fas fa-code'}"></i>
                                        </span>
                                        <span class="skill-name">${s.name}</span>
                                    </span>
                                </label>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="notification is-info is-light">
                            <div class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <span class="icon">
                                            <i class="fas fa-info-circle"></i>
                                        </span>
                                        <span>Add skills first to link them to projects.</span>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div class="level-item">
                                        <button type="button" class="button is-small is-info" data-action="switch-to-skills">
                                            Add Skills
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `}
                </div>
                <p class="help">Select the skills and technologies you used in this project</p>
            </div>
            <div class="field is-grouped is-justify-content-flex-end">
                <div class="control">
                    <button type="button" class="button is-light" data-action="close-modal">Cancel</button>
                </div>
                <div class="control">
                    <button type="submit" class="button is-primary">${project.id ? 'Update Project' : 'Save Project'}</button>
                </div>
            </div>
        </form>
    `;
}
