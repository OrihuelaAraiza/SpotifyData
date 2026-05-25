import { motion } from "framer-motion";
import {
  Clock, CalendarDays, Mic2, SkipForward, Play, Trophy,
  BarChart2, TrendingUp, Grid3X3, Music2, PieChart as PieIcon,
  Target, List, Lightbulb, Smartphone, Tablet, Monitor, Globe, Headphones,
} from "lucide-react";
import { cn } from "../lib/utils";
import { KPICard } from "./KPICard";
import { InsightCard } from "./InsightCard";
import { SectionLabel } from "./SectionLabel";
import { HeatmapGrid } from "./HeatmapGrid";
import { TopList } from "./TopList";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  TimelineChart, HourlyChart, SkipRateChart, DonutChart,
} from "./Charts";

// ── Annotations per person ───────────────────────────────────────────────────
const ANNOTATIONS = {
  jp: [
    { month: "2016-11", label: "Primer pico" },
    { month: "2025-11", label: "Máximo histórico" },
  ],
  ar: [
    { month: "2020-03", label: "Confinamiento COVID" },
    { month: "2019-05", label: "Pico 2019" },
  ],
};

// ── Device icon mapping ───────────────────────────────────────────────────────
const DEVICE_MAP = {
  iPhone:  { icon: Smartphone, accent: "#60a5fa", label: "iPhone / iOS"  },
  iPad:    { icon: Tablet,     accent: "#a78bfa", label: "iPad / iOS"    },
  Windows: { icon: Monitor,    accent: "#94a3b8", label: "Windows"       },
  Android: { icon: Smartphone, accent: "#4ade80", label: "Android"       },
  Web:     { icon: Globe,      accent: "#fb923c", label: "Web Player"    },
  Other:   { icon: Headphones, accent: "#64748b", label: "Otro"          },
};

function getDevice(platformName) {
  const key = Object.keys(DEVICE_MAP).find(k => platformName.includes(k)) ?? "Other";
  return DEVICE_MAP[key];
}

function ArtistGrid({ artists, color }) {
  const maxH = artists[0].h;
  const rankColors = ["text-yellow-400", "text-zinc-400", "text-orange-600"];
  return (
    <div className="space-y-1.5">
      {artists.slice(0, 10).map((a, i) => {
        const pct = (a.h / maxH) * 100;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            whileHover={{ x: 3, transition: { duration: 0.15 } }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-200 cursor-default"
          >
            <span className={cn("text-[12px] font-bold w-5 text-center shrink-0", rankColors[i] || "text-white/20")}>
              {i + 1}
            </span>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-1 ring-white/[0.12]">
              {a.img ? (
                <img src={a.img} alt={a.n} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: color + "25" }}>
                  <Music2 size={14} style={{ color, opacity: 0.5 }} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white/90 truncate">{a.n}</div>
              <div className="text-[11px] text-white/35">{a.p.toLocaleString()} plays</div>
            </div>
            <div className="w-16 shrink-0">
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: i * 0.05 + 0.3, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
              <div className="text-[10px] text-white/30 mt-0.5 text-right font-mono">{a.h.toFixed(1)}h</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function PlatformList({ platforms, color }) {
  const max = platforms[0].pct;
  return (
    <div className="space-y-4">
      {platforms.map((p, i) => {
        const { icon: Icon, accent } = getDevice(p.n);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: accent + "20", color: accent }}
            >
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[12px] font-semibold text-white/70 truncate">
                  {p.n.split(" /")[0]}
                </span>
                <span className="text-[12px] font-black tabular-nums ml-3 shrink-0" style={{ color }}>
                  {p.pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(p.pct / max) * 100}%` }}
                  transition={{ delay: i * 0.07 + 0.25, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}, ${accent})` }}
                />
              </div>
              <div className="text-[10px] text-white/25 mt-0.5">
                {p.h.toFixed(0)} horas totales
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
      <span className="text-[12px] text-white/40">{label}</span>
      <span className="text-[12px] font-semibold text-white/80">{value}</span>
    </div>
  );
}

function ChartCard({ title, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

export function PersonSection({ person }) {
  const {
    id, name, color, colorAlpha, colorMuted, archetype, tagline, period,
    totals, sessions, completionPct, concentration, peaks,
    monthly, hourlyHours, hourlySkip, heatmap, topArtists, topTracks,
    platforms, insights,
  } = person;

  const annotations = ANNOTATIONS[id] ?? [];

  const kpis = [
    { label: "Horas Totales",    value: totals.hours,       suffix: "h", icon: <Clock size={16} />,        sub: `${totals.days.toFixed(0)} días continuos`,         decimals: 0 },
    { label: "Días Activos",    value: totals.activeDays,               icon: <CalendarDays size={16} />, sub: `${totals.avgPerDay.toFixed(2)} h/día promedio`,     decimals: 0 },
    { label: "Artistas Únicos", value: totals.uniqueArtists,            icon: <Mic2 size={16} />,         sub: `${totals.uniqueTracks.toLocaleString()} tracks`,    decimals: 0 },
    { label: "Skip Rate",       value: totals.skipRate,    suffix: "%", icon: <SkipForward size={16} />,  sub: "Canciones saltadas",                                decimals: 1 },
    { label: "Sesiones",        value: sessions.count,                  icon: <Play size={16} />,         sub: `${sessions.avgMin.toFixed(0)} min promedio`,        decimals: 0 },
    { label: "Año Pico",        value: peaks.peakYear,                  icon: <Trophy size={16} />,       sub: `${peaks.peakYearH.toFixed(0)} horas ese año`,       decimals: 0 },
  ];

  const completionData = [
    { name: "Skip <30s", value: completionPct[0] },
    { name: "Completa",  value: completionPct[1] },
    { name: "Parcial",   value: completionPct[2] },
  ];
  const completionColors = [color + "44", color, color + "99"];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden p-8 border border-white/[0.06]"
        style={{ background: `linear-gradient(135deg, ${colorAlpha} 0%, rgba(0,0,0,0) 60%)` }}
      >
        {/* Blurred top-artist backdrop */}
        {topArtists[0]?.img && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${topArtists[0].img})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              opacity: 0.09,
              filter: "blur(48px)",
              transform: "scale(1.1)",
            }}
          />
        )}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 0% 50%, ${color}30 0%, transparent 60%)` }} />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          {/* Artist photo collage 3×2 */}
          <div className="grid grid-cols-3 gap-0.5 w-24 h-24 rounded-2xl overflow-hidden shrink-0 ring-1 ring-white/[0.12]">
            {topArtists.slice(0, 6).map((a, i) => (
              <div key={i} className="overflow-hidden bg-white/[0.04]">
                {a.img ? (
                  <img src={a.img} alt={a.n} className="w-full h-full object-cover" loading="eager" />
                ) : (
                  <div className="w-full h-full" style={{ background: colorMuted }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-bold uppercase tracking-[3px] mb-1" style={{ color }}>{archetype}</div>
            <h2 className="text-3xl font-bold text-white mb-1">{name}</h2>
            <p className="text-[14px] text-white/50 mb-3">{tagline}</p>
            <div className="flex flex-wrap gap-3">
              <span className="text-[11px] px-3 py-1 rounded-full border"
                style={{ borderColor: color + "40", color, background: color + "15" }}>{period}</span>
              <span className="text-[11px] px-3 py-1 rounded-full border border-white/10 text-white/40">
                Pico: {peaks.peakMonth}
              </span>
              <span className="text-[11px] px-3 py-1 rounded-full border border-white/10 text-white/40">
                {peaks.peakDay} · {peaks.peakHour}:00
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-5xl font-black" style={{ color }}>
              {totals.hours.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[13px] text-white/40 uppercase tracking-widest mt-1">horas totales</div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <SectionLabel icon={<BarChart2 size={14} />} color={color}>Métricas Principales</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k, i) => <KPICard key={i} {...k} color={color} delay={i * 0.07} />)}
      </div>

      {/* Timeline con anotaciones */}
      <SectionLabel icon={<TrendingUp size={14} />} color={color}>Evolución Temporal</SectionLabel>
      <ChartCard title={`Horas por Mes — ${period}`}>
        <TimelineChart data={monthly} color={color} colorAlpha={colorAlpha} annotations={annotations} />
        <div className="flex gap-4 mt-3 pt-3 border-t border-white/[0.04]">
          {annotations.map((ann, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-3 h-px" style={{ borderTop: `2px dashed ${color}60` }} />
              <span className="text-[10px] text-white/30">{ann.label} ({ann.month})</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Horario */}
      <SectionLabel icon={<Clock size={14} />} color={color}>Patrones Horarios</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Horas Escuchadas por Hora del Día" delay={0.05}>
          <HourlyChart data={hourlyHours} color={color} />
        </ChartCard>
        <ChartCard title="Tasa de Skip por Hora" delay={0.1}>
          <SkipRateChart data={hourlySkip} color={color} />
        </ChartCard>
      </div>

      {/* Heatmap */}
      <SectionLabel icon={<Grid3X3 size={14} />} color={color}>Mapa de Calor: Día × Hora</SectionLabel>
      <ChartCard title="Intensidad de Escucha — Día de la Semana vs Hora del Día">
        <HeatmapGrid data={heatmap} color={color} />
      </ChartCard>

      {/* Top artistas + canciones */}
      <SectionLabel icon={<Music2 size={14} />} color={color}>Top Artistas y Canciones</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top 10 Artistas por Horas" delay={0.05}>
          <ArtistGrid artists={topArtists} color={color} />
        </ChartCard>
        <ChartCard title="Top 10 Canciones" delay={0.1}>
          <TopList tracks={topTracks} color={color} />
        </ChartCard>
      </div>

      {/* Dispositivos + forma de escuchar */}
      <SectionLabel icon={<Smartphone size={14} />} color={color}>Dispositivos y Hábitos</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Dispositivos Utilizados" delay={0.05}>
          <PlatformList platforms={platforms} color={color} />
        </ChartCard>
        <ChartCard title="Forma de Escuchar" delay={0.1}>
          <DonutChart data={completionData} colors={completionColors} />
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/[0.04]">
            {completionData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: completionColors[i] }} />
                <span className="text-[11px] text-white/40">{d.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Concentracion */}
      <SectionLabel icon={<Target size={14} />} color={color}>Concentración de Escucha</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Top 1 artista",   pct: concentration.top1,  desc: topArtists[0].n },
          { label: "Top 10 artistas", pct: concentration.top10, desc: topArtists.slice(0, 10).map(a => a.n.split(" ")[0]).join(", ") },
          { label: "Top 20 artistas", pct: concentration.top20, desc: "del tiempo total acumulado" },
        ].map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
          >
            <div className="text-[11px] text-white/40 uppercase tracking-widest mb-2">{item.label}</div>
            <div className="text-3xl font-black mb-1" style={{ color }}>{item.pct}%</div>
            <div className="text-[11px] text-white/30 leading-relaxed line-clamp-2">{item.desc}</div>
            <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full" style={{ background: color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <SectionLabel icon={<List size={14} />} color={color}>Datos Adicionales</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader><CardTitle>Resumen de Sesiones</CardTitle></CardHeader>
            <CardContent>
              <StatRow label="Total de sesiones"   value={sessions.count.toLocaleString("es-MX")} />
              <StatRow label="Duración promedio"   value={`${sessions.avgMin.toFixed(1)} min`} />
              <StatRow label="Duración mediana"    value={`${sessions.medianMin.toFixed(1)} min`} />
              <StatRow label="Tracks/sesión prom." value={sessions.avgTracks.toFixed(1)} />
              <StatRow label="% fin de semana"     value={`${totals.weekendShare}%`} />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle>Récords Personales</CardTitle></CardHeader>
            <CardContent>
              <StatRow label="Mes pico"            value={`${peaks.peakMonth} (${peaks.peakMonthH.toFixed(0)} h)`} />
              <StatRow label="Año pico"            value={`${peaks.peakYear} (${peaks.peakYearH.toFixed(0)} h)`} />
              <StatRow label="Hora pico del día"   value={`${peaks.peakHour}:00`} />
              <StatRow label="Día pico de semana"  value={peaks.peakDay} />
              <StatRow label="Skip rate global"   value={`${totals.skipRate}%`} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights */}
      <SectionLabel icon={<Lightbulb size={14} />} color={color}>Insights Destacados</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} color={color} delay={i * 0.08} />
        ))}
      </div>
    </div>
  );
}
