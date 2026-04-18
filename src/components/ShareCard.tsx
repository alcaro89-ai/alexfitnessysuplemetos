import { forwardRef } from "react";
import type { Diagnosis } from "@/lib/diagnosis";
import type { Results } from "@/lib/fitness-calculations";

interface Props {
  diagnosis: Diagnosis;
  results: Results;
  userName?: string;
}

const LEVEL_ICON: Record<string, string> = {
  Novato: "🥉",
  Intermedio: "🥈",
  Avanzado: "🥇",
  Elite: "👑",
};

const ShareCard = forwardRef<HTMLDivElement, Props>(({ diagnosis, results, userName }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1920,
        background: "linear-gradient(135deg, #0a0014 0%, #1a0033 50%, #001a2e 100%)",
        position: "relative",
        fontFamily: "'Orbitron', system-ui, sans-serif",
        color: "#fff",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Glow orbs */}
      <div style={{ position: "absolute", top: 100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,255,0.25), transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: 200, left: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(190,0,255,0.25), transparent 70%)", filter: "blur(40px)" }} />

      {/* Header */}
      <div style={{ textAlign: "center", zIndex: 2 }}>
        <div style={{ fontSize: 32, letterSpacing: 8, color: "#00f0ff", textTransform: "uppercase", marginBottom: 12 }}>
          Mi Diagnóstico Fitness
        </div>
        <div style={{
          fontSize: 44,
          fontWeight: 900,
          background: "linear-gradient(90deg, #00f0ff, #be00ff, #b6ff00)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: 3,
          whiteSpace: "nowrap",
        }}>
          ALEXFITNESSYSUPLEMENTOS
        </div>
        {userName && (
          <div style={{ fontSize: 36, marginTop: 20, color: "#b6ff00", letterSpacing: 3 }}>
            {userName.toUpperCase()}
          </div>
        )}
      </div>

      {/* Level badge */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 60, zIndex: 2 }}>
        <div style={{
          padding: "30px 60px",
          border: "3px solid #ff00aa",
          borderRadius: 24,
          background: "rgba(255,0,170,0.1)",
          textAlign: "center",
          boxShadow: "0 0 60px rgba(255,0,170,0.5)",
        }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#aaa", marginBottom: 8 }}>NIVEL</div>
          <div style={{ fontSize: 80, fontWeight: 900, color: "#ff00aa", letterSpacing: 6 }}>
            {LEVEL_ICON[diagnosis.level]} {diagnosis.level.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Big % */}
      <div style={{ textAlign: "center", marginTop: 60, zIndex: 2 }}>
        <div style={{ fontSize: 28, color: "#aaa", letterSpacing: 4 }}>POTENCIAL FÍSICO</div>
        <div style={{
          fontSize: 220,
          fontWeight: 900,
          lineHeight: 1,
          background: "linear-gradient(90deg, #00f0ff, #b6ff00)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {diagnosis.potentialPercent}%
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, zIndex: 2 }}>
        <StatBox label="Fuerza" value={`${diagnosis.scores.strength}%`} color="#00f0ff" />
        <StatBox label="Composición" value={`${diagnosis.scores.bodyFat}%`} color="#b6ff00" />
        <StatBox label="Masa Muscular" value={`${diagnosis.scores.muscleMass}%`} color="#be00ff" />
        <StatBox label="Metabolismo" value={diagnosis.metabolism} color="#ff00aa" />
        <StatBox label="IMC" value={results.bmi.toFixed(1)} color="#00f0ff" />
        <StatBox label="TMB" value={`${Math.round(results.bmr)} kcal`} color="#b6ff00" />
      </div>

      {/* Discount code */}
      <div style={{ marginTop: 50, padding: 30, border: "2px dashed #b6ff00", borderRadius: 20, textAlign: "center", background: "rgba(182,255,0,0.08)", zIndex: 2 }}>
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#aaa" }}>CÓDIGO DE DESCUENTO ZUMUB</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#b6ff00", letterSpacing: 12, marginTop: 8, textShadow: "0 0 30px rgba(182,255,0,0.6)" }}>
          ALEXKEN
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "auto", textAlign: "center", zIndex: 2 }}>
        <div style={{ fontSize: 28, color: "#aaa", letterSpacing: 3 }}>HAZ TU TEST GRATIS EN</div>
        <div style={{
          fontSize: 44,
          fontWeight: 900,
          marginTop: 12,
          background: "linear-gradient(90deg, #00f0ff, #be00ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: 3,
        }}>
          alexfitnessysuplementos.es
        </div>
      </div>
    </div>
  );
});

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      padding: 24,
      background: "rgba(255,255,255,0.04)",
      border: `2px solid ${color}55`,
      borderRadius: 20,
      boxShadow: `0 0 30px ${color}22`,
    }}>
      <div style={{ fontSize: 22, letterSpacing: 3, color: "#aaa", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 56, fontWeight: 900, color, marginTop: 6 }}>{value}</div>
    </div>
  );
}

ShareCard.displayName = "ShareCard";
export default ShareCard;
