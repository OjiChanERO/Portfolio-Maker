import state from '../state.js';

let lines = { centerToCategory: [], categoryToSkill: [] };

function calculateOrbitalLayout(capabilities, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    const categories = capabilities.reduce((acc, cap) => {
        const category = cap.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(cap);
        return acc;
    }, {});

    const categoryNames = Object.keys(categories);
    const categoryRadius = Math.min(width, height) * 0.22; 
    const layout = { center: { id: 'center', x: centerX, y: centerY }, categories: [], skills: [] };

    categoryNames.forEach((name, i) => {
        const angle = (i / categoryNames.length) * 2 * Math.PI;
        const catX = centerX + categoryRadius * Math.cos(angle);
        const catY = centerY + categoryRadius * Math.sin(angle);
        const categoryNode = { id: `cat-${name}`, name, x: catX, y: catY, icon: categories[name][0]?.icon || 'fas fa-question-circle' };
        layout.categories.push(categoryNode);

        const skills = categories[name];
        const skillRadius = 100; 
        skills.forEach((skill, j) => {
            const skillAngle = (j / skills.length) * 2 * Math.PI;
            skill.x = catX + skillRadius * Math.cos(skillAngle);
            skill.y = catY + skillRadius * Math.sin(skillAngle);
            layout.skills.push(skill);
        });
    });

    return layout;
}

export function renderSkillMapPage() {
    const container = document.createElement('div');
    container.id = 'skill-map-page';
    container.innerHTML = `
        <div id="skill-map-container"></div>
        <div class="modal" id="capability-modal">
            <div class="modal-background" data-action="close-modal"></div>
            <div class="modal-card glass-effect">
                <header class="modal-card-head" id="modal-header"></header>
                <section class="modal-card-body" id="modal-body"></section>
                <footer class="modal-card-foot"><button class="button" data-action="close-modal">Close</button><button id="modal-edit-button" class="button is-primary" data-action="edit-cap-from-modal">Edit</button></footer>
            </div>
        </div>
    `;
    return container;
}

export function initializeSkillMap() {
    const { profile, capabilities, projects } = state;
    const mapContainer = document.getElementById('skill-map-container');
    if (!mapContainer) return;

    const layout = calculateOrbitalLayout(capabilities, mapContainer.clientWidth, mapContainer.clientHeight);
    const avgScore = capabilities.length > 0
        ? (capabilities.reduce((sum, c) => sum + (c.skill_score || 0), 0) / capabilities.length).toFixed(0)
        : '...';

    const centralNodeHTML = `<div id="center-node" class="skill-node is-central" style="left: ${layout.center.x}px; top: ${layout.center.y}px; transform: translate(-50%, -50%);">${avgScore}</div>`;
    
    const categoryNodesHTML = layout.categories.map(c => `
        <div id="${c.id}" class="skill-node is-category" data-category="${c.name}" style="left:${c.x}px; top:${c.y}px; transform: translate(-50%, -50%);">
            <i class="${c.icon}"></i>
        </div>
    `).join('');

    const skillNodesHTML = layout.skills.map(s => `
        <div id="cap-${s.id}" class="skill-node is-skill" data-id="${s.id}" data-category="${s.category}" style="left:${s.x}px; top:${s.y}px; transform: translate(-50%, -50%);">
            <i class="${s.icon || 'fas fa-star'}"></i>
        </div>
    `).join('');

    mapContainer.innerHTML = centralNodeHTML + categoryNodesHTML + skillNodesHTML;

    Object.values(lines).flat().forEach(l => l.line.remove());
    lines = { centerToCategory: [], categoryToSkill: [] };
    const centralNode = document.getElementById('center-node');
    
    layout.categories.forEach(catNode => {
        const line = new LeaderLine(centralNode, document.getElementById(catNode.id), { color: '#475569', size: 3, path: 'straight', endPlug: 'behind' });
        lines.centerToCategory.push({ line, id: catNode.id, name: catNode.name });
    });
    
    layout.skills.forEach(skillNode => {
        const catNodeElem = document.querySelector(`.skill-node.is-category[data-category="${skillNode.category}"]`);
        const line = new LeaderLine(catNodeElem, document.getElementById(`cap-${skillNode.id}`), { color: '#475569', size: 2, path: 'straight', endPlug: 'behind' });
        lines.categoryToSkill.push({ line, id: skillNode.id, category: skillNode.category });
    });

    attachInteractivity(mapContainer, projects);
}

function attachInteractivity(container, projects) {
    const allNodes = container.querySelectorAll('.skill-node');
    const allLines = Object.values(lines).flat().map(l => l.line);

    allNodes.forEach(node => {
        node.addEventListener('mouseover', () => {
            container.classList.add('is-focused');
            const isCategory = node.classList.contains('is-category');
            const isSkill = node.classList.contains('is-skill');
            
            node.classList.add('is-highlighted', 'is-focused');

            if (isCategory) {
                const categoryName = node.dataset.category;
                container.querySelectorAll(`.skill-node.is-skill[data-category="${categoryName}"]`).forEach(n => n.classList.add('is-highlighted'));
                lines.categoryToSkill.filter(l => l.category === categoryName).forEach(l => l.path.classList.add('is-highlighted'));
                lines.centerToCategory.find(l => l.name === categoryName)?.line.path.classList.add('is-highlighted');
            } else if (isSkill) {
                const categoryName = node.dataset.category;
                container.querySelector(`.skill-node.is-category[data-category="${categoryName}"]`)?.classList.add('is-highlighted');
                lines.centerToCategory.find(l => l.name === categoryName)?.line.path.classList.add('is-highlighted');
                lines.categoryToSkill.find(l => l.id === node.dataset.id)?.line.path.classList.add('is-highlighted');
            }
        });

        node.addEventListener('mouseout', () => {
            container.classList.remove('is-focused');
            allNodes.forEach(n => n.classList.remove('is-highlighted', 'is-focused'));
            allLines.forEach(l => l.path.classList.remove('is-highlighted'));
        });

        node.addEventListener('click', () => {
            if (!node.classList.contains('is-skill')) return;
            const capability = state.capabilities.find(c => c.id === node.dataset.id);
            const linkedProjects = projects.filter(p => p.project_capabilities.some(pc => pc.capabilities.id === capability.id));
            const modal = document.getElementById('capability-modal');

            document.getElementById('modal-header').innerHTML = `<p class="modal-card-title">${capability.skill_name}</p><button class="delete" aria-label="close" data-action="close-modal"></button>`;
            document.getElementById('modal-body').innerHTML = `<p class="subtitle">${capability.category || 'No Category'}</p><p>${capability.skill_description || 'No description provided.'}</p><hr><h3 class="title is-5">Related Projects</h3>${linkedProjects.length > 0 ? `<ul>${linkedProjects.map(p => `<li>${p.title}</li>`).join('')}</ul>` : '<p>No projects are linked to this capability yet.</p>'}`;
            document.getElementById('modal-edit-button').dataset.id = capability.id;
            modal.classList.add('is-active');
        });
    });
}
