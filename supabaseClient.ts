import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://slxvagtskupvkosaamaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNseHZhZ3Rza3Vwdmtvc2FhbWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODA4NTYsImV4cCI6MjA3MDE1Njg1Nn0.A720F6_WQJ4QREiux2L99jWLC_ZpYGfQLYREU7w0a4k';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
