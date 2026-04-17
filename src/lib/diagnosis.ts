import type { Results, UserData } from "./fitness-calculations";

export type FitnessLevel = "Novato" | "Intermedio" | "Avanzado" | "Elite";
export type Metabolism = "Lento" | "Medio" | "Rápido";

export interface SupplementRecommendation {
  name: string;
  reason: string;
  url: string;
  priority: "alta" | "media" | "baja";
}

export interface Diagnosis {
  potentialPercent: number;
  metabolism: Metabolism;
  insights: string[];
  level: FitnessLevel;
  scores: {
    strength: number;
    bodyFat: number;
    muscleMass: number;
    overall: number;
  };
  supplements: SupplementRecommendation[];
  shareText: string;
}

const ZUMUB_URL = "https://www.zumu.be/ALEXKEN";

export function generateDiagnosis(data: UserData, r: Results): Diagnosis {
  // Metabolism — based on BMR/weight ratio
  const bmrPerKg = r.bmr / data.weight;
  const metabolism: Metabolism =
    bmrPerKg < 20 ? "Lento" : bmrPerKg < 24 ? "Medio" : "Rápido";

  // Body fat ideal ranges
  const idealBF = data.sex === "male" ? 12 : 20;
  const bfDelta = r.bodyFat - idealBF;

  // Muscle mass score
  const leanRatio = (r.leanMass / data.weight) * 100;
  const idealLean = data.sex === "male" ? 85 : 75;
  const muscleScore = Math.min(100, Math.round((leanRatio / idealLean) * 100));

  // Body fat score (lower is better, capped)
  const bfScore = Math.max(0, Math.min(100, Math.round(100 - bfDelta * 3)));

  // Strength score from training level + activity
  const levelMap = { beginner: 35, intermediate: 65, advanced: 90 };
  const strengthScore = levelMap[data.trainingLevel ?? "intermediate"];

  // Overall potential
  const overall = Math.round((muscleScore + bfScore + strengthScore) / 3);

  // Level
  const level: FitnessLevel =
    overall < 40 ? "Novato" : overall < 65 ? "Intermedio" : overall < 85 ? "Avanzado" : "Elite";

  // Insights
  const insights: string[] = [];
  insights.push(`Estás en un ${overall}% de tu físico potencial.`);
  insights.push(`Tu metabolismo es: ${metabolism.toLowerCase()}.`);

  const proteinTarget = data.weight * 1.8;
  const proteinCurrent = r.macros.maintain.protein;
  if (proteinCurrent < proteinTarget * 0.95) {
    insights.push("Tienes déficit de proteína para tu nivel de actividad.");
  }
  if (bfDelta > 5) insights.push("Exceso de grasa corporal — prioriza definición.");
  else if (bfDelta < -3) insights.push("Grasa corporal muy baja — cuida tu salud hormonal.");
  else insights.push("Tu composición corporal está en rango óptimo.");

  if (r.bmi < 18.5) insights.push("Bajo peso — necesitas superávit calórico.");
  else if (r.bmi > 27) insights.push("Sobrepeso — recomendamos déficit progresivo.");

  // Supplement recommendations
  const supplements: SupplementRecommendation[] = [];

  if (proteinCurrent < proteinTarget) {
    supplements.push({
      name: "Proteína Whey Isolate",
      reason: `Necesitas ~${Math.round(proteinTarget)}g/día y tu dieta puede quedarse corta.`,
      url: ZUMUB_URL,
      priority: "alta",
    });
  }

  if (data.trainingLevel !== "beginner" || (data.trainingLevel === "beginner" && bfDelta < 5)) {
    supplements.push({
      name: "Creatina Monohidrato",
      reason: `Aumenta fuerza y volumen muscular. Dosis: ${r.supplements.creatine.maintenance}g/día.`,
      url: ZUMUB_URL,
      priority: "alta",
    });
  }

  if (r.bmi < 20 || (data.activity === "very_active" && bfDelta < 0)) {
    supplements.push({
      name: "Mass Gainer / Calorías Extra",
      reason: "Necesitas un superávit calórico para ganar peso saludable.",
      url: ZUMUB_URL,
      priority: "alta",
    });
  }

  supplements.push({
    name: "Multivitamínico + Omega 3",
    reason: "Soporte general para recuperación, salud articular y rendimiento.",
    url: ZUMUB_URL,
    priority: "media",
  });

  if (data.activity === "active" || data.activity === "very_active") {
    supplements.push({
      name: "Electrolitos + BCAAs",
      reason: "Reposición de sodio, potasio y magnesio durante entrenos intensos.",
      url: ZUMUB_URL,
      priority: "media",
    });
  }

  const shareText = `Soy nivel ${level} 💪 ${overall}% de físico potencial. Metabolismo ${metabolism.toLowerCase()}. ¿Y tú? Calcula el tuyo en alexfitnessysuplementos.es`;

  return {
    potentialPercent: overall,
    metabolism,
    insights,
    level,
    scores: {
      strength: strengthScore,
      bodyFat: bfScore,
      muscleMass: muscleScore,
      overall,
    },
    supplements,
    shareText,
  };
}
