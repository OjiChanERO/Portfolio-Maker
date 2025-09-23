import state from '../state.js';

// Main function that assembles and renders the entire dashboard page.
export function renderDashboardPage() {
    const container = document.createElement('div');
    container.className = 'dashboard-container';
    const { profile, skills = [], userSkills = [], capabilities = [], projects = [], activeDashboardTab, user } = state;

    // Enhanced stats with insights
    const avgScore = userSkills.length > 0
        ? Math.round(userSkills.reduce((sum, s) => sum + s.score, 0) / userSkills.length)
        : 0;

    const expertSkills = userSkills.filter(us => us.score >= 80).length;
    const improvingSkills = userSkills.filter(us => us.score >= 60 && us.score < 80).length;
    const beginnerSkills = userSkills.filter(us => us.score < 60).length;

    const topCategory = capabilities.map(cat => {
        const catSkills = userSkills.filter(us => {
            const skill = skills.find(s => s.id === us.skill_id);
            return skill && skill.capability_id === cat.id;
        });
        const avgCatScore = catSkills.length > 0 
            ? Math.round(catSkills.reduce((sum, s) => sum + s.score, 0) / catSkills.length)
            : 0;
        return { ...cat, score: avgCatScore, count: catSkills.length };
    }).sort((a, b) => b.score - a.score)[0];

    const statsPanel = `
        <div class="hero-section">
            <div class="hero-content">
                <div class="level mb-5">
                    <div class="level-left">
                        <div class="level-item">
                            <div>
                                <h1 class="title is-2 mb-2">
                                    Welcome back, ${profile?.full_name?.split(' ')[0] || 'Developer'}!
                                </h1>
                                <p class="subtitle is-5">Here's your skill development overview</p>
                            </div>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <div class="notification-badge ${skills.length === 0 ? 'is-active' : ''}">
                                <span class="icon"><i class="fas fa-lightbulb"></i></span>
                                <span class="badge-text">
                                    ${skills.length === 0 ? 'Ready to start?' : 'Keep growing!'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i class="fas fa-code"></i>
                    </div>
                    <div class="stat-trend ${skills.length > 0 ? 'up' : ''}">
                        <i class="fas fa-arrow-up"></i>
                    </div>
                </div>
                <div class="stat-content">
                    <div class="stat-number">${skills.length}</div>
                    <div class="stat-label">Total Skills</div>
                    <div class="stat-sublabel">
                        ${expertSkills > 0 ? `${expertSkills} expert level` : 'Add your first skill'}
                    </div>
                </div>
            </div>

            <div class="stat-card success">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-trend ${avgScore > 70 ? 'up' : avgScore > 40 ? 'neutral' : ''}">
                        <i class="fas fa-${avgScore > 70 ? 'arrow-up' : avgScore > 40 ? 'minus' : 'arrow-down'}"></i>
                    </div>
                </div>
                <div class="stat-content">
                    <div class="stat-number">${avgScore}</div>
                    <div class="stat-label">Average Score</div>
                    <div class="stat-sublabel">
                        ${avgScore >= 80 ? 'Expert level!' : avgScore >= 60 ? 'Strong skills' : avgScore > 0 ? 'Building up' : 'Rate your skills'}
                    </div>
                </div>
            </div>

            <div class="stat-card info">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <div class="stat-trend ${capabilities.filter(c => skills.some(s => s.capability_id === c.id)).length > 1 ? 'up' : ''}">
                        <i class="fas fa-chart-line"></i>
                    </div>
                </div>
                <div class="stat-content">
                    <div class="stat-number">${capabilities.filter(c => skills.some(s => s.capability_id === c.id)).length}</div>
                    <div class="stat-label">Active Categories</div>
                    <div class="stat-sublabel">
                        ${topCategory && topCategory.count > 0 ? `Strongest: ${topCategory.name}` : 'Diversify your skills'}
                    </div>
                </div>
            </div>

            <div class="stat-card warning">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i class="fas fa-project-diagram"></i>
                    </div>
                    <div class="stat-trend ${projects.length > 0 ? 'up' : ''}">
                        <i class="fas fa-${projects.length > 0 ? 'arrow-up' : 'plus'}"></i>
                    </div>
                </div>
                <div class="stat-content">
                    <div class="stat-number">${projects.length}</div>
                    <div class="stat-label">Projects</div>
                    <div class="stat-sublabel">
                        ${projects.length > 0 ? 'Showcase your work' : 'Add your first project'}
                    </div>
                </div>
            </div>
        </div>

        ${skills.length > 0 ? `
            <div class="insights-section">
                <h3 class="title is-4 mb-4">
                    <span class="icon-text">
                        <span class="icon has-text-primary"><i class="fas fa-chart-line"></i></span>
                        <span>Your Progress Insights</span>
                    </span>
                </h3>
                <div class="insights-grid">
                    <div class="insight-card">
                        <div class="insight-icon success">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="insight-content">
                            <h4 class="insight-title">Expert Skills</h4>
                            <p class="insight-number">${expertSkills}</p>
                            <p class="insight-description">Skills rated 80+ show your expertise</p>
                        </div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-icon warning">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="insight-content">
                            <h4 class="insight-title">Developing</h4>
                            <p class="insight-number">${improvingSkills}</p>
                            <p class="insight-description">Skills in the 60-79 range</p>
                        </div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-icon info">
                            <i class="fas fa-seedling"></i>
                        </div>
                        <div class="insight-content">
                            <h4 class="insight-title">Growing</h4>
                            <p class="insight-number">${beginnerSkills}</p>
                            <p class="insight-description">Skills under 60 with room to grow</p>
                        </div>
                    </div>
                </div>
            </div>
        ` : ''}
    `;

    // Enhanced tabs with better design
    const tabs = `
        <div class="enhanced-tabs">
            <div class="tab-list">
                <button class="tab-button ${activeDashboardTab === 'skills' ? 'active' : ''}" data-action="switch-tab" data-tab="skills">
                    <span class="tab-icon"><i class="fas fa-code"></i></span>
                    <span class="tab-label">Skills</span>
                    <span class="tab-badge">${skills.length}</span>
                </button>
                <button class="tab-button ${activeDashboardTab === 'projects' ? 'active' : ''}" data-action="switch-tab" data-tab="projects">
                    <span class="tab-icon"><i class="fas fa-project-diagram"></i></span>
                    <span class="tab-label">Projects</span>
                    <span class="tab-badge">${projects.length}</span>
                </button>
                <button class="tab-button ${activeDashboardTab === 'profile' ? 'active' : ''}" data-action="switch-tab" data-tab="profile">
                    <span class="tab-icon"><i class="fas fa-user"></i></span>
                    <span class="tab-label">Profile</span>
                    <span class="tab-badge ${profile?.is_public ? '✓' : '!'}" title="${profile?.is_public ? 'Public' : 'Private'}"></span>
                </button>
            </div>
        </div>
    `;

    let tabContent = '';
    if (activeDashboardTab === 'skills') {
        tabContent = renderSkillsTab(skills, userSkills, capabilities);
    } else if (activeDashboardTab === 'projects') {
        tabContent = renderProjectsTab(projects, skills);
    } else if (activeDashboardTab === 'profile') {
        tabContent = renderProfileTab(profile, user, skills, avgScore);
    }

    container.innerHTML = `
        ${statsPanel}
        ${tabs}
        <div class="tab-content-enhanced">${tabContent}</div>
    `;

    // Add sorting functionality for skills
    setTimeout(() => {
        const sortSelect = document.getElementById('skill-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const sortBy = e.target.value;
                console.log('Sorting by:', sortBy);
            });
        }
    }, 100);

    return container;
}

function renderSkillsTab(skills, userSkills, capabilities) {
    if (skills.length === 0) {
        return `
            <div class="empty-state-enhanced">
                <div class="empty-state-animation">
                    <div class="floating-icons">
                        <i class="fab fa-react"></i>
                        <i class="fab fa-python"></i>
                        <i class="fas fa-database"></i>
                        <i class="fab fa-js-square"></i>
                    </div>
                </div>
                <div class="empty-state-content">
                    <h2 class="title is-2">Build Your Skill Portfolio</h2>
                    <p class="subtitle is-4">Transform your expertise into a visual story</p>
                    
                    <div class="feature-preview">
                        <div class="preview-grid">
                            <div class="preview-item">
                                <div class="preview-icon">
                                    <i class="fas fa-palette"></i>
                                </div>
                                <h4>Choose Icons</h4>
                                <p>30+ professional icons</p>
                            </div>
                            <div class="preview-item">
                                <div class="preview-icon">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                                <h4>Rate Proficiency</h4>
                                <p>0-100 skill scoring</p>
                            </div>
                            <div class="preview-item">
                                <div class="preview-icon">
                                    <i class="fas fa-layer-group"></i>
                                </div>
                                <h4>Organize</h4>
                                <p>Category-based grouping</p>
                            </div>
                            <div class="preview-item">
                                <div class="preview-icon">
                                    <i class="fas fa-share-alt"></i>
                                </div>
                                <h4>Share</h4>
                                <p>Public portfolio links</p>
                            </div>
                        </div>
                    </div>

                    <div class="cta-section">
                        <button class="cta-button" data-action="open-skill-modal" data-id="new">
                            <span class="cta-icon"><i class="fas fa-rocket"></i></span>
                            <span class="cta-text">Add Your First Skill</span>
                        </button>
                        <p class="cta-hint">Start with your strongest technical skill</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Group skills by category for better organization
    const skillsByCategory = capabilities.map(category => ({
        ...category,
        skills: skills.filter(skill => skill.capability_id === category.id).map(skill => ({
            ...skill,
            userSkill: userSkills.find(us => us.skill_id === skill.id)
        }))
    })).filter(category => category.skills.length > 0);

    return `
        <div class="skills-dashboard">
            <div class="skills-header">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <div>
                                <h2 class="title is-3 mb-1">Your Skill Arsenal</h2>
                                <p class="subtitle is-6">Manage and showcase your technical expertise</p>
                            </div>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <div class="field has-addons">
                                <div class="control">
                                    <div class="select">
                                        <select id="skill-sort">
                                            <option value="score">Sort by Score</option>
                                            <option value="name">Sort by Name</option>
                                            <option value="category">Sort by Category</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="control">
                                    <button class="button is-primary" data-action="open-skill-modal" data-id="new">
                                        <span class="icon"><i class="fas fa-plus"></i></span>
                                        <span>Add Skill</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="skills-content" id="skills-content">
                ${skillsByCategory.map(category => `
                    <div class="category-section" data-category="${category.id}">
                        <div class="category-header">
                            <div class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <span class="category-icon">
                                            <i class="${category.icon}"></i>
                                        </span>
                                        <div class="ml-3">
                                            <h3 class="title is-4 mb-1">${category.name}</h3>
                                            <p class="subtitle is-6">${category.skills.length} skill${category.skills.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div class="level-item">
                                        <div class="category-stats">
                                            <span class="stat-pill">
                                                Avg: ${Math.round(category.skills.reduce((sum, skill) => sum + (skill.userSkill?.score || 0), 0) / category.skills.length)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="skills-grid">
                            ${category.skills.map(skill => {
                                const score = skill.userSkill?.score || 0;
                                const scoreLevel = score >= 80 ? 'expert' : score >= 60 ? 'intermediate' : 'beginner';
                                return `
                                    <div class="skill-card ${scoreLevel}" data-skill="${skill.id}">
                                        <div class="skill-card-header">
                                            <div class="skill-icon">
                                                <i class="${skill.icon || 'fas fa-code'}"></i>
                                            </div>
                                            <div class="skill-actions">
                                                <button class="action-btn edit" data-action="edit-skill" data-id="${skill.id}" title="Edit skill">
                                                    <i class="fas fa-pencil-alt"></i>
                                                </button>
                                                <button class="action-btn delete" data-action="delete-skill" data-id="${skill.id}" title="Delete skill">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div class="skill-card-body">
                                            <h4 class="skill-name">${skill.name}</h4>
                                            <p class="skill-description">${skill.description || 'No description provided'}</p>
                                            
                                            <div class="skill-score-section">
                                                <div class="score-display">
                                                    <span class="score-number">${score}</span>
                                                    <span class="score-label">/100</span>
                                                </div>
                                                <div class="score-bar">
                                                    <div class="score-fill" style="width: ${score}%"></div>
                                                </div>
                                                <div class="score-level">${scoreLevel.charAt(0).toUpperCase() + scoreLevel.slice(1)}</div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderProjectsTab(projects, skills) {
    return `
        <div class="projects-section">
            <div class="projects-header">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <div>
                                <h2 class="title is-3 mb-1">Project Showcase</h2>
                                <p class="subtitle is-6">Demonstrate your skills through real projects</p>
                            </div>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <button class="button is-primary" data-action="open-project-modal" data-id="new">
                                <span class="icon"><i class="fas fa-plus"></i></span>
                                <span>Add Project</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            ${projects.length === 0 ? `
                <div class="empty-state-enhanced">
                    <div class="empty-state-animation">
                        <div class="floating-icons">
                            <i class="fas fa-laptop-code"></i>
                            <i class="fas fa-mobile-alt"></i>
                            <i class="fas fa-globe"></i>
                            <i class="fas fa-cogs"></i>
                        </div>
                    </div>
                    <div class="empty-state-content">
                        <h2 class="title is-2">Showcase Your Work</h2>
                        <p class="subtitle is-4">Build a portfolio that tells your professional story</p>
                        
                        <div class="feature-preview">
                            <div class="preview-grid">
                                <div class="preview-item">
                                    <div class="preview-icon">
                                        <i class="fas fa-link"></i>
                                    </div>
                                    <h4>Link Projects</h4>
                                    <p>Add GitHub, live demos</p>
                                </div>
                                <div class="preview-item">
                                    <div class="preview-icon">
                                        <i class="fas fa-tags"></i>
                                    </div>
                                    <h4>Tag Skills</h4>
                                    <p>Connect to your skills</p>
                                </div>
                                <div class="preview-item">
                                    <div class="preview-icon">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                    <h4>Track Impact</h4>
                                    <p>Measure success</p>
                                </div>
                                <div class="preview-item">
                                    <div class="preview-icon">
                                        <i class="fas fa-eye"></i>
                                    </div>
                                    <h4>Public Display</h4>
                                    <p>Show off your work</p>
                                </div>
                            </div>
                        </div>

                        <div class="cta-section">
                            <button class="cta-button" data-action="open-project-modal" data-id="new">
                                <span class="cta-icon"><i class="fas fa-rocket"></i></span>
                                <span class="cta-text">Add Your First Project</span>
                            </button>
                            <p class="cta-hint">Start with your most impressive work</p>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="projects-grid">
                    ${projects.map(project => {
                        const linkedSkills = project.project_skills || [];
                        const skillNames = linkedSkills.map(ps => {
                            const skill = skills.find(s => s.id === ps.skill_id);
                            return skill ? skill.name : '';
                        }).filter(name => name);

                        return `
                            <div class="project-card">
                                <div class="project-card-header">
                                    <div class="project-info">
                                        <h3 class="project-title">${project.title}</h3>
                                        ${project.url ? `
                                            <a href="${project.url}" target="_blank" class="project-url" title="View project">
                                                <i class="fas fa-external-link-alt"></i>
                                            </a>
                                        ` : ''}
                                    </div>
                                    <div class="project-actions">
                                        <button class="action-btn edit" data-action="edit-project" data-id="${project.id}" title="Edit project">
                                            <i class="fas fa-pencil-alt"></i>
                                        </button>
                                        <button class="action-btn delete" data-action="delete-project" data-id="${project.id}" title="Delete project">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="project-card-body">
                                    <p class="project-description">${project.description || 'No description provided'}</p>
                                    
                                    ${skillNames.length > 0 ? `
                                        <div class="project-skills">
                                            <h4 class="skills-title">Technologies Used:</h4>
                                            <div class="skills-tags">
                                                ${skillNames.map(skillName => `
                                                    <span class="skill-tag">${skillName}</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </div>
    `;
}

function renderProfileTab(profile, user, skills, avgScore) {
    const publicLink = `${window.location.origin}${window.location.pathname}#/view/${user?.id || 'demo-user-123'}`;
    return `
        <div class="profile-section">
            <div class="profile-grid">
                <div class="profile-main">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <div class="avatar-placeholder">
                                <i class="fas fa-user"></i>
                            </div>
                        </div>
                        <div class="profile-info">
                            <h2 class="title is-3 mb-1">${profile?.full_name || 'Your Name'}</h2>
                            <p class="subtitle is-6 mb-3">${profile?.bio || 'Add a bio to tell your story'}</p>
                            <div class="profile-status">
                                <span class="status-indicator ${profile?.is_public ? 'public' : 'private'}">
                                    <i class="fas fa-${profile?.is_public ? 'globe' : 'lock'}"></i>
                                    ${profile?.is_public ? 'Public' : 'Private'} Portfolio
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="profile-form-section">
                        <h3 class="title is-4 mb-4">Profile Settings</h3>
                        <form id="profile-form">
                            <div class="field-group">
                                <div class="field">
                                    <label class="label">Full Name</label>
                                    <div class="control has-icons-left">
                                        <input class="input is-large" name="full_name" value="${profile?.full_name || ''}" placeholder="Your full name">
                                        <span class="icon is-left"><i class="fas fa-user"></i></span>
                                    </div>
                                </div>

                                <div class="field">
                                    <label class="label">Professional Bio</label>
                                    <div class="control">
                                        <textarea class="textarea" name="bio" placeholder="Tell your professional story... What drives you? What are you passionate about? What makes you unique?" rows="5">${profile?.bio || ''}</textarea>
                                    </div>
                                    <p class="help">This will appear on your public portfolio. Make it compelling and authentic.</p>
                                </div>

                                <div class="field">
                                    <div class="control">
                                        <label class="checkbox-custom">
                                            <input type="checkbox" name="is_public" ${profile?.is_public ? 'checked' : ''}> 
                                            <span class="checkbox-label">
                                                <span class="checkbox-text">Make Portfolio Public</span>
                                                <span class="checkbox-description">Allow others to discover and view your skills and projects</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="button is-primary is-large">
                                    <span class="icon"><i class="fas fa-save"></i></span>
                                    <span>Save Profile</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="profile-sidebar">
                    <div class="share-section">
                        <div class="share-header">
                            <h3 class="title is-5 mb-3">
                                <span class="icon-text">
                                    <span class="icon has-text-primary"><i class="fas fa-share-alt"></i></span>
                                    <span>Share Your Portfolio</span>
                                </span>
                            </h3>
                            <p class="subtitle is-7">Your professional portfolio link</p>
                        </div>

                        <div class="share-link-section">
                            <div class="field has-addons">
                                <div class="control is-expanded">
                                    <input id="public-link-input" class="input" type="text" value="${publicLink}" readonly>
                                </div>
                                <div class="control">
                                    <button class="button is-info" data-action="copy-public-link">
                                        <span class="icon"><i class="fas fa-copy"></i></span>
                                    </button>
                                </div>
                            </div>

                            <div class="share-actions">
                                <a href="${publicLink}" target="_blank" class="button is-light is-fullwidth mb-3">
                                    <span class="icon"><i class="fas fa-external-link-alt"></i></span>
                                    <span>Preview Portfolio</span>
                                </a>
                            </div>

                            <div class="share-status">
                                ${profile?.is_public ? 
                                    '<div class="notification is-success is-light"><i class="fas fa-check-circle"></i> Portfolio is live and shareable</div>' : 
                                    '<div class="notification is-warning is-light"><i class="fas fa-lock"></i> Enable public access to share</div>'
                                }
                            </div>
                        </div>
                    </div>

                    <div class="portfolio-stats">
                        <h4 class="title is-6 mb-3">Portfolio Health</h4>
                        <div class="health-metrics">
                            <div class="health-metric">
                                <span class="metric-label">Skills Added</span>
                                <span class="metric-value ${skills.length > 0 ? 'good' : 'poor'}">${skills.length}/10+</span>
                            </div>
                            <div class="health-metric">
                                <span class="metric-label">Bio Completed</span>
                                <span class="metric-value ${profile?.bio && profile.bio.length > 50 ? 'good' : 'poor'}">${profile?.bio && profile.bio.length > 50 ? '✓' : '✗'}</span>
                            </div>
                            <div class="health-metric">
                                <span class="metric-label">Public Status</span>
                                <span class="metric-value ${profile?.is_public ? 'good' : 'poor'}">${profile?.is_public ? '✓' : '✗'}</span>
                            </div>
                        </div>
                        
                        <div class="health-tips">
                            <h5 class="title is-7 mb-2">Improvement Tips:</h5>
                            <ul class="tip-list">
                                ${skills.length < 5 ? '<li>Add more skills to showcase your expertise</li>' : ''}
                                ${!profile?.bio || profile.bio.length < 50 ? '<li>Write a compelling professional bio</li>' : ''}
                                ${!profile?.is_public ? '<li>Make your portfolio public to increase visibility</li>' : ''}
                                ${avgScore < 60 ? '<li>Update your skill scores to reflect current abilities</li>' : ''}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
