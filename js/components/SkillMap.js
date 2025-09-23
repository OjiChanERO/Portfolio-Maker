import state from '../state.js';


// Renders the Skillmap Page
export function renderSkillMapPage() {
    const container = document.createElement('div');
    container.id = 'skill-map-page';
    
    // Scores panel
    const scoresPanel = document.createElement('div');
    scoresPanel.className = 'scores-panel';
    
    const categories = state.capabilities.map(cat => {
        const relevantSkills = state.userSkills.filter(us => {
            const skill = state.skills.find(s => s.id === us.skill_id);
            return skill && skill.capability_id === cat.id;
        });
        const score = relevantSkills.length > 0 
            ? Math.round(relevantSkills.reduce((sum, s) => sum + s.score, 0) / relevantSkills.length)
            : 0;
        return { ...cat, score, skillCount: relevantSkills.length };
    }).sort((a, b) => b.score - a.score);

    scoresPanel.innerHTML = `
        <div class="mb-5">
            <h3 class="title is-4 mb-4">
                <span class="icon-text">
                    <span class="icon has-text-primary"><i class="fas fa-chart-bar"></i></span>
                    <span>Skill Analytics</span>
                </span>
            </h3>
            <div class="box" style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2);">
                <div class="level">
                    <div class="level-item has-text-centered">
                        <div>
                            <p class="title is-3 has-text-primary">${state.skills.length}</p>
                            <p class="subtitle is-6">Total Skills</p>
                        </div>
                    </div>
                    <div class="level-item has-text-centered">
                        <div>
                            <p class="title is-3 has-text-primary">${categories.length}</p>
                            <p class="subtitle is-6">Categories</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h4 class="title is-5 mb-4">Category Breakdown</h4>
        ${categories.map(cat => `
            <div class="score-card">
                <div style="flex: 1;">
                    <div class="level is-mobile">
                        <div class="level-left">
                            <div class="level-item">
                                <span class="icon is-medium has-text-primary mr-3">
                                    <i class="${cat.icon}" style="font-size: 1.5rem;"></i>
                                </span>
                                <div>
                                    <p class="title is-6 mb-1">${cat.name}</p>
                                    <p class="subtitle is-7 mb-0">${cat.skillCount} skill${cat.skillCount !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">
                                <div class="has-text-right">
                                    <p class="title is-4 has-text-primary mb-1">${cat.score}</p>
                                    <div class="progress-ring">
                                        <svg width="40" height="40">
                                            <circle class="progress-ring__circle" stroke-width="3" fill="transparent" r="18" cx="20" cy="20" data-score="${cat.score}" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
        
        ${state.skills.length > 0 ? `
            <div class="mt-6">
                <h4 class="title is-6 mb-3">Individual Skills</h4>
                ${state.skills.slice(0, 8).map(skill => {
                    const userSkill = state.userSkills.find(us => us.skill_id === skill.id);
                    const category = state.capabilities.find(c => c.id === skill.capability_id);
                    const score = userSkill?.score || 0;
                    const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
                    
                    return `
                        <div class="score-card" style="padding: 1rem;">
                            <div class="level is-mobile">
                                <div class="level-left">
                                    <div class="level-item">
                                        <span class="icon mr-2">
                                            <i class="${skill.icon}" style="color: ${scoreColor};"></i>
                                        </span>
                                        <div>
                                            <p class="is-size-7 has-text-weight-semibold">${skill.name}</p>
                                            <p class="is-size-8 has-text-grey">${category?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div class="level-item">
                                        <span class="tag is-small" style="background: ${scoreColor}; color: white;">${score}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
                ${state.skills.length > 8 ? `<p class="has-text-grey is-size-7 mt-2">...and ${state.skills.length - 8} more skills</p>` : ''}
            </div>
        ` : ''}
    `;
    
    // Skill map panel
    const mapPanel = document.createElement('div');
    mapPanel.className = 'skill-map-panel';
    
    if (state.skills.length === 0) {
        mapPanel.innerHTML = `
            <div class="has-text-centered" style="padding: 4rem 2rem;">
                <div class="icon is-large has-text-grey mb-4">
                    <i class="fas fa-project-diagram" style="font-size: 4rem;"></i>
                </div>
                <h3 class="title is-3">Your Skill Map Awaits</h3>
                <p class="subtitle is-5 mb-5">Add skills to see them visualized here in an interactive skill map</p>
                <div class="box" style="background: rgba(59, 130, 246, 0.05); border: 1px dashed rgba(59, 130, 246, 0.3); max-width: 500px; margin: 0 auto;">
                    <p class="subtitle is-6">Coming features:</p>
                    <div class="content is-size-7">
                        <ul>
                            <li>Interactive node-based visualization</li>
                            <li>Skill relationship mapping</li>
                            <li>Dynamic filtering and grouping</li>
                            <li>Export and sharing capabilities</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    } else {
        mapPanel.innerHTML = `
            <div style="padding: 2rem;">
                <div class="level mb-5">
                    <div class="level-left">
                        <div class="level-item">
                            <div>
                                <h3 class="title is-3 mb-1">Skill Visualization</h3>
                                <p class="subtitle is-6">Interactive map of your expertise</p>
                            </div>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <div class="field is-grouped">
                                <div class="control">
                                    <div class="select is-small">
                                        <select id="skill-filter">
                                            <option value="all">All Categories</option>
                                            ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="skill-map-container" style="background: rgba(15, 23, 42, 0.3); border-radius: 16px; padding: 2rem; min-height: 400px;">
                    <div class="skill-visualization">
                        ${categories.map(category => {
                            const categorySkills = state.skills.filter(skill => skill.capability_id === category.id);
                            return `
                                <div class="category-group mb-5" data-category="${category.id}">
                                    <div class="level">
                                        <div class="level-left">
                                            <div class="level-item">
                                                <h4 class="title is-5">
                                                    <span class="icon has-text-primary mr-2">
                                                        <i class="${category.icon}"></i>
                                                    </span>
                                                    ${category.name}
                                                </h4>
                                            </div>
                                        </div>
                                        <div class="level-right">
                                            <div class="level-item">
                                                <span class="tag is-primary">${category.score}/100</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="skill-nodes" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;">
                                        ${categorySkills.map(skill => {
                                            const userSkill = state.userSkills.find(us => us.skill_id === skill.id);
                                            const score = userSkill?.score || 0;
                                            const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
                                            
                                            return `
                                                <div class="skill-node-card" style="background: rgba(30, 41, 59, 0.7); border: 2px solid ${scoreColor}; border-radius: 12px; padding: 1rem; text-align: center; transition: all 0.2s ease; position: relative;">
                                                    <div style="position: absolute; top: -8px; right: -8px; background: ${scoreColor}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold;">
                                                        ${score}
                                                    </div>
                                                    <span class="icon is-large has-text-primary mb-2">
                                                        <i class="${skill.icon}" style="font-size: 2rem; color: ${scoreColor};"></i>
                                                    </span>
                                                    <p class="title is-6 mb-1">${skill.name}</p>
                                                    <p class="is-size-7 has-text-grey">${skill.description ? skill.description.substring(0, 50) + '...' : 'No description'}</p>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="level mt-5">
                    <div class="level-item has-text-centered">
                        <div>
                            <span class="icon-text">
                                <span class="icon has-text-success"><div style="width: 16px; height: 16px; background: #10b981; border-radius: 50%;"></div></span>
                                <span class="is-size-7">Expert (80+)</span>
                            </span>
                        </div>
                    </div>
                    <div class="level-item has-text-centered">
                        <div>
                            <span class="icon-text">
                                <span class="icon has-text-warning"><div style="width: 16px; height: 16px; background: #f59e0b; border-radius: 50%;"></div></span>
                                <span class="is-size-7">Intermediate (60-79)</span>
                            </span>
                        </div>
                    </div>
                    <div class="level-item has-text-centered">
                        <div>
                            <span class="icon-text">
                                <span class="icon has-text-danger"><div style="width: 16px; height: 16px; background: #ef4444; border-radius: 50%;"></div></span>
                                <span class="is-size-7">Beginner (0-59)</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add filter functionality
        setTimeout(() => {
            const filterSelect = document.getElementById('skill-filter');
            if (filterSelect) {
                filterSelect.addEventListener('change', (e) => {
                    const categoryId = e.target.value;
                    const categoryGroups = document.querySelectorAll('.category-group');
                    
                    categoryGroups.forEach(group => {
                        if (categoryId === 'all' || group.dataset.category === categoryId) {
                            group.style.display = 'block';
                        } else {
                            group.style.display = 'none';
                        }
                    });
                });
            }
        }, 100);
    }
    
    container.appendChild(scoresPanel);
    container.appendChild(mapPanel);
    
    // Animate progress rings
    requestAnimationFrame(() => {
        scoresPanel.querySelectorAll('.progress-ring__circle').forEach(circle => {
            const score = parseInt(circle.dataset.score);
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - (score / 100) * circumference;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
            circle.style.stroke = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
        });

        // Add hover effects to skill nodes
        const skillCards = document.querySelectorAll('.skill-node-card');
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });
    });

    return container;
}
