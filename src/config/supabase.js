const { createClient } = require('@supabase/supabase-js');

const options = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, options);
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  options
);

module.exports = { supabase, supabaseAdmin };