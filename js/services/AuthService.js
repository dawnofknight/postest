// Authentication service
import { initSupabase } from "../config/supabase.js";

export class AuthService {
  constructor() {
    this.supabase = initSupabase();
    this.currentUser = null;
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      // When Supabase is implemented:
      // const { data, error } = await this.supabase.auth.signInWithPassword({
      //   email,
      //   password
      // });
      //
      // if (error) throw error;
      // this.currentUser = data.user;
      // return { success: true, user: data.user };

      // For now, simulate successful login
      if (email && password) {
        this.currentUser = { email, id: "simulated-user-id" };
        return { success: true, user: this.currentUser };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, error };
    }
  }

  // Sign out
  async signOut() {
    try {
      // When Supabase is implemented:
      // const { error } = await this.supabase.auth.signOut();
      // if (error) throw error;

      this.currentUser = null;
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }
}
