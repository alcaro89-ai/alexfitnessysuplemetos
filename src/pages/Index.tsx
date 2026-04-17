import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputForm from "@/components/InputForm";
import ResultsDashboard from "@/components/ResultsDashboard";
import { calculate, type UserData, type Results } from "@/lib/fitness-calculations";
import sharkLogo from "@/assets/shark-logo.png";

export default function Index() {
  const [results, setResults] = useState<Results | null>(null);

  const handleSubmit = (data: UserData) => {
    setResults(calculate(data));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scan line effect */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="animate-scan-line w-full h-px bg-primary/10" />
      </div>

      {/* Background glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-neon-purple/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-neon-lime/3 blur-[100px]" />
      </div>

      <div className="relative z-10 container py-8 md:py-12 space-y-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold gradient-neon-text tracking-wider">
            AlexFitnessySuplementos
          </h1>
          <p className="font-body text-lg text-muted-foreground tracking-wide">
            Consola de biotecnología deportiva de élite
          </p>
        </motion.header>

        {/* Form */}
        <InputForm onSubmit={handleSubmit} />

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsDashboard results={results} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sponsor section with logo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center gap-4 pt-12 pb-6"
        >
          <img
            src={sharkLogo}
            alt="AlexFitnessySuplementos - Patrocinador oficial Zumub España"
            className="w-48 md:w-64 h-auto drop-shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)]"
          />
          <a
            href="https://www.alexfitnessysuplementos.es"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-base md:text-lg gradient-neon-text tracking-widest hover:opacity-80 transition-opacity"
          >
            www.alexfitnessysuplementos.es
          </a>
          <p className="font-body text-sm md:text-base text-neon-lime tracking-wider uppercase">
            Patrocinador oficial de Zumub España
          </p>
        </motion.section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground font-body pt-4 pb-4 tracking-wider">
          AlexFitnessySuplementos — Fórmulas: Mifflin-St Jeor · Katch-McArdle · Du Bois · IMC · Hidratación 35ml/kg
        </footer>
      </div>
    </div>
  );
}
