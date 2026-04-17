import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Trophy, Share2, ExternalLink, Sparkles, Instagram, Download, Music2 } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import type { Diagnosis, FitnessLevel } from "@/lib/diagnosis";
import type { Results } from "@/lib/fitness-calculations";
import ShareCard from "./ShareCard";

interface Props {
  diagnosis: Diagnosis;
  results: Results;
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

export default function IntelligentDiagnosis({ diagnosis, results }: Props) {
  const levelStyle = LEVEL_STYLES[diagnosis.level];
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 1 });
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  const downloadImage = async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) throw new Error("no blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alexfitnessy-${diagnosis.level.toLowerCase()}-${diagnosis.potentialPercent}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("¡Imagen descargada! Súbela a tus historias.");
    } catch {
      toast.error("No se pudo generar la imagen");
    } finally {
      setGenerating(false);
    }
  };

  const shareNative = async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) throw new Error("no blob");
      const file = new File([blob], "alexfitnessy-resultado.png", { type: "image/png" });
      const text = `${diagnosis.shareText}\n\n💥 Código de descuento Zumub: ALEXKEN\n👉 alexfitnessysuplementos.es`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Mi resultado AlexFitnessy", text });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "alexfitnessy-resultado.png";
        a.click();
        URL.revokeObjectURL(url);
        await navigator.clipboard.writeText(text);
        toast.success("Imagen descargada y texto copiado");
      }
    } catch {
      toast.error("No se pudo compartir");
    } finally {
      setGenerating(false);
    }
  };

  const shareInstagram = async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) throw new Error("no blob");
      const file = new File([blob], "alexfitnessy.png", { type: "image/png" });
      const text = `${diagnosis.shareText} 💪 Código ALEXKEN en Zumub · alexfitnessysuplementos.es`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Instagram", text });
        return;
      }
      // Fallback: descargar + abrir Instagram
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "alexfitnessy-instagram.png";
      a.click();
      URL.revokeObjectURL(url);
      try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
      toast.success("Imagen lista. Abriendo Instagram...");
      window.open("https://www.instagram.com/", "_blank");
    } catch {
      toast.error("No se pudo abrir Instagram");
    } finally {
      setGenerating(false);
    }
  };

  const shareTikTok = async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) throw new Error("no blob");
      const file = new File([blob], "alexfitnessy.png", { type: "image/png" });
      const text = `${diagnosis.shareText} 💪 Código ALEXKEN en Zumub · alexfitnessysuplementos.es`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "TikTok", text });
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "alexfitnessy-tiktok.png";
      a.click();
      URL.revokeObjectURL(url);
      try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
      toast.success("Imagen lista. Abriendo TikTok...");
      window.open("https://www.tiktok.com/upload", "_blank");
    } catch {
      toast.error("No se pudo abrir TikTok");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      {/* Off-screen share card for image generation */}
      <div style={{ position: "fixed", left: -99999, top: 0, pointerEvents: "none" }} aria-hidden>
        <ShareCard ref={cardRef} diagnosis={diagnosis} results={results} />
      </div>

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
            Recomendaciones personalizadas con descuento exclusivo en Zumub · Código <span className="text-accent font-display">ALEXKEN</span>
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

        {/* Viral share section */}
        <motion.div variants={item} className="glass rounded-2xl p-6 border border-neon-pink/40 space-y-5">
          <div className="text-center space-y-1">
            <h3 className="font-display text-base md:text-lg gradient-neon-text tracking-[0.25em] uppercase">
              Comparte tu resultado
            </h3>
            <p className="text-xs text-muted-foreground tracking-wide">
              Genera una imagen tipo captura con tus stats, código <span className="text-accent font-display">ALEXKEN</span> y alexfitnessysuplementos.es
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={shareInstagram}
              disabled={generating}
              className="group inline-flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-4 bg-gradient-to-br from-[#feda75] via-[#fa7e1e] via-50% to-[#d62976] text-white font-display text-xs tracking-widest uppercase hover:scale-105 transition-transform disabled:opacity-50 shadow-[0_0_25px_hsl(320_100%_60%/0.4)]"
            >
              <Instagram className="w-6 h-6" />
              Instagram
            </button>

            <button
              onClick={shareTikTok}
              disabled={generating}
              className="group inline-flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-4 bg-gradient-to-br from-[#25F4EE] via-black via-50% to-[#FE2C55] text-white font-display text-xs tracking-widest uppercase hover:scale-105 transition-transform disabled:opacity-50 shadow-[0_0_25px_hsl(180_100%_50%/0.4)]"
            >
              <Music2 className="w-6 h-6" />
              TikTok
            </button>

            <button
              onClick={shareNative}
              disabled={generating}
              className="group inline-flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-4 bg-gradient-to-br from-primary via-secondary to-neon-pink text-background font-display text-xs tracking-widest uppercase hover:scale-105 transition-transform disabled:opacity-50 shadow-[0_0_25px_hsl(var(--neon-cyan)/0.4)]"
            >
              <Share2 className="w-6 h-6" />
              Compartir
            </button>

            <button
              onClick={downloadImage}
              disabled={generating}
              className="group inline-flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-4 bg-card border-2 border-accent/60 text-accent font-display text-xs tracking-widest uppercase hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Download className="w-6 h-6" />
              Descargar
            </button>
          </div>

          {generating && (
            <p className="text-center text-xs text-muted-foreground animate-pulse">Generando imagen...</p>
          )}
        </motion.div>
      </motion.section>
    </>
  );
}
