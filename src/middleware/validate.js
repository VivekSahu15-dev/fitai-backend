// src/middleware/validate.js
const { z } = require('zod');

const signupSchema = z.object({
  fullName: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8),
  acceptedTerms: z.literal(true),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }
  req.body = result.data;
  next();
};

const forgotPasswordSchema = z.object({ email: z.string().email() });

const resetPasswordSchema = z.object({
  email: z.string().email(),
code: z.string().regex(/^\d{6,10}$/, 'Enter the verification code from your email'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});


const fitnessSchema = z.object({
  age: z.number().int().min(13).max(100),
  gender: z.enum(['male', 'female', 'other']),
  heightCm: z.number().min(100).max(250),
  weightKg: z.number().min(30).max(300),
  goal: z.enum(['build_muscle', 'lose_fat', 'maintain', 'get_fitter']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very_active']),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  daysPerWeek: z.number().int().min(2).max(7),
  dietPreference: z.enum(['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan', 'no_preference']),
});

module.exports = {
  validate, signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, fitnessSchema,
};


