const ACTIVITY_FACTOR = { sedentary: 1.2, light: 1.375, moderate: 1.55, very_active: 1.725 };

// Calorie change relative to maintenance (TDEE)
const GOAL_ADJUSTMENT = { build_muscle: 0.1, lose_fat: -0.2, maintain: 0, get_fitter: 0 };

// Protein in grams per kg of body weight
const PROTEIN_PER_KG = { build_muscle: 2.0, lose_fat: 2.0, maintain: 1.6, get_fitter: 1.4 };

const CALORIE_FLOOR = { male: 1500, female: 1200, other: 1350 };

const roundTo = (value, step) => Math.round(value / step) * step;

function bmiCategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

// Mifflin-St Jeor equation
function calculateBmr({ gender, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return base + 5;
  if (gender === 'female') return base - 161;
  return base - 78; // midpoint for "other"
}

function calculateTargets(profile) {
  const { weightKg, heightCm, age, gender, goal, activityLevel } = profile;
  const notes = [];

  const bmi = Math.round((weightKg / (heightCm / 100) ** 2) * 10) / 10;
  const bmr = calculateBmr(profile);
  const tdee = bmr * ACTIVITY_FACTOR[activityLevel];

  let adjustment = GOAL_ADJUSTMENT[goal];
  if (age < 18 && adjustment < 0) {
    adjustment = 0;
    notes.push('Calorie deficits are not recommended under 18, so your target is set to maintenance.');
  }

  let calorieTarget = roundTo(tdee * (1 + adjustment), 10);
  const floor = CALORIE_FLOOR[gender];
  if (calorieTarget < floor) {
    calorieTarget = floor;
    notes.push('Your target was raised to a safe minimum.');
  }

  const proteinG = Math.round(PROTEIN_PER_KG[goal] * weightKg);
  const fatG = Math.round((calorieTarget * 0.25) / 9);
  const carbsG = Math.max(0, Math.round((calorieTarget - proteinG * 4 - fatG * 9) / 4));

  const waterBonus = ['moderate', 'very_active'].includes(activityLevel) ? 500 : 0;
  const waterMl = roundTo(weightKg * 35 + waterBonus, 50);

  return {
    bmi,
    bmiCategory: bmiCategory(bmi),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget,
    proteinG,
    carbsG,
    fatG,
    waterMl,
    notes,
  };
}

module.exports = { calculateTargets };