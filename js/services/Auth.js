// js/services/auth.js

const SUPABASE_URL = 'https://esahjsbduuwopoqktynq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYWhqc2JkdXV3b3BvcWt0eW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzY5ODYsImV4cCI6MjA3MTMxMjk4Nn0.uAw8vS8YfPNlkbwV8cd1jY2MhKeQQvbIetdD0XxUGQg';

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
