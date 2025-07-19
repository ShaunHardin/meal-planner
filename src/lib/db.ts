import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      plans: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          meals: unknown[]; // JSON column
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start: string;
          meals: unknown[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start?: string;
          meals?: unknown[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key-here';

// Create Supabase client
export const supabase: SupabaseClient<Database> = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return (
    supabaseUrl !== 'https://placeholder-project-url.supabase.co' &&
    supabaseAnonKey !== 'placeholder-anon-key-here' &&
    supabaseUrl.includes('.supabase.co')
  );
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Export the client for direct use if needed
export default supabase;