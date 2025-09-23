// js/components/PublicView.js
// This component renders the read-only, shareable portfolio page.

export function renderPublicPage(publicData) {
    const container = document.createElement('div');
    container.className = 'main-container';
    
    if (!publicData || !publicData.profile?.is_public) {
        container.innerHTML = `
            <div class="columns is-centered">
                <div class="column is-half">
                    <div class="box glass-effect has-text-centered">
                        <span class="icon is-large has-text-grey">
                            <i class="fas fa-lock" style="font-size: 3rem;"></i>
                        </span>
                        <p class="title is-4 mt-4">Profile not found or is private</p>
                        <p class="subtitle is-6">This portfolio is either private or doesn't exist.</p>
                    </div>
                </div>
            </div>
        `;
        return container;
    }

    const { profile, skills = [], projects = [], userSkills = [], capabilities = [] } = publicData;
    
    // Calculate average score
    const avgScore = userSkills.length > 0
        ? Math.round(userSkills.reduce((sum, s) => sum + s.score, 0) / userSkills.length)
        : 0;
    
    // Group skills by category
    const skillsByCategory = capabilities.map(cat => {
        const categorySkills = skills.filter(skill => skill.capability_id === cat.id);
        const categoryScores = userSkills.filter(us => {
            return categorySkills.some(skill => skill.id === us.skill_id);
        });
        const avgCategoryScore = categoryScores.length > 0
            ? Math.round(categoryScores.reduce((sum, s) => sum + s.score, 0) / categoryScores.length)
            : 0;
        
        return {
            ...cat,
            skills: categorySkills.map(skill => ({
                ...skill,
                score: userSkills.find(us => us.skill_id === skill.id)?.score || 0
            })),
            avgScore: avgCategoryScore
        };
    }).filter(cat => cat.skills.length > 0);

    container.innerHTML = `
        <!-- Hero Section -->
        <section class="hero is-medium mb-6">
            <div class="hero-body has-text-centered glass-effect">
                <div class="container">
                    <p class="title is-1">${profile.full_name || 'Portfolio'}</p>
                    <p class="subtitle is-4">${profile.bio || 'Welcome to my portfolio.'}</p>
                    <div class="columns is-centered mt-5">
                        <div class="column is-narrow">
                            <div class="box glass-effect">
                                <p class="title is-2">${skills.length}</p>
                                <p class="subtitle is-6">Skills</p>
                            </div>
                        </div>
                        <div class="column is-narrow">
                            <div class="box glass-effect">
                                <p class="title is-2">${projects.length}</p>
                                <p class="subtitle is-6">Projects</p>
                            </div>
                        </div>
                        <div class="column is-narrow">
                            <div class="box glass-effect">
                                <p class="title is-2">${avgScore}</p>
                                <p class="subtitle is-6">Avg Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Skills Section -->
        ${skills.length > 0 ? `
        <section class="section">
            <div class="container">
                <h2 class="title is-2 has-text-centered mb-6">Skills & Expertise</h2>
                
                ${skillsByCategory.map(category => `
                    <div class="mb-6">
                        <div class="level">
                            <div class="level-left">
                                <div class="level-item">
                                    <h3 class="title is-4 is-flex is-align-items-center">
                                        <span class="icon mr-3">
                                            <i class="${category.icon}" style="color: var(--primary-accent);"></i>
                                        </span>
                                        ${category.name}
                                    </h3>
                                </div>
                            </div>
                            <div class="level-right">
                                <div class="level-item">
                                    <span class="tag is-large is-primary">${category.avgScore}/100</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="columns is-multiline">
                            ${category.skills.map(skill => `
                                <div class="column is-one-third">
                                    <div class="box glass-effect">
                                        <div class="level">
                                            <div class="level-left">
                                                <div class="level-item">
                                                    <div>
                                                        <p class="title is-5 is-flex is-align-items-center">
                                                            <span class="icon mr-2">
                                                                <i class="${skill.icon}"></i>
                                                            </span>
                                                            ${skill.name}
                                                        </p>
                                                        ${skill.description ? `<p class="subtitle is-7">${skill.description}</p>` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="level-right">
                                                <div class="level-item">
                                                    <span class="tag ${skill.score >= 80 ? 'is-success' : skill.score >= 60 ? 'is-warning' : 'is-danger'}">${skill.score}/100</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Projects Section -->
        <section class="section">
            <div class="container">
                <h2 class="title is-2 has-text-centered mb-6">Projects</h2>
                ${projects.length > 0 ? `
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
                ` : `
                    <div class="box glass-effect has-text-centered">
                        <span class="icon is-large has-text-grey">
                            <i class="fas fa-folder-open" style="font-size: 3rem;"></i>
                        </span>
                        <p class="title is-5 mt-4">No projects yet</p>
                        <p class="subtitle is-6">This user hasn't added any projects to showcase.</p>
                    </div>
                `}
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer has-text-centered">
            <div class="content">
                <p>
                    <strong>PortfolioHub</strong> - Showcase your skills and projects
                </p>
                <p class="is-size-7 has-text-grey">
                    Want to create your own portfolio? 
                    <a href="#/dashboard">Sign up for PortfolioHub</a>
                </p>
            </div>
        </footer>
    `;
    
    return container;
}
