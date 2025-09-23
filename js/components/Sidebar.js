export function renderSidebar(activeRoute) {
    const container = document.createElement('aside');
    container.className = 'menu p-4 glass-effect';
    container.style.minHeight = '500px';
    container.innerHTML = `
        <p class="menu-label">
            Manage
        </p>
        <ul class="menu-list">
            <li>
                <a href="#/dashboard" class="${activeRoute === '#/dashboard' ? 'is-active' : ''}">
                    <span class="icon-text">
                        <span class="icon"><i class="fas fa-edit"></i></span>
                        <span>Content Dashboard</span>
                    </span>
                </a>
            </li>
        </ul>
        <p class="menu-label">
            Visualize
        </p>
        <ul class="menu-list">
            <li>
                <a href="#/skillmap" class="${activeRoute === '#/skillmap' ? 'is-active' : ''}">
                    <span class="icon-text">
                        <span class="icon"><i class="fas fa-project-diagram"></i></span>
                        <span>Skill Map</span>
                    </span>
                </a>
            </li>
        </ul>
    `;
    return container;
}
