import { icons } from '../icon-data.js';

// Renders the hidden modal structure for the icon picker.
export function renderIconPickerModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'icon-picker-modal';
    modal.innerHTML = `
        <div class="modal-background" data-action="close-icon-picker"></div>
        <div class="modal-card glass-effect">
            <header class="modal-card-head">
                <p class="modal-card-title">Select an Icon</p>
                <button class="delete" aria-label="close" data-action="close-icon-picker"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <div class="control has-icons-left">
                        <input class="input" type="text" id="icon-search-input" placeholder="Search icons... (e.g. 'react', 'code', 'design')">
                        <span class="icon is-small is-left"><i class="fas fa-search"></i></span>
                    </div>
                </div>
                <div class="icon-grid" id="icon-grid-container">
                    ${renderIconGrid()}
                </div>
            </section>
        </div>
    `;
    
    // Attach search functionality after modal is created
    setTimeout(() => {
        const searchInput = document.getElementById('icon-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', handleIconSearch);
        }
    }, 0);
    
    return modal;
}

// Renders the icon grid HTML
function renderIconGrid(filterText = '') {
    const lowerCaseFilter = filterText.toLowerCase();
    const filteredIcons = filterText ? 
        icons.filter(icon => 
            icon.name.toLowerCase().includes(lowerCaseFilter) || 
            icon.tags.some(tag => tag.toLowerCase().includes(lowerCaseFilter))
        ) : icons;

    if (filteredIcons.length === 0) {
        return `
            <div class="has-text-centered" style="grid-column: 1 / -1; padding: 2rem;">
                <p class="title is-5 has-text-grey">No icons found</p>
                <p class="subtitle is-6 has-text-grey">Try different keywords like "code", "design", or "web"</p>
            </div>
        `;
    }

    return filteredIcons.map(icon => `
        <button class="button is-light icon-picker-button" data-action="select-icon" data-icon-class="${icon.class}" title="${icon.name} - ${icon.tags.join(', ')}">
            <span class="icon is-large"><i class="${icon.class}"></i></span>
            <span class="icon-picker-name">${icon.name}</span>
        </button>
    `).join('');
}

// Handles icon search input
function handleIconSearch(event) {
    const container = document.getElementById('icon-grid-container');
    if (container) {
        container.innerHTML = renderIconGrid(event.target.value);
    }
}
