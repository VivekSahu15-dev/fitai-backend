const { supabaseAdmin } = require('../config/supabase');
const { calculateTargets } = require('../services/fitness.service');

const toApi = (row) => ({
  age: new Date().getFullYear() - row.birth_year,
  gender: row.gender,
  heightCm: Number(row.height_cm),
  weightKg: Number(row.weight_kg),
  goal: row.goal,
  activityLevel: row.activity_level,
  experience: row.experience,
  daysPerWeek: row.days_per_week,
  dietPreference: row.diet_preference,
});

exports.getFitness = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('fitness_profiles')
    .select('*')
    .eq('user_id', req.user.id)
    .maybeSingle();
  if (error) throw error;

  if (!data) return res.json({ profile: null, targets: null });
  const profile = toApi(data);
  res.json({ profile, targets: calculateTargets(profile) });
};

exports.saveFitness = async (req, res) => {
  const b = req.body;
  const row = {
    user_id: req.user.id,
    birth_year: new Date().getFullYear() - b.age,
    gender: b.gender,
    height_cm: b.heightCm,
    weight_kg: b.weightKg,
    goal: b.goal,
    activity_level: b.activityLevel,
    experience: b.experience,
    days_per_week: b.daysPerWeek,
    diet_preference: b.dietPreference,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('fitness_profiles')
    .upsert(row, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw error;

  const profile = toApi(data);
  res.json({ profile, targets: calculateTargets(profile) });
};