// js/services/api.js
import { supabaseClient } from './auth.js';

/**
 * Fetches all user data by running three separate, concurrent queries and combining the results.
 * @param {string} userId - The UUID of the logged-in user.
 * @returns {Promise<object|null>} The user's complete data object, or null if an error occurs.
 */
export async function fetchUserData(userId) {
    try {
        // Use Promise.all to run all three network requests at the same time for maximum speed.
        const [profileRes, projectsRes, capabilitiesRes] = await Promise.all([
            // Query 1: Get the user's profile
            supabaseClient.from('profiles').select('*').eq('id', userId).single(),
            
            // Query 2: Get the user's projects and their linked capabilities
            supabaseClient.from('projects').select('*, project_capabilities(capabilities(id, skill_name))').eq('user_id', userId),
            
            // Query 3: Get all of the user's capabilities
            supabaseClient.from('capabilities').select('*').eq('user_id', userId)
        ]);

        // Check for errors in each response
        if (profileRes.error && profileRes.error.code !== 'PGRST116') throw profileRes.error;
        if (projectsRes.error) throw projectsRes.error;
        if (capabilitiesRes.error) throw capabilitiesRes.error;

        // Combine the results into a single object that the rest of the app can use
        const fullProfile = profileRes.data || { id: userId }; // Create a shell profile if one doesn't exist yet
        fullProfile.projects = projectsRes.data || [];
        fullProfile.capabilities = capabilitiesRes.data || [];
        
        return fullProfile;

    } catch (error) {
        console.error("Error fetching user data:", error);
        notie.alert({ type: 'error', text: 'Could not load profile data. Please check the console.' });
        return null;
    }
}

/**
 * Creates or updates a capability in the database.
 * @param {object} capabilityData - The capability object to save. Must include user_id. Can optionally include id for updates.
 * @returns {Promise} The result of the Supabase upsert call.
 */
export async function saveCapability(capabilityData) {
    return await supabaseClient.from('capabilities').upsert(capabilityData).select().single();
}

/**
 * Deletes a capability from the database by its ID.
 * @param {string} id - The UUID of the capability to delete.
 * @returns {Promise} The result of the Supabase delete call.
 */
export async function deleteCapability(id) {
    return await supabaseClient.from('capabilities').delete().eq('id', id);
}

/**
 * Saves a project and handles its many-to-many relationship with capabilities.
 * @param {object} projectDetails - The project object to save. Must include user_id. Can optionally include id for updates.
 * @param {string[]} selectedCapIds - An array of capability UUIDs to link to this project.
 * @returns {Promise<object>} An object containing either the saved project data or an error.
 */
export async function saveProject(projectDetails, selectedCapIds) {
    // Step 1: Upsert (Update or Insert) the project details.
    const { data: savedProject, error: projectError } = await supabaseClient
        .from('projects')
        .upsert(projectDetails)
        .select()
        .single();

    if (projectError) {
        console.error("Error saving project:", projectError);
        return { error: projectError };
    }

    // Step 2: Delete all existing capability links for this project to ensure a clean slate.
    const { error: deleteError } = await supabaseClient.from('project_capabilities').delete().eq('project_id', savedProject.id);
    if (deleteError) {
        console.error("Error deleting old links:", deleteError);
        return { error: deleteError };
    }

    // Step 3: Insert the new links if any capabilities were selected.
    if (selectedCapIds && selectedCapIds.length > 0) {
        const linksToInsert = selectedCapIds.map(capId => ({
            project_id: savedProject.id,
            capability_id: capId
        }));
        const { error: insertError } = await supabaseClient.from('project_capabilities').insert(linksToInsert);
        if (insertError) {
            console.error("Error inserting new links:", insertError);
            return { error: insertError };
        }
    }
    
    return { data: savedProject };
}

/**
 * Deletes a project from the database by its ID.
 * @param {string} id - The UUID of the project to delete.
 * @returns {Promise} The result of the Supabase delete call.
 */
export async function deleteProject(id) {
    return await supabaseClient.from('projects').delete().eq('id', id);
}
