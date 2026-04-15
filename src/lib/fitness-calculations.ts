export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type TrainingLevel = "beginner" | "intermediate" | "advanced";

export interface UserData {
  age: number;
  sex: Sex;
  weight: number; // kg
  height: number; // cm
  activity: ActivityLevel;
  waist?: number; // cm (optional for waist/height ratio)
  trainingLevel?: TrainingLevel;
  trainingHour?: number; // 0-23
}

export interface Macros {
  protein: number;
  fat: number;
  carbs: number;
}

export interface DayNutrition {
  label: string;
  calories: number;
  macros: Macros;
  description: string;
}

export interface SupplementProtocol {
  creatine: { loading: number; maintenance: number; unit: string };
  caffeine: { dose: number; timing: string; maxSafe: number };
  electrolytes: { sodium: number; potassium: number; magnesium: number };
}

export interface SleepCycles {
  optimalBedtime: string;
  wakeTime: string;
  cycles: number;
  totalHours: number;
}

export interface TrainingVolume {
  setsPerMuscle: { min: number; max: number };
  frequency: number;
  description: string;
}

export interface RadarProfile {
  strength: number;
  endurance: number;
  flexibility: number;
  recovery: number;
  nutrition: number;
  sleep: number;
}

export interface ProgressProjection {
  weeks: number;
  weightChange: number;
  fatChange: number;
  projectedWeight: number;
  projectedFat: number;
}

export interface MealTiming {
  meal: string;
  time: string;
  description: string;
  emphasis: string;
}

export interface DietDay {
  day: string;
  meals: { name: string; foods: string[]; calories: number }[];
  totalCalories: number;
}

export interface Results {
  // Basic
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
  macros: { bulk: Macros; cut: Macros; maintain: Macros };
  sleepHours: number;
  healthTip: string;

  // Advanced Biometrics
  leanMass: number;
  fatMass: number;
  rmrKatchMcArdle: number;
  bsa: number;
  waistHeightRatio: number | null;

  // Periodized Nutrition
  trainingDayNutrition: DayNutrition;
  restDayNutrition: DayNutrition;
  competitionDayNutrition: DayNutrition;
  macrosPerKg: { protein: number; fat: number; carbs: number };

  // Meal Timing
  mealTimings: MealTiming[];

  // Supplementation
  supplements: SupplementProtocol;

  // Performance
  trainingVolume: TrainingVolume;
  oneRepMaxMultiplier: number;
  sleepCycles: SleepCycles;

  // Radar
  radarProfile: RadarProfile;
  eliteRadar: RadarProfile;

  // Progress
  progressProjection: ProgressProjection[];

  // Weekly Diet
  weeklyDiet: DietDay[];
}

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

function macroCalc(cal: number, weight: number, goal: "bulk" | "cut" | "maintain"): Macros {
  const proteinG = goal === "cut" ? weight * 2.2 : weight * 1.8;
  const fatG = (cal * 0.25) / 9;
  const carbsG = (cal - proteinG * 4 - fatG * 9) / 4;
  return {
    protein: Math.round(proteinG),
    fat: Math.round(fatG),
    carbs: Math.round(Math.max(carbsG, 0)),
  };
}

function generateWeeklyDiet(tdee: number, sex: Sex): DietDay[] {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const isTraining = [true, false, true, false, true, true, false];

  const healthyFoods = {
    breakfast: [
      ["Avena con plátano y nueces", "Claras de huevo revueltas", "Zumo de naranja natural"],
      ["Tostadas integrales con aguacate", "Huevos pochados", "Fruta de temporada"],
      ["Yogur griego con granola y frutos rojos", "Tortilla de espinacas", "Té verde"],
      ["Porridge de avena con miel y almendras", "Batido de proteínas con leche de almendras", "Manzana"],
      ["Crepes de avena con plátano", "Queso cottage con fresas", "Café con leche desnatada"],
      ["Smoothie bowl de açaí y granola", "Tostada integral con pavo", "Zumo verde"],
      ["Pancakes de avena y proteína", "Fruta variada con yogur", "Infusión de jengibre"],
    ],
    lunch: [
      ["Pechuga de pollo a la plancha", "Arroz integral", "Ensalada mediterránea", "Aceite de oliva virgen"],
      ["Salmón al horno con limón", "Quinoa con verduras", "Brócoli al vapor"],
      ["Ternera magra guisada", "Boniato asado", "Espárragos trigueros a la plancha"],
      ["Pavo a la plancha con especias", "Pasta integral con tomate natural", "Ensalada de espinacas"],
      ["Merluza al horno", "Arroz basmati", "Pimientos asados", "Ensalada verde"],
      ["Pollo al curry con leche de coco", "Arroz integral", "Verduras salteadas"],
      ["Huevos al horno con verduras", "Pan integral", "Ensalada César ligera"],
    ],
    snack: [
      ["Frutos secos mixtos (30g)", "Manzana"],
      ["Batido de proteínas", "Plátano"],
      ["Hummus con palitos de zanahoria", "Naranja"],
      ["Yogur griego con miel", "Almendras"],
      ["Tostada integral con mantequilla de cacahuete", "Pera"],
      ["Queso fresco con nueces", "Kiwi"],
      ["Barrita de proteínas casera", "Uvas"],
    ],
    dinner: [
      ["Tortilla francesa de claras con champiñones", "Ensalada de tomate y aguacate"],
      ["Pescado blanco al vapor", "Verduras al wok", "Arroz integral"],
      ["Pechuga de pavo al horno", "Puré de calabacín", "Ensalada variada"],
      ["Revuelto de gambas con espárragos", "Pan integral", "Gazpacho"],
      ["Salmón a la plancha", "Boniato al horno", "Ensalada de canónigos"],
      ["Pollo a la plancha con hierbas", "Cuscús integral", "Verduras asadas"],
      ["Crema de calabaza y jengibre", "Huevo cocido", "Pan integral con semillas"],
    ],
  };

  return days.map((day, i) => {
    const training = isTraining[i];
    const dayMult = training ? 1.1 : 0.9;
    const dayCal = Math.round(tdee * dayMult);
    const breakfastCal = Math.round(dayCal * 0.25);
    const lunchCal = Math.round(dayCal * 0.35);
    const snackCal = Math.round(dayCal * 0.1);
    const dinnerCal = Math.round(dayCal * 0.3);

    return {
      day: `${day} ${training ? "🏋️" : "🧘"}`,
      meals: [
        { name: "Desayuno", foods: healthyFoods.breakfast[i], calories: breakfastCal },
        { name: "Almuerzo", foods: healthyFoods.lunch[i], calories: lunchCal },
        { name: "Snack", foods: healthyFoods.snack[i], calories: snackCal },
        { name: "Cena", foods: healthyFoods.dinner[i], calories: dinnerCal },
      ],
      totalCalories: dayCal,
    };
  });
}

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
  const safeBF = Math.max(bodyFat, 3);

  // Lean mass & fat mass
  const fatMass = (safeBF / 100) * d.weight;
  const leanMass = d.weight - fatMass;

  // Mifflin-St Jeor BMR
  const bmr =
    d.sex === "male"
      ? 10 * d.weight + 6.25 * d.height - 5 * d.age + 5
      : 10 * d.weight + 6.25 * d.height - 5 * d.age - 161;

  // Katch-McArdle RMR (uses lean mass)
  const rmrKatchMcArdle = 370 + 21.6 * leanMass;

  // Body Surface Area (Du Bois formula)
  const bsa = 0.007184 * Math.pow(d.height, 0.725) * Math.pow(d.weight, 0.425);

  // Waist/Height ratio
  const waistHeightRatio = d.waist ? d.waist / d.height : null;

  const tdee = bmr * ACTIVITY_MULTIPLIER[d.activity];
  const bulkCal = tdee + 500;
  const cutCal = tdee - 500;

  const waterLiters = Math.round((d.weight * 35) / 1000 * 10) / 10;

  const steps = { bulk: 8000, cut: 12000, maintain: 10000 };

  // Periodized nutrition
  const trainingDayNutrition: DayNutrition = {
    label: "Día de Entrenamiento",
    calories: Math.round(tdee * 1.1),
    macros: {
      protein: Math.round(d.weight * 2.0),
      carbs: Math.round(d.weight * 5),
      fat: Math.round(d.weight * 0.8),
    },
    description: "Carbohidratos altos para máximo rendimiento y recuperación.",
  };

  const restDayNutrition: DayNutrition = {
    label: "Día de Descanso",
    calories: Math.round(tdee * 0.85),
    macros: {
      protein: Math.round(d.weight * 2.0),
      carbs: Math.round(d.weight * 2.5),
      fat: Math.round(d.weight * 1.2),
    },
    description: "Menos carbohidratos, más grasas saludables para recuperación.",
  };

  const competitionDayNutrition: DayNutrition = {
    label: "Día de Competición",
    calories: Math.round(tdee * 1.3),
    macros: {
      protein: Math.round(d.weight * 1.8),
      carbs: Math.round(d.weight * 7),
      fat: Math.round(d.weight * 0.5),
    },
    description: "Protocolo de carga de glucógeno para máximo rendimiento.",
  };

  const macrosPerKg = {
    protein: 2.0,
    fat: 1.0,
    carbs: Math.round((tdee - d.weight * 2 * 4 - d.weight * 1 * 9) / 4 / d.weight * 10) / 10,
  };

  // Meal timing
  const trainHour = d.trainingHour ?? 17;
  const mealTimings: MealTiming[] = [
    { meal: "Pre-Entreno", time: `${(trainHour - 2).toString().padStart(2, "0")}:00`, description: "Comida rica en carbohidratos complejos", emphasis: "Carbohidratos + Proteína moderada" },
    { meal: "Intra-Entreno", time: `${trainHour.toString().padStart(2, "0")}:00`, description: "Hidratación con electrolitos", emphasis: "BCAAs + Agua + Sales" },
    { meal: "Post-Entreno", time: `${(trainHour + 1).toString().padStart(2, "0")}:30`, description: "Ventana anabólica — máxima absorción", emphasis: "Proteína rápida + Carbos simples" },
    { meal: "Cena", time: `${(trainHour + 3).toString().padStart(2, "0")}:00`, description: "Última comida completa del día", emphasis: "Proteína + Grasas + Verduras" },
  ];

  // Supplements
  const supplements: SupplementProtocol = {
    creatine: {
      loading: Math.round(leanMass * 0.3 * 10) / 10,
      maintenance: Math.round(leanMass * 0.07 * 10) / 10,
      unit: "g/día",
    },
    caffeine: {
      dose: Math.round(d.weight * 3),
      timing: `${Math.max(trainHour - 1, 6)}:00 — 30-60 min antes del entrenamiento`,
      maxSafe: Math.round(d.weight * 6),
    },
    electrolytes: {
      sodium: Math.round(500 + d.weight * 10),
      potassium: Math.round(200 + d.weight * 5),
      magnesium: Math.round(d.weight * 5),
    },
  };

  // Training volume
  const level = d.trainingLevel ?? "intermediate";
  const trainingVolume: TrainingVolume = level === "beginner"
    ? { setsPerMuscle: { min: 10, max: 14 }, frequency: 3, description: "Full-body 3x/semana con énfasis en técnica y progresión lineal." }
    : level === "intermediate"
    ? { setsPerMuscle: { min: 14, max: 20 }, frequency: 4, description: "Push/Pull/Legs o Upper/Lower 4x/semana con periodización ondulante." }
    : { setsPerMuscle: { min: 18, max: 26 }, frequency: 5, description: "División por grupo muscular 5-6x/semana con técnicas de intensidad." };

  // 1RM multiplier
  const oneRepMaxMultiplier = 1.0;

  // Sleep cycles
  const wakeHour = 7;
  const optimalCycles = d.age < 25 ? 6 : d.age < 65 ? 5 : 5;
  const sleepMinutes = optimalCycles * 90 + 15; // 15 min to fall asleep
  const bedHour = wakeHour * 60 - sleepMinutes;
  const bedH = Math.floor(((bedHour % 1440) + 1440) % 1440 / 60);
  const bedM = ((bedHour % 1440) + 1440) % 1440 % 60;

  const sleepCycles: SleepCycles = {
    optimalBedtime: `${bedH.toString().padStart(2, "0")}:${bedM.toString().padStart(2, "0")}`,
    wakeTime: `${wakeHour.toString().padStart(2, "0")}:00`,
    cycles: optimalCycles,
    totalHours: Math.round((optimalCycles * 1.5 + 0.25) * 10) / 10,
  };

  let sleepHours = 8;
  if (d.age < 18) sleepHours = 9;
  else if (d.age < 25) sleepHours = 8;
  else if (d.age < 65) sleepHours = 7.5;
  else sleepHours = 7;

  // Radar profile
  const activityScore = { sedentary: 20, light: 40, moderate: 60, active: 80, very_active: 95 };
  const radarProfile: RadarProfile = {
    strength: level === "beginner" ? 30 : level === "intermediate" ? 60 : 85,
    endurance: activityScore[d.activity],
    flexibility: Math.max(20, 80 - d.age),
    recovery: Math.max(30, 90 - d.age * 0.5),
    nutrition: 50,
    sleep: sleepHours >= 7.5 ? 80 : 50,
  };
  const eliteRadar: RadarProfile = { strength: 95, endurance: 90, flexibility: 85, recovery: 90, nutrition: 95, sleep: 95 };

  // Progress projection (12 weeks)
  const progressProjection: ProgressProjection[] = Array.from({ length: 12 }, (_, i) => {
    const week = i + 1;
    const weeklyWeightChange = 0.3;
    const weeklyFatChange = -0.15;
    return {
      weeks: week,
      weightChange: Math.round(week * weeklyWeightChange * 10) / 10,
      fatChange: Math.round(week * weeklyFatChange * 10) / 10,
      projectedWeight: Math.round((d.weight + week * weeklyWeightChange) * 10) / 10,
      projectedFat: Math.round((safeBF + week * weeklyFatChange) * 10) / 10,
    };
  });

  const tips = [
    d.age < 25
      ? "A tu edad, prioriza el descanso y la recuperación muscular."
      : d.age < 40
      ? "Mantén una rutina consistente y cuida tus articulaciones."
      : "Enfócate en ejercicios de bajo impacto y flexibilidad.",
  ];

  const weeklyDiet = generateWeeklyDiet(tdee, d.sex);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bodyFat: Math.round(safeBF * 10) / 10,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    bulkCal: Math.round(bulkCal),
    cutCal: Math.round(cutCal),
    maintainCal: Math.round(tdee),
    waterLiters,
    steps,
    macros: {
      bulk: macroCalc(bulkCal, d.weight, "bulk"),
      cut: macroCalc(cutCal, d.weight, "cut"),
      maintain: macroCalc(tdee, d.weight, "maintain"),
    },
    sleepHours,
    healthTip: tips[0],
    leanMass: Math.round(leanMass * 10) / 10,
    fatMass: Math.round(fatMass * 10) / 10,
    rmrKatchMcArdle: Math.round(rmrKatchMcArdle),
    bsa: Math.round(bsa * 100) / 100,
    waistHeightRatio,
    trainingDayNutrition,
    restDayNutrition,
    competitionDayNutrition,
    macrosPerKg,
    mealTimings,
    supplements,
    trainingVolume,
    oneRepMaxMultiplier,
    sleepCycles,
    radarProfile,
    eliteRadar,
    progressProjection,
    weeklyDiet,
  };
}
