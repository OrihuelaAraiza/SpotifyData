import { motion } from "framer-motion";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend
} from "recharts";
import {
  Database, GitBranch, Layers, CheckCircle2, ArrowRight,
  BrainCircuit, Network, Target, FlaskConical, TrendingUp,
  BarChart2, Users, Shuffle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SectionLabel } from "./SectionLabel";
import { ANALYSIS } from "../data/analysis";

const tooltipStyle = {
  contentStyle: {
    background: "rgba(8,8,8,0.95)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, backdropFilter: "blur(20px)", color: "#fff",
    fontSize: 12, fontFamily: "Inter", padding: "10px 14px",
  },
  itemStyle: { color: "#b3b3b3" },
  labelStyle: { color: "#fff", fontWeight: 700 },
};

const PERSON_CLUSTER_COLORS = {
  jp: ["#1DB954", "#06b6d4", "#a78bfa"],
  ar: ["#E8119C", "#fb923c", "#a78bfa"],
};
// resolved per render via getClusterColors(person.id)
let CLUSTER_COLORS = ["#6366f1", "#f59e0b", "#10b981"]; // fallback
const BLOCKS = ["madrugada", "manana", "tarde", "noche"];
const BLOCK_LABELS = { madrugada: "Madrugada\n0-6h", manana: "Mañana\n6-12h", tarde: "Tarde\n12-18h", noche: "Noche\n18-0h" };
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// ── Pipeline Funnel ───────────────────────────────────────────────────────────
function PipelineFunnel({ pipeline, color }) {
  const steps = pipeline.steps;
  const max = steps[0].records;
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const pct = (step.records / max) * 100;
        const isLast = i === steps.length - 1;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-1.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: isLast ? color : color + "30", color: isLast ? "#000" : color }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] font-semibold text-white/80">{step.step}</span>
                  <span className="text-[12px] font-black tabular-nums" style={{ color: isLast ? color : "rgba(255,255,255,0.5)" }}>
                    {step.records.toLocaleString("es-MX")}
                  </span>
                </div>
                <div className="text-[11px] text-white/30">{step.detail}</div>
              </div>
            </div>
            <div className="ml-9 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: isLast ? color : color + "55" }}
              />
            </div>
            {i < steps.length - 1 && (
              <div className="ml-[38px] mt-1 flex items-center gap-1.5">
                <ArrowRight size={10} className="text-white/15" />
                <span className="text-[10px] text-white/20">
                  {(steps[i].records - steps[i + 1].records).toLocaleString("es-MX")} registros eliminados
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Pipeline Stats Row ────────────────────────────────────────────────────────
function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="text-2xl font-black tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1 text-center">{label}</div>
    </div>
  );
}

// ── Cluster Timeline ──────────────────────────────────────────────────────────
function ClusterTimeline({ monthClusters, clusterNames, color }) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-3">
        {monthClusters.map((m, i) => (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setHoveredMonth(m)}
            onMouseLeave={() => setHoveredMonth(null)}
          >
            <div
              className="w-4 h-4 rounded-[2px] cursor-pointer transition-all duration-150 hover:scale-125 hover:z-10"
              style={{ background: CLUSTER_COLORS[m.cluster] + (hoveredMonth?.month === m.month ? "ff" : "99") }}
            />
          </div>
        ))}
      </div>
      {hoveredMonth && (
        <div className="text-[11px] text-white/60 mb-2">
          <span className="font-semibold text-white">{hoveredMonth.month}</span>
          {" · "}
          <span style={{ color: CLUSTER_COLORS[hoveredMonth.cluster] }}>
            {clusterNames[hoveredMonth.cluster]}
          </span>
          {" · "}
          {hoveredMonth.hours}h
        </div>
      )}
      <div className="flex gap-4 mt-2">
        {clusterNames.map((name, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CLUSTER_COLORS[i] }} />
            <span className="text-[11px] text-white/40">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cluster Radar ─────────────────────────────────────────────────────────────
function ClusterRadar({ profiles }) {
  const dims = [
    { key: "avgHours",      label: "Horas",        scale: 130 },
    { key: "avgArtists",    label: "Artistas",      scale: 550 },
    { key: "skipRate",      label: "Skip %",        scale: 60  },
    { key: "nightRatio",    label: "Noche %",       scale: 100 },
    { key: "discoveryRate", label: "Descubrimiento",scale: 20  },
    { key: "repeatRatio",   label: "Repetición %",  scale: 70  },
  ];

  const data = dims.map(({ key, label, scale }) => {
    const entry = { subject: label };
    profiles.forEach(p => {
      entry[`c${p.cluster}`] = Math.min(100, Math.round((p[key] / scale) * 100));
    });
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 10, fontFamily: "Inter" }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        {profiles.map(p => (
          <Radar
            key={p.cluster}
            name={p.name}
            dataKey={`c${p.cluster}`}
            stroke={CLUSTER_COLORS[p.cluster]}
            fill={CLUSTER_COLORS[p.cluster]}
            fillOpacity={0.12}
            strokeWidth={1.5}
            dot={{ fill: CLUSTER_COLORS[p.cluster], r: 2 }}
          />
        ))}
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "Inter", color: "#777" }} />
        <Tooltip {...tooltipStyle} formatter={(v) => [`${v} / 100`]} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ── Cluster Cards ─────────────────────────────────────────────────────────────
function ClusterCards({ profiles }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {profiles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
          style={{ borderLeftColor: CLUSTER_COLORS[p.cluster], borderLeftWidth: 3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: CLUSTER_COLORS[p.cluster] }} />
            <span className="text-[12px] font-bold text-white/90">{p.name}</span>
            <span className="ml-auto text-[10px] text-white/30">{p.months} meses</span>
          </div>
          {[
            ["Horas/mes", `${p.avgHours}h`],
            ["Artistas", p.avgArtists.toLocaleString()],
            ["Skip rate", `${p.skipRate}%`],
            ["Noche", `${p.nightRatio}%`],
            ["Descubrimiento", `${p.discoveryRate}%`],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-1 border-b border-white/[0.03] last:border-0">
              <span className="text-[11px] text-white/30">{label}</span>
              <span className="text-[11px] font-semibold" style={{ color: CLUSTER_COLORS[p.cluster] }}>{val}</span>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

// ── Markov Heatmap ────────────────────────────────────────────────────────────
function MarkovHeatmap({ matrix, color }) {
  const [tooltip, setTooltip] = useState(null);

  return (
    <div>
      <div className="mb-4 text-[11px] text-white/30">
        Probabilidad de que la sesión siguiente sea en el bloque de columna, dado que la actual es en el bloque de fila.
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="text-[10px] text-white/20 font-normal pb-2 pr-3 text-right">Origen →</th>
              {BLOCKS.map(b => (
                <th key={b} className="text-[10px] text-white/40 font-semibold pb-2 px-1">{BLOCK_LABELS[b]?.split("\n")[0] ?? b}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BLOCKS.map(src => (
              <tr key={src}>
                <td className="text-[10px] text-white/40 font-semibold pr-3 py-1 text-right">{BLOCK_LABELS[src]?.split("\n")[0] ?? src}</td>
                {BLOCKS.map(dst => {
                  const prob = matrix[src]?.[dst] ?? 0;
                  const alpha = Math.round(prob * 220);
                  const bg = prob > 0 ? color + alpha.toString(16).padStart(2, "0") : "rgba(255,255,255,0.03)";
                  return (
                    <td key={dst} className="py-1 px-1">
                      <div
                        className="w-full h-10 rounded-lg flex items-center justify-center cursor-default transition-all duration-150 hover:scale-105"
                        style={{ background: bg }}
                        onMouseEnter={() => setTooltip({ src, dst, prob })}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        <span className="text-[11px] font-bold" style={{ color: prob > 0.25 ? "#fff" : "rgba(255,255,255,0.4)" }}>
                          {prob > 0 ? `${(prob * 100).toFixed(0)}%` : "—"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tooltip && (
        <div className="mt-3 text-[12px] text-white/50">
          Sesión en <span className="text-white font-semibold">{BLOCK_LABELS[tooltip.src]?.split("\n")[0] ?? tooltip.src}</span>
          {" → "}
          siguiente en <span className="font-semibold" style={{ color }}>{BLOCK_LABELS[tooltip.dst]?.split("\n")[0] ?? tooltip.dst}</span>:
          {" "}
          <span className="font-black text-white">{(tooltip.prob * 100).toFixed(1)}%</span> de probabilidad
        </div>
      )}
    </div>
  );
}

// ── Skip Classifier ───────────────────────────────────────────────────────────
function ConfusionMatrix({ cm, color }) {
  const total = cm.tp + cm.tn + cm.fp + cm.fn;
  const cells = [
    { label: "VP", sublabel: "skip correcto", value: cm.tp, bg: color + "40", text: color },
    { label: "FP", sublabel: "falsa alarma",  value: cm.fp, bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
    { label: "FN", sublabel: "skip perdido",  value: cm.fn, bg: "rgba(239,68,68,0.10)", text: "#f87171" },
    { label: "VN", sublabel: "no-skip correcto", value: cm.tn, bg: "rgba(255,255,255,0.05)", text: "rgba(255,255,255,0.6)" },
  ];
  return (
    <div>
      <div className="text-[10px] text-white/25 text-center mb-3 uppercase tracking-wider">Predicho: Skip / No Skip</div>
      <div className="grid grid-cols-2 gap-2">
        {cells.map((c, i) => (
          <div key={i} className="p-4 rounded-xl text-center" style={{ background: c.bg }}>
            <div className="text-xl font-black" style={{ color: c.text }}>{c.value.toLocaleString()}</div>
            <div className="text-[10px] font-bold" style={{ color: c.text }}>{c.label}</div>
            <div className="text-[10px] text-white/30 mt-0.5">{c.sublabel}</div>
            <div className="text-[9px] text-white/20 mt-1">{((c.value/total)*100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoefficientsChart({ coefs, color }) {
  const data = [...coefs].sort((a, b) => Math.abs(b.coef) - Math.abs(a.coef));
  const maxAbs = Math.max(...data.map(d => Math.abs(d.coef)));
  return (
    <div className="space-y-2">
      {data.map((c, i) => {
        const pct = (Math.abs(c.coef) / maxAbs) * 100;
        const isPositive = c.coef > 0;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2"
          >
            <div className="text-[11px] text-white/40 w-40 shrink-0 truncate text-right">{c.feature}</div>
            <div className="flex-1 h-5 bg-white/[0.04] rounded overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.6, ease: "easeOut" }}
                className="h-full rounded"
                style={{ background: isPositive ? "#ef4444cc" : color + "cc" }}
              />
            </div>
            <div className="text-[10px] font-mono w-14 shrink-0" style={{ color: isPositive ? "#ef4444" : color }}>
              {c.coef > 0 ? "+" : ""}{c.coef.toFixed(3)}
            </div>
          </motion.div>
        );
      })}
      <div className="flex gap-4 mt-3 pt-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded bg-[#ef4444]" /><span className="text-[10px] text-white/30">Aumenta probabilidad de skip</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded" style={{ background: color }} /><span className="text-[10px] text-white/30">Reduce probabilidad de skip</span></div>
      </div>
    </div>
  );
}

// ── Reason Distribution ───────────────────────────────────────────────────────
function ReasonChart({ reasons, color }) {
  const maxS = Math.max(...reasons.starts.map(r => r.count));
  const maxE = Math.max(...reasons.ends.map(r => r.count));
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[["Inicio de reproducción", reasons.starts, maxS], ["Fin de reproducción", reasons.ends, maxE]].map(([title, rows, mx]) => (
        <div key={title}>
          <div className="text-[11px] text-white/30 uppercase tracking-wider mb-3">{title}</div>
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-[11px] text-white/50 w-28 shrink-0 truncate">{r.reason}</div>
                <div className="flex-1 h-4 bg-white/[0.04] rounded overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.count/mx)*100}%` }}
                    transition={{ delay: i * 0.04 + 0.2, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded"
                    style={{ background: color + (i === 0 ? "dd" : "66") }}
                  />
                </div>
                <div className="text-[10px] text-white/30 w-14 shrink-0 text-right tabular-nums">
                  {r.count.toLocaleString("es-MX")}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Person Analysis Tab ───────────────────────────────────────────────────────
function PersonAnalysis({ person, data }) {
  const { color, colorAlpha, name } = person;
  const { pipeline, monthClusters, timeblockMarkov, reasons, ml } = data;
  const clusterNames = ml.clustering.profiles.map(p => p.name);

  const metricCards = [
    { label: "Registros raw",   value: pipeline.rawRows.toLocaleString("es-MX"),     icon: <Database size={16} /> },
    { label: "Tras limpieza",   value: pipeline.cleanedRows.toLocaleString("es-MX"), icon: <CheckCircle2 size={16} /> },
    { label: "Retención",       value: `${pipeline.retentionPct}%`,                  icon: <Target size={16} /> },
    { label: "Archivos fuente", value: `${pipeline.audioFiles} JSON`,                icon: <Layers size={16} /> },
  ];

  return (
    <div className="space-y-10">
      {/* Pipeline hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl p-6 border border-white/[0.06] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colorAlpha} 0%, rgba(0,0,0,0) 60%)` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(ellipse at 0% 50%, ${color}40 0%, transparent 60%)` }} />
        <div className="relative">
          <div className="text-[11px] font-bold uppercase tracking-[3px] mb-2" style={{ color }}>Pipeline de Datos</div>
          <h3 className="text-xl font-bold text-white mb-4">{name} — De JSON crudo a insights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {metricCards.map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 mb-1.5 opacity-50" style={{ color }}>{m.icon}</div>
                <div className="text-lg font-black tabular-nums" style={{ color }}>{m.value}</div>
                <div className="text-[10px] text-white/30">{m.label}</div>
              </div>
            ))}
          </div>
          <PipelineFunnel pipeline={pipeline} color={color} />
        </div>
      </motion.div>

      {/* Reasons */}
      <SectionLabel icon={<GitBranch size={14} />} color={color}>Comportamiento de Reproducción</SectionLabel>
      <Card>
        <CardHeader><CardTitle>Causas de Inicio y Fin de Reproducción</CardTitle></CardHeader>
        <CardContent><ReasonChart reasons={reasons} color={color} /></CardContent>
      </Card>

      {/* Clustering */}
      <SectionLabel icon={<BrainCircuit size={14} />} color={color}>K-Means Mensual (k=3)</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Cada Cluster</CardTitle>
            <p className="text-[11px] text-white/30 mt-1">
              Modelo: {ml.clustering.model} · Silhouette: {ml.clustering.silhouette}
            </p>
          </CardHeader>
          <CardContent>
            <ClusterRadar profiles={ml.clustering.profiles} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Línea de Tiempo por Cluster</CardTitle></CardHeader>
          <CardContent>
            <ClusterTimeline monthClusters={monthClusters} clusterNames={clusterNames} color={color} />
          </CardContent>
        </Card>
      </div>
      <ClusterCards profiles={ml.clustering.profiles} />

      {/* Markov */}
      <SectionLabel icon={<Shuffle size={14} />} color={color}>Cadena de Markov — Transiciones de Sesión</SectionLabel>
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Transición entre Bloques Horarios</CardTitle>
          <p className="text-[11px] text-white/30 mt-1">
            Calculada sobre {timeblockMarkov.top.reduce((s, t) => s, 0).toLocaleString()} transiciones de sesión consecutivas
          </p>
        </CardHeader>
        <CardContent>
          <MarkovHeatmap matrix={timeblockMarkov.matrix} color={color} />
        </CardContent>
      </Card>

      {/* Skip Classifier */}
      <SectionLabel icon={<FlaskConical size={14} />} color={color}>Clasificador de Skip — Regresión Logística</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Accuracy", value: `${(ml.skipClassifier.accuracy * 100).toFixed(1)}%` },
          { label: "Precision", value: `${(ml.skipClassifier.precision * 100).toFixed(1)}%` },
          { label: "Recall", value: `${(ml.skipClassifier.recall * 100).toFixed(1)}%` },
          { label: "F1 Score", value: `${(ml.skipClassifier.f1 * 100).toFixed(1)}%` },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center"
          >
            <div className="text-2xl font-black" style={{ color }}>{m.value}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{m.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Matriz de Confusión</CardTitle>
            <p className="text-[11px] text-white/30 mt-1">
              {ml.skipClassifier.testRows.toLocaleString()} registros de prueba
            </p>
          </CardHeader>
          <CardContent>
            <ConfusionMatrix cm={ml.skipClassifier.confusionMatrix} color={color} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Coeficientes del Modelo</CardTitle>
            <p className="text-[11px] text-white/30 mt-1">Factores que más influyen en predecir un skip</p>
          </CardHeader>
          <CardContent>
            <CoefficientsChart coefs={ml.skipClassifier.topCoefficients} color={color} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function AnalysisSection({ person }) {
  // Set cluster colors before rendering so all sub-components pick them up
  CLUSTER_COLORS = PERSON_CLUSTER_COLORS[person.id] ?? PERSON_CLUSTER_COLORS.jp;
  const data = ANALYSIS[person.id === "jp" ? "jp" : "ar"];
  return <PersonAnalysis person={person} data={data} />;
}
