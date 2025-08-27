import state from '../state.js';

let lines = []; // Holds Leader-Line instances

/**
 * Calculates the positions of skills in a spiral/vortex layout.
 * Stronger skills are placed closer to the center.
 * @param {Array} capabilities - The array of user's capabilities.
 * @param {number} width - The width of the container.
 * @param {number} height - The height of the container.
 * @returns {Array} The capabilities array with new x, y coordinates.
 */
function calculateVortexLayout(capabilities, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    // Sort skills so the highest score is first
    const sortedCaps = [...capabilities].sort((a, b) => (b.skill_score || 0) - (a.skill_score || 0));

    return sortedCaps.map((cap, index) => {
        // Calculate distance from center based on score (stronger = closer)
        const maxRadius = Math.min(width, height) * 0.4;
        const normalizedScore = (cap.skill_score || 0) / 100;
        const radius = maxRadius * (1 - (normalizedScore * 0.7)); // Scores have a large impact on radius

        // Calculate angle to distribute nodes evenly in a spiral
        const angle = index * 2.5; // The '2.5' creates a nice spiral distribution

        // Convert polar coordinates (radius, angle) to cartesian (x, y)
        cap.x = centerX + radius * Math.cos(angle);
        cap.y = centerY + radius * Math.sin(angle);
        return cap;
    });
}

/**
 * Renders the HTML shell for the skill map page.
 */
export function renderSkillMapPage() {
    const container = document.createElement('div');
    container.id = 'skill-map-page';
    container.innerHTML = `
        <div id="skill-map-container">
            <!-- Central and skill nodes will be injected here by JS -->
        </div>
        <div class="modal" id="capability-modal">
            <div class="modal-background" data-action="close-modal"></div>
            <div class="modal-card glass-effect">
                <header class="modal-card-head" id="modal-header"></header>
                <section class="modal-card-body" id="modal-body"></section>
                <footer class="modal-card-foot">
                    <button class="button" data-action="close-modal">Close</button>
                    <button id="modal-edit-button" class="button is-primary" data-action="edit-cap-from-modal" data-id="">Edit This Capability</button>
                </footer>
            </div>
        </div>
    `;
    return container;
}

/**
 * Initializes and draws the entire skill map, including nodes and lines.
 */
export function initializeSkillMap() {
    const { profile, capabilities, projects } = state;
    const mapContainer = document.getElementById('skill-map-container');
    if (!mapContainer) return;

    // Calculate the layout
    const positionedCaps = calculateVortexLayout(capabilities, mapContainer.clientWidth, mapContainer.clientHeight);

    // Render the nodes
    const centralNodeHTML = `<div id="center-node" class="skill-node is-central" style="left: 50%; top: 50%; transform: translate(-50%, -50%); width: 180px; height: 180px;">${profile.full_name}</div>`;
    const skillNodesHTML = positionedCaps.map(c => `
        <div id="cap-${c.id}" class="skill-node" 
             style="transform: translate(${c.x}px, ${c.y}px); width: ${80 + (c.skill_score || 0) * 0.6}px; height: ${80 + (c.skill_score || 0) * 0.6}px;"
             data-id="${c.id}" data-category="${c.category || 'Default'}">
            ${c.skill_name}
        </div>
    `).join('');
    mapContainer.innerHTML = centralNodeHTML + skillNodesHTML;

    // Draw the connecting lines
    lines.forEach(line => line.remove());
    lines = [];
    const centralNode = document.getElementById('center-node');
    positionedCaps.forEach(c => {
        const capNode = document.getElementById(`cap-${c.id}`);
        const line = new LeaderLine(centralNode, capNode, {
            startSocket: 'auto',
            endSocket: 'auto',
            color: 'rgba(148, 163, 184, 0.4)',
            size: 2,
            path: 'fluid',
            endPlug: 'behind'
        });
        lines.push({ line, id: c.id });
    });

    // Attach interactivity
    attachInteractivity(mapContainer, projects);
}

/**
 * Attaches hover and click listeners to the skill map nodes.
 */
function attachInteractivity(container, projects) {
    container.addEventListener('mouseover', (e) => {
        const targetNode = e.target.closest('.skill-node');
        if (!targetNode || targetNode.id === 'center-node') return;

        container.classList.add('is-focused');
        targetNode.classList.add('is-focused');

        const capId = targetNode.dataset.id;
        const targetLine = lines.find(l => l.id === capId)?.line;
        if (targetLine) {
            targetLine.setOptions({
                color: targetNode.style.color || 'var(--primary-accent)',
                size: 4,
            });
            targetLine.path.classList.add('is-focused');
        }

        lines.forEach(({ line }) => {
            if (line !== targetLine) line.path.classList.add('is-hidden');
        });
    });

    container.addEventListener('mouseout', (e) => {
        const targetNode = e.target.closest('.skill-node');
        if (!targetNode) return;

        container.classList.remove('is-focused');
        targetNode.classList.remove('is-focused');

        const capId = targetNode.dataset.id;
        const targetLine = lines.find(l => l.id === capId)?.line;
        if (targetLine) {
            targetLine.setOptions({
                color: 'rgba(148, 163, 184, 0.4)',
                size: 2,
            });
            targetLine.path.classList.remove('is-focused');
        }

        lines.forEach(({ line }) => line.path.classList.remove('is-hidden'));
    });
    
    container.addEventListener('click', (e) => {
        const targetNode = e.target.closest('.skill-node');
        if (!targetNode || targetNode.id === 'center-node') return;
        
        const capability = state.capabilities.find(c => c.id === targetNode.dataset.id);
        const linkedProjects = projects.filter(p => p.project_capabilities.some(pc => pc.capabilities.id === capability.id));
        const modal = document.getElementById('capability-modal');

        document.getElementById('modal-header').innerHTML = `<p class="modal-card-title">${capability.skill_name}</p><button class="delete" aria-label="close" data-action="close-modal"></button>`;
        document.getElementById('modal-body').innerHTML = `<p class="subtitle">${capability.category || 'No Category'}</p><p>${capability.skill_description || 'No description provided.'}</p><hr><h3 class="title is-5">Related Projects</h3>${linkedProjects.length > 0 ? `<ul>${linkedProjects.map(p => `<li>${p.title}</li>`).join('')}</ul>` : '<p>No projects are linked to this capability yet.</p>'}`;
        document.getElementById('modal-edit-button').dataset.id = capability.id;
        modal.classList.add('is-active');
    });
}
