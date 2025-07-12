// Supabase configuration
export const SUPABASE_URL = process.env.SUPABASE_URL || "YOUR_SUPABASE_URL";
export const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

// Import Supabase client
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

// Initialize Supabase client
export const initSupabase = () => {
  try {
    if (SUPABASE_URL === "YOUR_SUPABASE_URL" || SUPABASE_KEY === "YOUR_SUPABASE_ANON_KEY") {
      console.warn("Supabase credentials not configured. Using mock mode.");
      return null;
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase client initialized successfully");
    return supabase;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
};

// Singleton instance
let supabaseInstance = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = initSupabase();
  }
  return supabaseInstance;
};
