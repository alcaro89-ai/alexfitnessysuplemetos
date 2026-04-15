export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export interface UserData {
  age: number;
  sex: Sex;
  weight: number; // kg
  height: number; // cm
  activity: ActivityLevel;
}

export interface Results {
  bmi: number;
  bmiCategory: string;
  bodyFat: number;
  bmr: number;
  tdee: number;
  bulkCal: number;
  cutCal: number;
  maintainCal: number;
  waterLiters: number;
  steps: { bulk: number; cut: number; maintain: number };
  macros: {
    bulk: Macros;
    cut: Macros;
    maintain: Macros;
  };
  sleepHours: number;
  healthTip: string;
}

interface Macros {
  protein: number;
  fat: number;
  carbs: number;
}

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculate(d: UserData): Results {
  const heightM = d.height / 100;
  const bmi = d.weight / (heightM * heightM);

  let bmiCategory = "Normal";
  if (bmi < 18.5) bmiCategory = "Bajo peso";
  else if (bmi < 25) bmiCategory = "Normal";
  else if (bmi < 30) bmiCategory = "Sobrepeso";
  else bmiCategory = "Obesidad";

  // Body fat — US Navy-style approximation from BMI
  const bodyFat =
    d.sex === "male"
      ? 1.2 * bmi + 0.23 * d.age - 16.2
      : 1.2 * bmi + 0.23 * d.age - 5.4;

  // Mifflin-St Jeor
  const bmr =
    d.sex === "male"
      ? 10 * d.weight + 6.25 * d.height - 5 * d.age + 5
      : 10 * d.weight + 6.25 * d.height - 5 * d.age - 161;

  const tdee = bmr * ACTIVITY_MULTIPLIER[d.activity];
  const bulkCal = tdee + 500;
  const cutCal = tdee - 500;

  const waterLiters = Math.round((d.weight * 35) / 1000 * 10) / 10;

  const steps = {
    bulk: 8000,
    cut: 12000,
    maintain: 10000,
  };

  const macroCalc = (cal: number, goal: "bulk" | "cut" | "maintain"): Macros => {
    const proteinG = goal === "cut" ? d.weight * 2.2 : d.weight * 1.8;
    const fatG = (cal * 0.25) / 9;
    const carbsG = (cal - proteinG * 4 - fatG * 9) / 4;
    return {
      protein: Math.round(proteinG),
      fat: Math.round(fatG),
      carbs: Math.round(Math.max(carbsG, 0)),
    };
  };

  let sleepHours = 8;
  if (d.age < 18) sleepHours = 9;
  else if (d.age < 25) sleepHours = 8;
  else if (d.age < 65) sleepHours = 7.5;
  else sleepHours = 7;

  const tips = [
    d.age < 25
      ? "A tu edad, prioriza el descanso y la recuperación muscular."
      : d.age < 40
      ? "Mantén una rutina consistente y cuida tus articulaciones."
      : "Enfócate en ejercicios de bajo impacto y flexibilidad.",
  ];

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bodyFat: Math.round(Math.max(bodyFat, 3) * 10) / 10,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    bulkCal: Math.round(bulkCal),
    cutCal: Math.round(cutCal),
    maintainCal: Math.round(tdee),
    waterLiters,
    steps,
    macros: {
      bulk: macroCalc(bulkCal, "bulk"),
      cut: macroCalc(cutCal, "cut"),
      maintain: macroCalc(tdee, "maintain"),
    },
    sleepHours,
    healthTip: tips[0],
  };
}
