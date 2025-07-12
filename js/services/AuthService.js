// Authentication service
import { getSupabaseClient } from "../config/supabase.js";

export class AuthService {
  constructor() {
    this.supabase = getSupabaseClient();
    this.currentUser = null;
    this.authListeners = [];
    this.initializeAuth();
  }

  // Initialize authentication state
  async initializeAuth() {
    try {
      if (this.supabase) {
        // Get current session
        const { data: { session }, error } = await this.supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        } else if (session) {
          this.currentUser = session.user;
          this.notifyAuthListeners(session.user);
        }

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event);
          
          if (event === 'SIGNED_IN' && session) {
            this.currentUser = session.user;
            this.notifyAuthListeners(session.user);
          } else if (event === 'SIGNED_OUT') {
            this.currentUser = null;
            this.notifyAuthListeners(null);
          }
        });
      } else {
        // Fallback: check localStorage for simulated auth
        const savedUser = localStorage.getItem('pos_current_user');
        if (savedUser) {
          this.currentUser = JSON.parse(savedUser);
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      if (this.supabase) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        this.currentUser = data.user;
        console.log("User signed in successfully:", data.user.email);
        return { success: true, user: data.user, session: data.session };
      } else {
        // Fallback: simulate successful login
        if (email && password) {
          const user = { 
            email, 
            id: "simulated-user-" + Date.now(),
            created_at: new Date().toISOString(),
            role: 'cashier'
          };
          
          this.currentUser = user;
          localStorage.setItem('pos_current_user', JSON.stringify(user));
          this.notifyAuthListeners(user);
          
          console.log("Simulated sign in successful:", email);
          return { success: true, user };
        }
        return { success: false, error: "Invalid credentials" };
      }
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, error: error.message || error };
    }
  }

  // Sign up new user
  async signUp(email, password, userData = {}) {
    try {
      if (this.supabase) {
        const { data, error } = await this.supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData
          }
        });

        if (error) throw error;
        
        console.log("User signed up successfully:", data.user?.email);
        return { success: true, user: data.user, session: data.session };
      } else {
        // Fallback: simulate successful signup
        const user = {
          email,
          id: "simulated-user-" + Date.now(),
          created_at: new Date().toISOString(),
          ...userData
        };
        
        console.log("Simulated sign up successful:", email);
        return { success: true, user };
      }
    } catch (error) {
      console.error("Error signing up:", error);
      return { success: false, error: error.message || error };
    }
  }

  // Sign out
  async signOut() {
    try {
      if (this.supabase) {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
      } else {
        // Fallback: clear localStorage
        localStorage.removeItem('pos_current_user');
        this.notifyAuthListeners(null);
      }

      this.currentUser = null;
      console.log("User signed out successfully");
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message || error };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      if (this.supabase) {
        const { error } = await this.supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        
        console.log("Password reset email sent to:", email);
        return { success: true };
      } else {
        // Fallback: simulate password reset
        console.log("Simulated password reset for:", email);
        return { success: true };
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      return { success: false, error: error.message || error };
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      if (this.supabase && this.currentUser) {
        const { data, error } = await this.supabase.auth.updateUser({
          data: updates
        });

        if (error) throw error;
        
        this.currentUser = data.user;
        console.log("Profile updated successfully");
        return { success: true, user: data.user };
      } else if (this.currentUser) {
        // Fallback: update localStorage
        this.currentUser = { ...this.currentUser, ...updates };
        localStorage.setItem('pos_current_user', JSON.stringify(this.currentUser));
        this.notifyAuthListeners(this.currentUser);
        
        console.log("Simulated profile update successful");
        return { success: true, user: this.currentUser };
      } else {
        return { success: false, error: "No user logged in" };
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message || error };
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

  // Get user role
  getUserRole() {
    return this.currentUser?.role || this.currentUser?.user_metadata?.role || 'cashier';
  }

  // Check if user has permission
  hasPermission(permission) {
    const role = this.getUserRole();
    
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'view_analytics'],
      manager: ['read', 'write', 'view_analytics'],
      cashier: ['read', 'write']
    };
    
    return permissions[role]?.includes(permission) || false;
  }

  // Add auth state listener
  addAuthListener(callback) {
    this.authListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  // Notify auth listeners
  notifyAuthListeners(user) {
    this.authListeners.forEach(callback => {
      try {
        callback(user);
      } catch (error) {
        console.error("Error in auth listener:", error);
      }
    });
  }

  // Get session info
  async getSession() {
    try {
      if (this.supabase) {
        const { data: { session }, error } = await this.supabase.auth.getSession();
        if (error) throw error;
        return session;
      } else {
        // Fallback: return simulated session
        return this.currentUser ? {
          user: this.currentUser,
          access_token: 'simulated-token',
          expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        } : null;
      }
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  }
}
