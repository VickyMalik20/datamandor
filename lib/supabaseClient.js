import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vynwtpndhzjagubguhth.supabase.co'; // Ganti dengan Project URL Anda
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bnd0cG5kaHpqYWd1Ymd1aHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MTgwMTUsImV4cCI6MjA1MDA5NDAxNX0.O3di97ZKcdgpr-guF1RtsQBsb93iAD1nnqVj9-gD1Yo'; // Ganti dengan Anon Key Anda

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
