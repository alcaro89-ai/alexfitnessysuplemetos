import { motion } from "framer-motion";
import { Brain, Zap, Trophy, Share2, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Diagnosis, FitnessLevel } from "@/lib/diagnosis";

interface Props {
  diagnosis: Diagnosis;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const LEVEL_STYLES: Record<FitnessLevel, { glow: string; text: string; border: string; icon: string }> = {
  Novato: { glow: "shadow-[0_0_30px_hsl(180_100%_50%/0.4)]", text: "text-primary", border: "border-primary/50", icon: "🥉" },
  Intermedio: { glow: "shadow-[0_0_30px_hsl(80_100%_55%/0.4)]", text: "text-accent", border: "border-accent/50", icon: "🥈" },
  Avanzado: { glow: "shadow-[0_0_30px_hsl(270_100%_65%/0.5)]", text: "text-secondary", border: "border-secondary/50", icon: "🥇" },
  Elite: { glow: "shadow-[0_0_50px_hsl(320_100%_60%/0.6)]", text: "text-neon-pink", border: "border-neon-pink/60", icon: "👑" },
};

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between font-display text-xs tracking-widest uppercase">
        <span className="text-muted-foreground">{label}</span>
        <span className={color}>{value}%</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden bg-muted border border-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-purple)), hsl(var(--neon-lime)))`,
            boxShadow: `0 0 12px hsl(var(--neon-cyan) / 0.6)`,
          }}
        />
      </div>
    </div>
  );
}

export default function IntelligentDiagnosis({ diagnosis }: Props) {
  const levelStyle = LEVEL_STYLES[diagnosis.level];

  const handleShare = async () => {
    const text = diagnosis.shareText;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mi resultado AlexFitnessy", text, url: "https://www.alexfitnessysuplementos.es" });
        return;
      } catch {/* user cancelled */}
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("¡Resultado copiado al portapapeles!");
    } catch {
      toast.error("No se pudo compartir");
    }
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Section header */}
      <motion.div variants={item} className="text-center space-y-1">
        <h2 className="font-display text-2xl md:text-3xl gradient-neon-text tracking-widest uppercase">
          Diagnóstico Inteligente
        </h2>
        <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">
          Análisis biométrico avanzado
        </p>
      </motion.div>

      {/* Level Badge */}
      <motion.div variants={item} className="flex justify-center">
        <div className={`glass rounded-2xl px-8 py-5 border-2 ${levelStyle.border} ${levelStyle.glow} text-center`}>
          <p className="font-display text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
            Tu Nivel
          </p>
          <p className={`font-display text-3xl md:text-4xl font-bold tracking-widest ${levelStyle.text}`}>
            {levelStyle.icon} {diagnosis.level}
          </p>
        </div>
      </motion.div>

      {/* Insights + Scores grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Insights */}
        <motion.div variants={item} className="glass rounded-2xl p-6 neon-border-cyan">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-primary text-glow-cyan">
              Análisis Personal
            </h3>
          </div>
          <ul className="space-y-3">
            {diagnosis.insights.map((insight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex gap-2 text-sm text-foreground/90 leading-relaxed"
              >
                <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{insight}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Score gaming-style */}
        <motion.div variants={item} className="glass rounded-2xl p-6 neon-border-purple">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-secondary" />
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-secondary text-glow-purple">
              Stats Físicos
            </h3>
          </div>
          <div className="space-y-4">
            <ScoreBar label="Fuerza" value={diagnosis.scores.strength} color="text-primary" />
            <ScoreBar label="Composición" value={diagnosis.scores.bodyFat} color="text-accent" />
            <ScoreBar label="Masa Muscular" value={diagnosis.scores.muscleMass} color="text-secondary" />
            <div className="pt-3 mt-3 border-t border-border">
              <ScoreBar label="Potencial Total" value={diagnosis.scores.overall} color="text-neon-pink" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Supplement Recommender */}
      <motion.div variants={item} className="glass rounded-2xl p-6 border border-accent/40 glow-lime">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-accent" />
          <h3 className="font-display text-xs tracking-[0.25em] uppercase text-accent text-glow-lime">
            Según tu cuerpo necesitas
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5 tracking-wide">
          Recomendaciones personalizadas con descuento exclusivo en Zumub
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {diagnosis.supplements.map((sup, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-xl p-4 bg-card/60 border border-border hover:border-accent/60 transition-colors flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-display text-sm tracking-wider text-foreground">{sup.name}</h4>
                <span className={`text-[10px] font-display tracking-widest uppercase px-2 py-0.5 rounded-full ${
                  sup.priority === "alta"
                    ? "bg-neon-pink/20 text-neon-pink border border-neon-pink/40"
                    : "bg-muted text-muted-foreground border border-border"
                }`}>
                  {sup.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{sup.reason}</p>
              <a
                href={sup.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent text-background font-display text-xs tracking-widest uppercase py-2.5 hover:opacity-90 transition-opacity shadow-[0_0_20px_hsl(var(--neon-cyan)/0.4)]"
              >
                Comprar en Zumub <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Viral share button */}
      <motion.div variants={item} className="flex justify-center">
        <button
          onClick={handleShare}
          className="group relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 bg-gradient-to-r from-neon-pink via-secondary to-primary text-background font-display text-sm tracking-[0.25em] uppercase shadow-[0_0_40px_hsl(320_100%_60%/0.5)] hover:shadow-[0_0_60px_hsl(320_100%_60%/0.8)] transition-all hover:scale-105"
        >
          <Share2 className="w-5 h-5" />
          Compartir mi resultado
        </button>
      </motion.div>
    </motion.section>
  );
}
