import { useState } from "react";
import { motion } from "framer-motion";
import type { UserData, Sex, ActivityLevel } from "@/lib/fitness-calculations";

interface Props {
  onSubmit: (data: UserData) => void;
}

const activityOptions: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentario" },
  { value: "light", label: "Ligero (1-3 días)" },
  { value: "moderate", label: "Moderado (3-5 días)" },
  { value: "active", label: "Activo (6-7 días)" },
  { value: "very_active", label: "Muy Activo (2x día)" },
];

export default function InputForm({ onSubmit }: Props) {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !weight || !height) return;
    onSubmit({
      age: Number(age),
      sex,
      weight: Number(weight),
      height: Number(height),
      activity,
    });
  };

  const inputClass =
    "w-full bg-muted/50 border border-glass-border rounded-lg px-4 py-3 font-body text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan focus:glow-cyan transition-all";

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-6 md:p-8 neon-border-cyan space-y-5 max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-display font-bold text-primary text-glow-cyan text-center tracking-wider">
        DATOS PERSONALES
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-display text-muted-foreground mb-1 tracking-widest uppercase">Edad</label>
          <input type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} min={10} max={100} required />
        </div>
        <div>
          <label className="block text-sm font-display text-muted-foreground mb-1 tracking-widest uppercase">Sexo</label>
          <div className="flex gap-2">
            {(["male", "female"] as Sex[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSex(s)}
                className={`flex-1 py-3 rounded-lg font-display text-sm tracking-wider transition-all border ${
                  sex === s
                    ? "border-neon-cyan bg-neon-cyan/10 text-primary glow-cyan"
                    : "border-glass-border text-muted-foreground hover:border-neon-cyan/40"
                }`}
              >
                {s === "male" ? "♂ Hombre" : "♀ Mujer"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-display text-muted-foreground mb-1 tracking-widest uppercase">Peso (kg)</label>
          <input type="number" placeholder="75" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass} min={30} max={300} required />
        </div>
        <div>
          <label className="block text-sm font-display text-muted-foreground mb-1 tracking-widest uppercase">Altura (cm)</label>
          <input type="number" placeholder="175" value={height} onChange={(e) => setHeight(e.target.value)} className={inputClass} min={100} max={250} required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-display text-muted-foreground mb-1 tracking-widest uppercase">Nivel de Actividad</label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityLevel)}
          className={inputClass + " cursor-pointer"}
        >
          {activityOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-4 rounded-xl font-display font-bold text-lg tracking-widest uppercase gradient-neon text-primary-foreground glow-cyan transition-all"
      >
        ⚡ CALCULAR
      </motion.button>
    </motion.form>
  );
}
