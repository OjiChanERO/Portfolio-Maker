import { supabaseClient } from './auth.js';

// Fetches all data needed for the application in one go.
export async function fetchUserData(userId) {
    try {
        const [profileRes, capabilitiesRes, skillsRes, userSkillsRes, projectsRes] = await Promise.all([
            supabaseClient.from('profiles').select('*').eq('id', userId).single(),
            supabaseClient.from('capabilities').select('*'),
            supabaseClient.from('skills').select('*').eq('user_id', userId),
            supabaseClient.from('user_skills').select('*').eq('user_id', userId),
            supabaseClient.from('projects').select('*, project_skills(skill_id)').eq('user_id', userId)
        ]);

        // Handle case where profile doesn't exist yet (not an error)
        if (profileRes.error && profileRes.error.code !== 'PGRST116') {
            throw profileRes.error;
        }
        if (capabilitiesRes.error) throw capabilitiesRes.error;
        if (skillsRes.error) throw skillsRes.error;
        if (userSkillsRes.error) throw userSkillsRes.error;
        if (projectsRes.error) throw projectsRes.error;

        return {
            profile: profileRes.data || { id: userId, full_name: '', bio: '', is_public: false },
            capabilities: capabilitiesRes.data || [],
            skills: skillsRes.data || [],
            userSkills: userSkillsRes.data || [],
            projects: projectsRes.data || []
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        notie.alert({ type: 'error', text: 'Could not load user data.' });
        return null;
    }
}

// Fetches public user data for sharing
export async function fetchPublicUserData(userId) {
    try {
        const [profileRes, skillsRes, userSkillsRes, capabilitiesRes, projectsRes] = await Promise.all([
            supabaseClient.from('profiles').select('*').eq('id', userId).eq('is_public', true).single(),
            supabaseClient.from('skills').select('*').eq('user_id', userId),
            supabaseClient.from('user_skills').select('*').eq('user_id', userId),
            supabaseClient.from('capabilities').select('*'),
            supabaseClient.from('projects').select('*').eq('user_id', userId)
        ]);

        if (profileRes.error) {
            return null; // Profile not found or not public
        }

        return {
            profile: profileRes.data,
            skills: skillsRes.data || [],
            userSkills: userSkillsRes.data || [],
            capabilities: capabilitiesRes.data || [],
            projects: projectsRes.data || []
        };
    } catch (error) {
        console.error("Error fetching public user data:", error);
        return null;
    }
}

// Saves a skill and its associated score in two steps.
export async function saveSkill(formData, editingSkillId, userId) {
    const skillDetails = {
        user_id: userId,
        name: formData.name,
        capability_id: parseInt(formData.capability_id),
        icon: formData.icon,
        description: formData.description,
    };
    if (editingSkillId) skillDetails.id = editingSkillId;

    const { data: savedSkill, error: skillError } = await supabaseClient
        .from('skills')
        .upsert(skillDetails)
        .select()
        .single();
    
    if (skillError) return { error: skillError };

    let savedUserSkill = null;
    if (formData.score && formData.score !== '') {
        const scoreDetails = {
            user_id: userId,
            skill_id: savedSkill.id,
            score: parseInt(formData.score)
        };
        const { data, error: scoreError } = await supabaseClient
            .from('user_skills')
            .upsert(scoreDetails, { onConflict: 'user_id, skill_id' })
            .select()
            .single();
        
        if (scoreError) return { error: scoreError };
        savedUserSkill = data;
    }

    return { data: { skill: savedSkill, userSkill: savedUserSkill } };
}

// Deletes a skill. The database cascade will handle deleting related scores and project links.
export async function deleteSkill(skillId) {
    return await supabaseClient.from('skills').delete().eq('id', skillId);
}

// Saves a project and its linked skills.
export async function saveProject(projectDetails, selectedSkillIds, editingProjectId, userId) {
    const projectData = { ...projectDetails, user_id: userId };
    if (editingProjectId) projectData.id = editingProjectId;
    
    const { data: savedProject, error: projectError } = await supabaseClient
        .from('projects')
        .upsert(projectData)
        .select()
        .single();
    
    if (projectError) return { error: projectError };

    // Clear existing project skills first
    const { error: deleteError } = await supabaseClient
        .from('project_skills')
        .delete()
        .eq('project_id', savedProject.id);
    
    if (deleteError) return { error: deleteError };

    // Insert new project skills if any are selected
    if (selectedSkillIds && selectedSkillIds.length > 0) {
        const linksToInsert = selectedSkillIds.map(skillId => ({
            project_id: savedProject.id,
            skill_id: parseInt(skillId)
        }));
        
        const { error: insertError } = await supabaseClient
            .from('project_skills')
            .insert(linksToInsert);
        
        if (insertError) return { error: insertError };
    }
    
    return { data: savedProject };
}

// Deletes a project.
export async function deleteProject(projectId) {
    return await supabaseClient.from('projects').delete().eq('id', projectId);
}

// Updates user profile
export async function updateProfile(profileData, userId) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .upsert({ ...profileData, id: userId })
        .select()
        .single();
    
    return { data, error };
}
