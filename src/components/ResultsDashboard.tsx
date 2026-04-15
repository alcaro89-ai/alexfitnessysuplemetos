import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { Results } from "@/lib/fitness-calculations";

interface Props {
  results: Results;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

function NeonCard({ title, children, glow = "cyan", className = "" }: { title: string; children: React.ReactNode; glow?: "cyan" | "purple" | "lime"; className?: string }) {
  const glowClass = glow === "purple" ? "neon-border-purple" : glow === "lime" ? "glow-lime border border-neon-lime/40" : "neon-border-cyan";
  return (
    <motion.div variants={item} className={`glass rounded-2xl p-5 ${glowClass} ${className}`}>
      <h3 className={`font-display text-xs tracking-[0.25em] uppercase mb-3 ${
        glow === "purple" ? "text-secondary text-glow-purple" : glow === "lime" ? "text-accent text-glow-lime" : "text-primary text-glow-cyan"
      }`}>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

function BmiBar({ bmi }: { bmi: number }) {
  const pct = Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100);
  return (
    <div className="relative h-3 rounded-full overflow-hidden bg-muted mt-2">
      <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg, hsl(180 100% 50%), hsl(80 100% 55%), hsl(40 100% 50%), hsl(0 80% 55%))" }} />
      <motion.div initial={{ left: "0%" }} animate={{ left: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-primary glow-cyan" />
    </div>
  );
}

function MacroChart({ macros }: { macros: { protein: number; fat: number; carbs: number } }) {
  const data = [
    { name: "Proteína", value: macros.protein * 4, color: "hsl(180, 100%, 50%)" },
    { name: "Grasa", value: macros.fat * 9, color: "hsl(270, 100%, 65%)" },
    { name: "Carbos", value: macros.carbs * 4, color: "hsl(80, 100%, 55%)" },
  ];
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={100} height={100}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={28} outerRadius={45} strokeWidth={0}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1 text-sm font-body">
        <p><span className="text-primary font-semibold">{macros.protein}g</span> Proteína</p>
        <p><span className="text-secondary font-semibold">{macros.fat}g</span> Grasa</p>
        <p><span className="text-accent font-semibold">{macros.carbs}g</span> Carbos</p>
      </div>
    </div>
  );
}

function BigStat({ value, unit, sub }: { value: string | number; unit?: string; sub?: string }) {
  return (
    <div>
      <span className="text-3xl font-display font-bold text-foreground">
        {value}
        {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
      </span>
      {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <motion.h2 variants={item} id={id} className="col-span-full text-2xl font-display font-bold text-center text-secondary text-glow-purple tracking-[0.2em] mt-8 mb-2">
      {children}
    </motion.h2>
  );
}

export default function ResultsDashboard({ results }: Props) {
  const r = results;
  const [activeDay, setActiveDay] = useState(0);

  const radarData = Object.keys(r.radarProfile).map((key) => ({
    subject: key === "strength" ? "Fuerza" : key === "endurance" ? "Resistencia" : key === "flexibility" ? "Flexibilidad" : key === "recovery" ? "Recuperación" : key === "nutrition" ? "Nutrición" : "Sueño",
    user: r.radarProfile[key as keyof typeof r.radarProfile],
    elite: r.eliteRadar[key as keyof typeof r.eliteRadar],
  }));

  const progressData = r.progressProjection.map((p) => ({
    semana: `S${p.weeks}`,
    peso: p.projectedWeight,
    grasa: p.projectedFat,
  }));

  const muscleGroups = [
    { name: "Pecho", sets: r.trainingVolume.setsPerMuscle.max, intensity: 85 },
    { name: "Espalda", sets: r.trainingVolume.setsPerMuscle.max, intensity: 90 },
    { name: "Piernas", sets: Math.round(r.trainingVolume.setsPerMuscle.max * 1.2), intensity: 95 },
    { name: "Hombros", sets: Math.round(r.trainingVolume.setsPerMuscle.max * 0.8), intensity: 75 },
    { name: "Bíceps", sets: Math.round(r.trainingVolume.setsPerMuscle.min * 0.8), intensity: 60 },
    { name: "Tríceps", sets: Math.round(r.trainingVolume.setsPerMuscle.min * 0.8), intensity: 60 },
    { name: "Core", sets: Math.round(r.trainingVolume.setsPerMuscle.min * 0.6), intensity: 50 },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">

      {/* ═══════ SECTION 1: BIOMETRÍA ═══════ */}
      <SectionTitle>🔬 BIOMETRÍA AVANZADA</SectionTitle>

      <NeonCard title="IMC" glow="cyan">
        <BigStat value={r.bmi} sub={r.bmiCategory} />
        <BmiBar bmi={r.bmi} />
      </NeonCard>

      <NeonCard title="Composición Corporal" glow="purple">
        <div className="space-y-2">
          <div className="flex justify-between font-body text-sm">
            <span>Masa Magra</span>
            <span className="font-display font-bold text-primary">{r.leanMass} kg</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span>Masa Grasa</span>
            <span className="font-display font-bold text-secondary">{r.fatMass} kg</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span>% Grasa</span>
            <span className="font-display font-bold text-accent">{r.bodyFat}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${Math.min(r.bodyFat, 50)}%` }} />
          </div>
        </div>
      </NeonCard>

      <NeonCard title="Metabolismo" glow="lime">
        <div className="space-y-2">
          <div className="flex justify-between font-body text-sm">
            <span>TMB (Mifflin)</span>
            <span className="font-display font-bold">{r.bmr} kcal</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span>RMR (Katch-McArdle)</span>
            <span className="font-display font-bold text-accent">{r.rmrKatchMcArdle} kcal</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span>TDEE</span>
            <span className="font-display font-bold text-primary">{r.tdee} kcal</span>
          </div>
        </div>
      </NeonCard>

      <NeonCard title="Superficie Corporal (BSA)" glow="cyan">
        <BigStat value={r.bsa} unit="m²" sub="Fórmula Du Bois — Termorregulación" />
      </NeonCard>

      {r.waistHeightRatio !== null && (
        <NeonCard title="Ratio Cintura/Altura" glow="purple">
          <BigStat value={r.waistHeightRatio.toFixed(2)} sub={r.waistHeightRatio < 0.5 ? "✅ Riesgo bajo" : r.waistHeightRatio < 0.6 ? "⚠️ Riesgo moderado" : "🔴 Riesgo alto"} />
        </NeonCard>
      )}

      <NeonCard title="Hidratación" glow="lime">
        <BigStat value={r.waterLiters} unit="L / día" sub="💧 35ml por kg de peso" />
      </NeonCard>

      {/* ═══════ SECTION 2: OBJETIVOS CALÓRICOS ═══════ */}
      <SectionTitle>🎯 OBJETIVOS CALÓRICOS</SectionTitle>

      <NeonCard title="Calorías por Objetivo" glow="purple">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span className="text-accent">🔥 Volumen</span><span className="font-display font-bold">{r.bulkCal} kcal</span></div>
          <div className="flex justify-between"><span className="text-primary">⚖️ Mantener</span><span className="font-display font-bold">{r.maintainCal} kcal</span></div>
          <div className="flex justify-between"><span className="text-neon-pink">✂️ Definición</span><span className="font-display font-bold">{r.cutCal} kcal</span></div>
        </div>
      </NeonCard>

      <NeonCard title="Macros — Volumen" glow="cyan">
        <MacroChart macros={r.macros.bulk} />
      </NeonCard>

      <NeonCard title="Macros — Definición" glow="purple">
        <MacroChart macros={r.macros.cut} />
      </NeonCard>

      <NeonCard title="Pasos Diarios" glow="lime">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span className="text-accent">Volumen</span><span className="font-display font-bold">{r.steps.bulk.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-primary">Mantener</span><span className="font-display font-bold">{r.steps.maintain.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-neon-pink">Definición</span><span className="font-display font-bold">{r.steps.cut.toLocaleString()}</span></div>
        </div>
      </NeonCard>

      {/* ═══════ SECTION 3: NUTRICIÓN PERIODIZADA ═══════ */}
      <SectionTitle>🧬 NUTRICIÓN DE PRECISIÓN</SectionTitle>

      <NeonCard title="Macros por kg de peso" glow="cyan">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span className="text-primary">Proteína</span><span className="font-display font-bold">{r.macrosPerKg.protein} g/kg</span></div>
          <div className="flex justify-between"><span className="text-secondary">Grasa</span><span className="font-display font-bold">{r.macrosPerKg.fat} g/kg</span></div>
          <div className="flex justify-between"><span className="text-accent">Carbohidratos</span><span className="font-display font-bold">{r.macrosPerKg.carbs} g/kg</span></div>
        </div>
      </NeonCard>

      {[r.trainingDayNutrition, r.restDayNutrition, r.competitionDayNutrition].map((dn, i) => (
        <NeonCard key={dn.label} title={dn.label} glow={i === 0 ? "lime" : i === 1 ? "purple" : "cyan"}>
          <BigStat value={dn.calories} unit="kcal" />
          <div className="mt-2 space-y-1 text-sm font-body">
            <p><span className="text-primary font-semibold">{dn.macros.protein}g</span> P · <span className="text-accent font-semibold">{dn.macros.carbs}g</span> C · <span className="text-secondary font-semibold">{dn.macros.fat}g</span> G</p>
            <p className="text-muted-foreground text-xs">{dn.description}</p>
          </div>
        </NeonCard>
      ))}

      {/* Meal Timing */}
      <NeonCard title="Crononutrición" glow="cyan" className="md:col-span-2 lg:col-span-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {r.mealTimings.map((mt) => (
            <div key={mt.meal} className="bg-muted/30 rounded-xl p-3 border border-glass-border">
              <p className="font-display text-xs tracking-wider text-primary">{mt.time}</p>
              <p className="font-display font-bold text-sm mt-1">{mt.meal}</p>
              <p className="text-xs text-muted-foreground mt-1">{mt.emphasis}</p>
            </div>
          ))}
        </div>
      </NeonCard>

      {/* ═══════ SECTION 4: DIETA SEMANAL ═══════ */}
      <SectionTitle>🥗 DIETA SEMANAL EQUILIBRADA</SectionTitle>

      <NeonCard title="Plan Lunes a Domingo" glow="lime" className="md:col-span-2 lg:col-span-3">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {r.weeklyDiet.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`px-3 py-2 rounded-lg font-display text-xs tracking-wider whitespace-nowrap transition-all border ${
                activeDay === i
                  ? "border-neon-lime bg-neon-lime/10 text-accent glow-lime"
                  : "border-glass-border text-muted-foreground hover:border-neon-lime/40"
              }`}
            >
              {d.day}
            </button>
          ))}
        </div>
        {r.weeklyDiet[activeDay] && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-display text-sm tracking-wider text-accent">{r.weeklyDiet[activeDay].day}</span>
              <span className="font-display font-bold text-primary">{r.weeklyDiet[activeDay].totalCalories} kcal</span>
            </div>
            {r.weeklyDiet[activeDay].meals.map((meal) => (
              <div key={meal.name} className="bg-muted/30 rounded-xl p-3 border border-glass-border">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-display text-xs tracking-wider text-primary">{meal.name}</span>
                  <span className="text-xs font-display text-muted-foreground">{meal.calories} kcal</span>
                </div>
                <ul className="space-y-0.5">
                  {meal.foods.map((food, j) => (
                    <li key={j} className="text-sm font-body text-foreground/80">• {food}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </NeonCard>

      {/* ═══════ SECTION 5: SUPLEMENTACIÓN ═══════ */}
      <SectionTitle>💊 LABORATORIO DE SUPLEMENTACIÓN</SectionTitle>

      <NeonCard title="Protocolo de Creatina" glow="cyan">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span>Fase de Carga (5-7 días)</span><span className="font-display font-bold text-primary">{r.supplements.creatine.loading} g/día</span></div>
          <div className="flex justify-between"><span>Mantenimiento</span><span className="font-display font-bold text-accent">{r.supplements.creatine.maintenance} g/día</span></div>
          <p className="text-xs text-muted-foreground mt-1">Monohidrato de creatina basado en masa magra ({r.leanMass} kg)</p>
        </div>
      </NeonCard>

      <NeonCard title="Protocolo de Cafeína" glow="purple">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span>Dosis óptima</span><span className="font-display font-bold text-secondary">{r.supplements.caffeine.dose} mg</span></div>
          <div className="flex justify-between"><span>Dosis máxima segura</span><span className="font-display font-bold text-neon-pink">{r.supplements.caffeine.maxSafe} mg</span></div>
          <p className="text-xs text-muted-foreground mt-1">⏰ {r.supplements.caffeine.timing}</p>
        </div>
      </NeonCard>

      <NeonCard title="Electrolitos" glow="lime">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span>Sodio</span><span className="font-display font-bold">{r.supplements.electrolytes.sodium} mg</span></div>
          <div className="flex justify-between"><span>Potasio</span><span className="font-display font-bold">{r.supplements.electrolytes.potassium} mg</span></div>
          <div className="flex justify-between"><span>Magnesio</span><span className="font-display font-bold">{r.supplements.electrolytes.magnesium} mg</span></div>
          <p className="text-xs text-muted-foreground mt-1">Reposición estimada por sesión de entrenamiento</p>
        </div>
      </NeonCard>

      {/* ═══════ SECTION 6: RENDIMIENTO ═══════ */}
      <SectionTitle>🏋️ RENDIMIENTO & RECUPERACIÓN</SectionTitle>

      <NeonCard title="Volumen de Entrenamiento" glow="cyan">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span>Series/músculo/semana</span><span className="font-display font-bold text-primary">{r.trainingVolume.setsPerMuscle.min}-{r.trainingVolume.setsPerMuscle.max}</span></div>
          <div className="flex justify-between"><span>Frecuencia</span><span className="font-display font-bold">{r.trainingVolume.frequency}x /semana</span></div>
          <p className="text-xs text-muted-foreground mt-1">{r.trainingVolume.description}</p>
        </div>
      </NeonCard>

      <NeonCard title="Estimador 1RM" glow="purple">
        <div className="space-y-2 text-sm font-body">
          <p className="text-muted-foreground">Ingresa el peso levantado y repeticiones:</p>
          <p className="text-xs text-muted-foreground">Fórmula Epley: <span className="text-secondary font-display">1RM = Peso × (1 + Reps/30)</span></p>
          <div className="bg-muted/30 rounded-lg p-3 mt-2">
            <p className="text-xs text-primary font-display">Ejemplo: 80kg × 8 reps</p>
            <p className="font-display font-bold text-lg">{Math.round(80 * (1 + 8/30))} kg = 1RM estimado</p>
          </div>
        </div>
      </NeonCard>

      <NeonCard title="Ciclos de Sueño" glow="lime">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span>Hora óptima de dormir</span><span className="font-display font-bold text-accent">{r.sleepCycles.optimalBedtime}</span></div>
          <div className="flex justify-between"><span>Despertar</span><span className="font-display font-bold text-primary">{r.sleepCycles.wakeTime}</span></div>
          <div className="flex justify-between"><span>Ciclos completos</span><span className="font-display font-bold">{r.sleepCycles.cycles} × 90min</span></div>
          <div className="flex justify-between"><span>Total</span><span className="font-display font-bold">{r.sleepCycles.totalHours} hrs</span></div>
          <p className="text-xs text-muted-foreground mt-1">💡 {r.healthTip}</p>
        </div>
      </NeonCard>

      {/* Muscle Heatmap */}
      <NeonCard title="Mapa de Calor Muscular" glow="cyan" className="md:col-span-2 lg:col-span-3">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {muscleGroups.map((mg) => {
            const intensity = mg.intensity;
            const bg = intensity > 80 ? "bg-neon-pink/30 border-neon-pink/60" : intensity > 60 ? "bg-secondary/20 border-secondary/40" : "bg-primary/10 border-primary/30";
            return (
              <div key={mg.name} className={`rounded-xl p-3 border text-center ${bg}`}>
                <p className="font-display text-xs tracking-wider">{mg.name}</p>
                <p className="font-display font-bold text-lg">{mg.sets}</p>
                <p className="text-xs text-muted-foreground">series</p>
              </div>
            );
          })}
        </div>
      </NeonCard>

      {/* ═══════ SECTION 7: VISUALIZACIÓN AVANZADA ═══════ */}
      <SectionTitle>📊 VISUALIZACIÓN CYBER-PRO</SectionTitle>

      {/* Radar Chart */}
      <NeonCard title="Perfil vs Élite" glow="purple" className="md:col-span-2 lg:col-span-2">
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(230, 30%, 22%)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(220, 15%, 55%)", fontSize: 11 }} />
            <Radar name="Tú" dataKey="user" stroke="hsl(180, 100%, 50%)" fill="hsl(180, 100%, 50%)" fillOpacity={0.2} />
            <Radar name="Élite" dataKey="elite" stroke="hsl(270, 100%, 65%)" fill="hsl(270, 100%, 65%)" fillOpacity={0.1} />
            <Legend wrapperStyle={{ fontSize: 11, color: "hsl(220, 15%, 55%)" }} />
          </RadarChart>
        </ResponsiveContainer>
      </NeonCard>

      {/* Progress Timeline */}
      <NeonCard title="Proyección 12 Semanas" glow="lime">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 30%, 18%)" />
            <XAxis dataKey="semana" tick={{ fill: "hsl(220, 15%, 55%)", fontSize: 10 }} />
            <YAxis tick={{ fill: "hsl(220, 15%, 55%)", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "hsl(230, 25%, 10%)", border: "1px solid hsl(230, 30%, 22%)", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="peso" name="Peso (kg)" stroke="hsl(180, 100%, 50%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="grasa" name="% Grasa" stroke="hsl(270, 100%, 65%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </NeonCard>
    </motion.div>
  );
}
