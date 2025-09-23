// js/state.js
// Exports an object called state
// The objects holds all the information required by the app to function properly 

const state = {
    user: null,
    profile: null,
    projects: [],
    capabilities: [],
    skills: [],
    userSkills: [],
    editingProjectId: null,
    editingSkillId: null,
    activeDashboardTab: 'skills',
};

export default state;
