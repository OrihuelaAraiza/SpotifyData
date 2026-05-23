import { motion } from "framer-motion";
import {
  Clock, CalendarDays, Mic2, SkipForward, Play, Trophy,
  BarChart2, TrendingUp, Grid3X3, Music2, PieChart as PieIcon,
  Target, List, Lightbulb,
} from "lucide-react";
import { KPICard } from "./KPICard";
import { InsightCard } from "./InsightCard";
import { SectionLabel } from "./SectionLabel";
import { HeatmapGrid } from "./HeatmapGrid";
import { TopList } from "./TopList";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  TimelineChart,
  HourlyChart,
  SkipRateChart,
  ArtistsChart,
  DonutChart,
} from "./Charts";

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
      <span className="text-[12px] text-white/40">{label}</span>
      <span className="text-[12px] font-semibold text-white/80">{value}</span>
    </div>
  );
}

function PersonIcon({ id, color, colorMuted }) {
  const style = { color, background: colorMuted };
  return (
    <div className="w-24 h-24 flex items-center justify-center rounded-2xl shrink-0" style={style}>
      {id === "jp"
        ? <Music2 size={40} strokeWidth={1.5} />
        : <Music2 size={40} strokeWidth={1.5} />}
    </div>
  );
}

export function PersonSection({ person }) {
  const {
    id, name, color, colorAlpha, colorMuted, archetype, tagline, period,
    totals, sessions, completionPct, concentration, peaks,
    monthly, hourlyHours, hourlySkip, heatmap, topArtists, topTracks,
    platforms, insights,
  } = person;

  const kpis = [
    { label: "Horas Totales",   value: totals.hours,         suffix: "h", icon: <Clock size={16} />,        sub: `${totals.days.toFixed(0)} días continuos`,          decimals: 0 },
    { label: "Días Activos",    value: totals.activeDays,                   icon: <CalendarDays size={16} />, sub: `${totals.avgPerDay.toFixed(2)} h/día promedio`,      decimals: 0 },
    { label: "Artistas Únicos", value: totals.uniqueArtists,                icon: <Mic2 size={16} />,         sub: `${totals.uniqueTracks.toLocaleString()} tracks`,     decimals: 0 },
    { label: "Skip Rate",       value: totals.skipRate,      suffix: "%",  icon: <SkipForward size={16} />,  sub: "Canciones saltadas",                                 decimals: 1 },
    { label: "Sesiones",        value: sessions.count,                      icon: <Play size={16} />,         sub: `${sessions.avgMin.toFixed(0)} min promedio`,         decimals: 0 },
    { label: "Año Pico",        value: peaks.peakYear,                      icon: <Trophy size={16} />,       sub: `${peaks.peakYearH.toFixed(0)} horas ese año`,        decimals: 0 },
  ];

  const completionData = [
    { name: "Skip <30s", value: completionPct[0] },
    { name: "Completa",  value: completionPct[1] },
    { name: "Parcial",   value: completionPct[2] },
  ];
  const completionColors = [color + "55", color, color + "99"];

  const platformData    = platforms.map(p => ({ name: p.n.split(" /")[0], value: p.pct }));
  const platformColors  = [color, color + "cc", color + "99", color + "66", color + "44"];

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
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 0% 50%, ${color}30 0%, transparent 60%)` }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <PersonIcon id={id} color={color} colorMuted={colorMuted} />
          <div className="flex-1">
            <div className="text-[11px] font-bold uppercase tracking-[3px] mb-1" style={{ color }}>
              {archetype}
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">{name}</h2>
            <p className="text-[14px] text-white/50 mb-3">{tagline}</p>
            <div className="flex flex-wrap gap-3">
              <span className="text-[11px] px-3 py-1 rounded-full border" style={{ borderColor: color + "40", color, background: color + "15" }}>
                {period}
              </span>
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
        {kpis.map((k, i) => (
          <KPICard key={i} {...k} color={color} delay={i * 0.07} />
        ))}
      </div>

      {/* Timeline — pass monthly object directly so mapToLabels can key on "YYYY-MM" */}
      <SectionLabel icon={<TrendingUp size={14} />} color={color}>Evolución Temporal</SectionLabel>
      <Card>
        <CardHeader>
          <CardTitle>Horas por Mes — {period}</CardTitle>
        </CardHeader>
        <CardContent>
          <TimelineChart data={monthly} color={color} colorAlpha={colorAlpha} />
        </CardContent>
      </Card>

      {/* Hourly + Skip */}
      <SectionLabel icon={<Clock size={14} />} color={color}>Patrones Horarios</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Horas Escuchadas por Hora del Día</CardTitle></CardHeader>
          <CardContent>
            <HourlyChart data={hourlyHours} color={color} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tasa de Skip por Hora</CardTitle></CardHeader>
          <CardContent>
            <SkipRateChart data={hourlySkip} color={color} />
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <SectionLabel icon={<Grid3X3 size={14} />} color={color}>Mapa de Calor: Día x Hora</SectionLabel>
      <Card>
        <CardHeader>
          <CardTitle>Intensidad de Escucha — Día de la Semana vs Hora del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <HeatmapGrid data={heatmap} color={color} />
        </CardContent>
      </Card>

      {/* Top artists + Top tracks */}
      <SectionLabel icon={<Music2 size={14} />} color={color}>Top Artistas y Canciones</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Top 10 Artistas por Horas</CardTitle></CardHeader>
          <CardContent>
            <ArtistsChart artists={topArtists.slice(0, 10)} color={color} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top 10 Canciones</CardTitle></CardHeader>
          <CardContent>
            <TopList tracks={topTracks} color={color} />
          </CardContent>
        </Card>
      </div>

      {/* Donuts */}
      <SectionLabel icon={<PieIcon size={14} />} color={color}>Distribución</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Forma de Escuchar</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={completionData} colors={completionColors} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Plataformas Utilizadas</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={platformData.slice(0, 5)} colors={platformColors} />
          </CardContent>
        </Card>
      </div>

      {/* Concentration */}
      <SectionLabel icon={<Target size={14} />} color={color}>Concentración de Escucha</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Top 1 artista",   pct: concentration.top1,  desc: topArtists[0].n },
          { label: "Top 10 artistas", pct: concentration.top10, desc: topArtists.slice(0, 10).map(a => a.n.split(" ")[0]).join(", ") },
          { label: "Top 20 artistas", pct: concentration.top20, desc: "del tiempo total acumulado" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
          >
            <div className="text-[11px] text-white/40 uppercase tracking-widest mb-2">{item.label}</div>
            <div className="text-3xl font-black mb-1" style={{ color }}>{item.pct}%</div>
            <div className="text-[11px] text-white/30 leading-relaxed line-clamp-2">{item.desc}</div>
            <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.pct}%` }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: color }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats tables */}
      <SectionLabel icon={<List size={14} />} color={color}>Datos Adicionales</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <Card>
          <CardHeader><CardTitle>Récords Personales</CardTitle></CardHeader>
          <CardContent>
            <StatRow label="Mes pico"           value={`${peaks.peakMonth} (${peaks.peakMonthH.toFixed(0)} h)`} />
            <StatRow label="Año pico"           value={`${peaks.peakYear} (${peaks.peakYearH.toFixed(0)} h)`} />
            <StatRow label="Hora pico del día"  value={`${peaks.peakHour}:00`} />
            <StatRow label="Día pico de semana" value={peaks.peakDay} />
            <StatRow label="Skip rate global"   value={`${totals.skipRate}%`} />
          </CardContent>
        </Card>
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
