import { HealthMetrics, BodyComposition, ActivityLevel, Gender, HealthGoals } from '@/types/health';

export function calculateBMI(weight: number, height: number): number {
  return Number((weight / Math.pow(height / 100, 2)).toFixed(1));
}

export function calculateBMR(metrics: {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
}): number {
  const { weight, height, age, gender } = metrics;
  
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;
  
  return Math.round(bmr);
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

export function calculateMacroSplit(
  tdee: number,
  goals: HealthGoals,
  bodyComposition: BodyComposition
): { protein: number; carbs: number; fats: number } {
  let proteinRatio = 0.3; // 30% baseline
  let carbsRatio = 0.4;   // 40% baseline
  let fatsRatio = 0.3;    // 30% baseline

  // Adjust based on goals
  if (goals.includes('buildMuscle')) {
    proteinRatio = 0.35;
    carbsRatio = 0.45;
    fatsRatio = 0.2;
  } else if (goals.includes('loseWeight')) {
    proteinRatio = 0.4;
    carbsRatio = 0.3;
    fatsRatio = 0.3;
  }

  // Adjust for body composition
  if (bodyComposition === 'overweight') {
    proteinRatio += 0.05;
    carbsRatio -= 0.05;
  } else if (bodyComposition === 'athletic') {
    carbsRatio += 0.05;
    fatsRatio -= 0.05;
  }

  return {
    protein: Math.round((tdee * proteinRatio) / 4), // 4 calories per gram of protein
    carbs: Math.round((tdee * carbsRatio) / 4),     // 4 calories per gram of carbs
    fats: Math.round((tdee * fatsRatio) / 9)        // 9 calories per gram of fat
  };
}

export function calculateIdealBodyFat(gender: Gender, age: number): { min: number; max: number } {
  const ranges: Record<Gender, Record<string, { min: number; max: number }>> = {
    male: {
      '20-29': { min: 11, max: 20 },
      '30-39': { min: 12, max: 21 },
      '40-49': { min: 14, max: 23 },
      '50+': { min: 15, max: 24 }
    },
    female: {
      '20-29': { min: 16, max: 24 },
      '30-39': { min: 17, max: 25 },
      '40-49': { min: 19, max: 27 },
      '50+': { min: 20, max: 28 }
    }
  };

  let ageRange = '20-29';
  if (age >= 30 && age < 40) ageRange = '30-39';
  else if (age >= 40 && age < 50) ageRange = '40-49';
  else if (age >= 50) ageRange = '50+';

  return ranges[gender][ageRange];
}

export function calculateHealthyWeightRange(height: number): { min: number; max: number } {
  const minBMI = 18.5;
  const maxBMI = 24.9;
  const heightInMeters = height / 100;

  return {
    min: Math.round(minBMI * Math.pow(heightInMeters, 2)),
    max: Math.round(maxBMI * Math.pow(heightInMeters, 2))
  };
}

export function analyzeMetrics(metrics: HealthMetrics): {
  warnings: Array<{ message: string; severity: 'warning' | 'alert' }>;
  recommendations: string[];
} {
  const warnings: Array<{ message: string; severity: 'warning' | 'alert' }> = [];
  const recommendations: string[] = [];

  const bmi = calculateBMI(metrics.weight, metrics.height);
  const healthyWeight = calculateHealthyWeightRange(metrics.height);
  const idealBodyFat = calculateIdealBodyFat(metrics.gender, metrics.age);

  // BMI Analysis
  if (bmi < 18.5) {
    warnings.push({
      message: "Your BMI indicates you're underweight. Please consult a healthcare provider.",
      severity: 'alert'
    });
  } else if (bmi > 30) {
    warnings.push({
      message: "Your BMI indicates obesity. We recommend consulting a healthcare provider.",
      severity: 'alert'
    });
  }

  // Body Fat Analysis
  if (metrics.bodyFat && metrics.bodyFat < idealBodyFat.min) {
    warnings.push({
      message: "Your body fat percentage is below the healthy range.",
      severity: 'warning'
    });
  }

  // Weight Analysis
  if (metrics.weight < healthyWeight.min) {
    recommendations.push("Consider a supervised weight gain program to reach a healthy weight.");
  } else if (metrics.weight > healthyWeight.max) {
    recommendations.push("Focus on gradual, sustainable weight loss through diet and exercise.");
  }

  return { warnings, recommendations };
} 