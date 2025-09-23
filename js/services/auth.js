// js/services/auth.js
const SUPABASE_URL = 'https://mznapeconwimqtqwrwne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bmFwZWNvbndpbXF0cXdyd25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjcxNTUsImV4cCI6MjA3MzY0MzE1NX0.rWvrmuuqirJkCL3EKyQHU_EFlxJUWdSWPJBHd0cWuE4';

const { createClient } = supabase;

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUp(email, password, fullName) {
    return await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            }
        }
    });
}

export async function signIn(email, password) {
    return await supabaseClient.auth.signInWithPassword({ email, password });
}

export async function signOut() {
    return await supabaseClient.auth.signOut();
}

export function onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });
}

export async function getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}
