import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jrqtzwxhzwmzusurvikl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpycXR6d3hoendtenVzdXJ2aWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDYwNTIsImV4cCI6MjA3NTAyMjA1Mn0.t4uBMwwhOrsn9rytZISg88FqJIrfCrnvRGipXfEbIZg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});
