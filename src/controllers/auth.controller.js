// src/controllers/auth.controller.js
const { supabase, supabaseAdmin } = require("../config/supabase");

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return res.status(400).json({ error: error.message });

  // Create the profile row
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({ id: data.user.id, full_name: fullName, email });
  if (profileError)
    return res.status(500).json({ error: "Could not create profile" });

  res.status(201).json({
    user: { id: data.user.id, email, fullName },
    session: data.session, // null if email confirmation is required
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error)
    return res.status(401).json({ error: "Invalid email or password" });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  res.json({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
    profile,
  });
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });
  if (error) return res.status(401).json({ error: "Session expired" });
  res.json({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  // No redirectTo needed anymore, the email contains a code
  await supabase.auth.resetPasswordForEmail(email);
  // Same response either way, so attackers can't discover which emails exist
  res.json({ message: "If that email exists, a reset code has been sent." });
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "recovery",
  });
  if (error || !data.user) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    data.user.id,
    { password: newPassword },
  );
  if (updateError) return res.status(400).json({ error: updateError.message });

  // Sign out every existing session so old tokens stop working
  try {
    await supabaseAdmin.auth.admin.signOut(data.session.access_token);
  } catch {}

  res.json({ message: "Password updated. Please log in." });
};

exports.logout = async (req, res) => {
  await supabaseAdmin.auth.admin.signOut(req.token);
  res.json({ message: "Logged out" });
};

exports.me = async (req, res) => {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", req.user.id)
    .single();
  res.json(data);
};
