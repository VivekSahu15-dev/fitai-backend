// src/config/supabase.js
const { createClient } = require('@supabase/supabase-js');

// For auth calls on behalf of users
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// For admin/server-side DB writes (bypasses RLS) - never expose to the app
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = { supabase, supabaseAdmin };