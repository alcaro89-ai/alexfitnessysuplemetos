import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { Results } from "@/lib/fitness-calculations";

interface Props {
  results: Results;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

function NeonCard({
  title,
  children,
  glow = "cyan",
}: {
  title: string;
  children: React.ReactNode;
  glow?: "cyan" | "purple" | "lime";
}) {
  const glowClass = glow === "purple" ? "neon-border-purple" : glow === "lime" ? "glow-lime border border-neon-lime/40" : "neon-border-cyan";
  return (
    <motion.div variants={item} className={`glass rounded-2xl p-5 ${glowClass}`}>
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
      <motion.div
        initial={{ left: "0%" }}
        animate={{ left: `${pct}%` }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-primary glow-cyan"
      />
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

export default function ResultsDashboard({ results }: Props) {
  const r = results;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
    >
      {/* IMC */}
      <NeonCard title="IMC" glow="cyan">
        <BigStat value={r.bmi} sub={r.bmiCategory} />
        <BmiBar bmi={r.bmi} />
      </NeonCard>

      {/* Body Fat */}
      <NeonCard title="Grasa Corporal" glow="purple">
        <BigStat value={r.bodyFat} unit="%" sub="Estimación basada en IMC" />
      </NeonCard>

      {/* BMR */}
      <NeonCard title="TMB (Reposo)" glow="lime">
        <BigStat value={r.bmr} unit="kcal" sub="Calorías en reposo" />
      </NeonCard>

      {/* TDEE */}
      <NeonCard title="Gasto Energético Total" glow="cyan">
        <BigStat value={r.tdee} unit="kcal" sub="Según tu actividad" />
      </NeonCard>

      {/* Goals */}
      <NeonCard title="Objetivos Calóricos" glow="purple">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span className="text-accent">🔥 Volumen</span><span className="font-display font-bold">{r.bulkCal} kcal</span></div>
          <div className="flex justify-between"><span className="text-primary">⚖️ Mantener</span><span className="font-display font-bold">{r.maintainCal} kcal</span></div>
          <div className="flex justify-between"><span className="text-neon-pink">✂️ Definición</span><span className="font-display font-bold">{r.cutCal} kcal</span></div>
        </div>
      </NeonCard>

      {/* Hydration */}
      <NeonCard title="Hidratación" glow="cyan">
        <BigStat value={r.waterLiters} unit="L / día" sub="💧 35ml por kg de peso" />
      </NeonCard>

      {/* Steps */}
      <NeonCard title="Pasos Diarios" glow="lime">
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between"><span className="text-accent">Volumen</span><span className="font-display font-bold">{r.steps.bulk.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-primary">Mantener</span><span className="font-display font-bold">{r.steps.maintain.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-neon-pink">Definición</span><span className="font-display font-bold">{r.steps.cut.toLocaleString()}</span></div>
        </div>
      </NeonCard>

      {/* Macros */}
      <NeonCard title="Macros — Volumen" glow="cyan">
        <MacroChart macros={r.macros.bulk} />
      </NeonCard>

      <NeonCard title="Macros — Definición" glow="purple">
        <MacroChart macros={r.macros.cut} />
      </NeonCard>

      {/* Sleep & Tip */}
      <NeonCard title="Sueño & Salud" glow="lime">
        <BigStat value={r.sleepHours} unit="hrs" sub="Horas de sueño recomendadas" />
        <p className="mt-3 text-sm text-muted-foreground font-body leading-relaxed">
          💡 {r.healthTip}
        </p>
      </NeonCard>
    </motion.div>
  );
}
