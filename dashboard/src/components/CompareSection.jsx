import { motion } from "framer-motion";
import { Network, TrendingUp, CalendarDays, Table2, Zap, Music2 } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DualTimelineChart, CompareRadar, WeekdayChart, DualHourlyChart } from "./Charts";
import { JP, AR } from "../data/spotify";

function VSRow({ label, jpVal, arVal, jpColor, arColor, higher }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="grid grid-cols-3 items-center gap-4 py-3 border-b border-white/[0.04] last:border-0"
    >
      <div className="text-right">
        <span className="text-[13px] font-bold" style={{ color: higher === "jp" ? jpColor : "rgba(255,255,255,0.8)" }}>
          {jpVal}
        </span>
      </div>
      <div className="text-center text-[11px] text-white/30 uppercase tracking-wider">{label}</div>
      <div className="text-left">
        <span className="text-[13px] font-bold" style={{ color: higher === "ar" ? arColor : "rgba(255,255,255,0.8)" }}>
          {arVal}
        </span>
      </div>
    </motion.div>
  );
}

export function CompareSection() {
  const jpColor = JP.color;
  const arColor = AR.color;

  return (
    <div className="space-y-12 pb-16">
      {/* VS Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden p-8 border border-white/[0.06]"
        style={{ background: "linear-gradient(135deg, rgba(29,185,84,0.08) 0%, rgba(0,0,0,0) 50%, rgba(232,17,156,0.08) 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 w-1/3 h-full opacity-30" style={{ background: `radial-gradient(ellipse at 0% 50%, ${jpColor}30 0%, transparent 70%)` }} />
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-30" style={{ background: `radial-gradient(ellipse at 100% 50%, ${arColor}30 0%, transparent 70%)` }} />
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-right flex-1">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto md:ml-auto md:mr-0 mb-3" style={{ background: JP.colorMuted, color: jpColor }}>
              <Music2 size={32} strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{JP.short}</div>
            <div className="text-[12px] uppercase tracking-widest mb-3" style={{ color: jpColor }}>{JP.archetype}</div>
            <div className="text-4xl font-black" style={{ color: jpColor }}>
              {JP.totals.hours.toLocaleString("es-MX", { maximumFractionDigits: 0 })}h
            </div>
          </div>

          <div className="flex flex-col items-center shrink-0">
            <div
              className="text-4xl font-black px-8 py-4 rounded-2xl border"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)" }}
            >
              VS
            </div>
            <div className="text-[10px] text-white/20 uppercase tracking-widest mt-3">Comparativa</div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto md:mr-auto md:ml-0 mb-3" style={{ background: AR.colorMuted, color: arColor }}>
              <Music2 size={32} strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{AR.short}</div>
            <div className="text-[12px] uppercase tracking-widest mb-3" style={{ color: arColor }}>{AR.archetype}</div>
            <div className="text-4xl font-black" style={{ color: arColor }}>
              {AR.totals.hours.toLocaleString("es-MX", { maximumFractionDigits: 0 })}h
            </div>
          </div>
        </div>
      </motion.div>

      {/* Radar */}
      <SectionLabel icon={<Network size={14} />} color="#ffffff">Perfil de Oyente</SectionLabel>
      <Card>
        <CardHeader>
          <CardTitle>Radar de Comportamiento Musical</CardTitle>
        </CardHeader>
        <CardContent>
          <CompareRadar />
          <p className="text-[11px] text-white/25 text-center mt-4">
            Valores normalizados al 100 para comparacion directa. Dimensiones derivadas de los datos de streaming.
          </p>
        </CardContent>
      </Card>

      {/* Dual timeline — pass monthly objects directly */}
      <SectionLabel icon={<TrendingUp size={14} />} color="#ffffff">Evolucion Paralela</SectionLabel>
      <Card>
        <CardHeader>
          <CardTitle>Horas por Mes — Juan Pablo vs Aranza</CardTitle>
        </CardHeader>
        <CardContent>
          <DualTimelineChart jpData={JP.monthly} arData={AR.monthly} />
        </CardContent>
      </Card>

      {/* Weekday + Hourly */}
      <SectionLabel icon={<CalendarDays size={14} />} color="#ffffff">Patrones Comparados</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Horas por Dia de la Semana</CardTitle></CardHeader>
          <CardContent>
            <WeekdayChart jpData={JP.weekdayHours} arData={AR.weekdayHours} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Distribucion Horaria del Dia</CardTitle></CardHeader>
          <CardContent>
            <DualHourlyChart jpData={JP.hourlyHours} arData={AR.hourlyHours} />
          </CardContent>
        </Card>
      </div>

      {/* Stats table */}
      <SectionLabel icon={<Table2 size={14} />} color="#ffffff">Tabla Comparativa</SectionLabel>
      <Card>
        <CardHeader>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-right text-[13px] font-bold" style={{ color: jpColor }}>{JP.short}</div>
            <div className="text-center text-[11px] text-white/30 uppercase tracking-wider">Metrica</div>
            <div className="text-left text-[13px] font-bold" style={{ color: arColor }}>{AR.short}</div>
          </div>
        </CardHeader>
        <CardContent>
          <VSRow label="Horas totales"    jpVal={`${JP.totals.hours.toLocaleString("es-MX",{maximumFractionDigits:0})}h`}  arVal={`${AR.totals.hours.toLocaleString("es-MX",{maximumFractionDigits:0})}h`}  jpColor={jpColor} arColor={arColor} higher="ar" />
          <VSRow label="Dias activos"     jpVal={JP.totals.activeDays.toLocaleString("es-MX")}                             arVal={AR.totals.activeDays.toLocaleString("es-MX")}                             jpColor={jpColor} arColor={arColor} higher="ar" />
          <VSRow label="Promedio h/dia"   jpVal={`${JP.totals.avgPerDay.toFixed(2)}h`}                                     arVal={`${AR.totals.avgPerDay.toFixed(2)}h`}                                     jpColor={jpColor} arColor={arColor} higher="ar" />
          <VSRow label="Artistas unicos"  jpVal={JP.totals.uniqueArtists.toLocaleString("es-MX")}                          arVal={AR.totals.uniqueArtists.toLocaleString("es-MX")}                          jpColor={jpColor} arColor={arColor} higher="jp" />
          <VSRow label="Canciones unicas" jpVal={JP.totals.uniqueTracks.toLocaleString("es-MX")}                           arVal={AR.totals.uniqueTracks.toLocaleString("es-MX")}                           jpColor={jpColor} arColor={arColor} higher="ar" />
          <VSRow label="Skip rate"        jpVal={`${JP.totals.skipRate}%`}                                                 arVal={`${AR.totals.skipRate}%`}                                                 jpColor={jpColor} arColor={arColor} higher="ar" />
          <VSRow label="Sesiones totales" jpVal={JP.sessions.count.toLocaleString("es-MX")}                               arVal={AR.sessions.count.toLocaleString("es-MX")}                               jpColor={jpColor} arColor={arColor} higher="ar" />
          <VSRow label="Duracion sesion"  jpVal={`${JP.sessions.avgMin.toFixed(0)} min`}                                   arVal={`${AR.sessions.avgMin.toFixed(0)} min`}                                   jpColor={jpColor} arColor={arColor} higher="ar" />
          <VSRow label="Top artista %"    jpVal={`${JP.concentration.top1}%`}                                              arVal={`${AR.concentration.top1}%`}                                              jpColor={jpColor} arColor={arColor} higher="jp" />
          <VSRow label="Top 10 artistas%" jpVal={`${JP.concentration.top10}%`}                                             arVal={`${AR.concentration.top10}%`}                                             jpColor={jpColor} arColor={arColor} higher="jp" />
          <VSRow label="Ano pico"         jpVal={`${JP.peaks.peakYear} (${JP.peaks.peakYearH.toFixed(0)}h)`}               arVal={`${AR.peaks.peakYear} (${AR.peaks.peakYearH.toFixed(0)}h)`}               jpColor={jpColor} arColor={arColor} higher="ar" />
        </CardContent>
      </Card>

      {/* Key differences */}
      <SectionLabel icon={<Zap size={14} />} color="#ffffff">Diferencias Clave</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: "Concentracion vs Diversidad",
            text: `JP destina el ${JP.concentration.top1}% de su tiempo a solo un artista (Twenty One Pilots). Aranza distribuye mas: su top artista tiene solo ${AR.concentration.top1}%. Obsesion vs exploracion.`,
            jp: `${JP.concentration.top10}% en top 10`,
            ar: `${AR.concentration.top10}% en top 10`,
          },
          {
            title: "Escucha Maratonista",
            text: `Aranza dobla en horas totales: ${AR.totals.hours.toFixed(0)}h vs ${JP.totals.hours.toFixed(0)}h de JP. Sus sesiones son ${(AR.sessions.avgMin - JP.sessions.avgMin).toFixed(0)} min mas largas en promedio.`,
            jp: `${JP.sessions.avgMin.toFixed(0)} min/sesion`,
            ar: `${AR.sessions.avgMin.toFixed(0)} min/sesion`,
          },
          {
            title: "Ritmos Circadianos Opuestos",
            text: `JP tiene su pico a las ${JP.peaks.peakHour}:00 (tarde) con anomalias nocturnas de 1-2 AM. Aranza tiene pico a las ${AR.peaks.peakHour}:00 (tarde-noche) con patron de semana laboral diurna.`,
            jp: `Pico: ${JP.peaks.peakHour}:00`,
            ar: `Pico: ${AR.peaks.peakHour}:00`,
          },
          {
            title: "Generos Paralelos",
            text: "JP: rock alternativo e indie (Twenty One Pilots, The 1975, The Killers). Aranza: pop latino y pop global (Morat, Bieber, Bad Bunny). Universos musicales que rara vez se cruzan.",
            jp: "Rock alternativo",
            ar: "Pop latino & global",
          },
          {
            title: "Relacion con el Skip",
            text: `JP salta ${(JP.totals.skipRate - AR.totals.skipRate).toFixed(1)}pp mas que Aranza. Su skip es contextual: se dispara al ${Math.max(...JP.hourlySkip).toFixed(0)}% en horas laborales. Aranza es consistentemente mas comprometida.`,
            jp: `${JP.totals.skipRate}% skip rate`,
            ar: `${AR.totals.skipRate}% skip rate`,
          },
          {
            title: "Plataformas Similares",
            text: `Ambos escuchan principalmente desde iPhone (87%+). La diferencia: Aranza usa iPad el 12.2% del tiempo vs 4.2% de JP, indicando mas escucha sedentaria para ella.`,
            jp: `${JP.platforms[0].pct}% iPhone`,
            ar: `${AR.platforms[0].pct}% iPhone`,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 cursor-default"
          >
            <div className="text-[13px] font-semibold text-white/90 mb-2">{item.title}</div>
            <div className="text-[12px] text-white/50 leading-relaxed mb-4">{item.text}</div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider" style={{ background: `${jpColor}15`, color: jpColor }}>
                JP: {item.jp}
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider" style={{ background: `${arColor}15`, color: arColor }}>
                Aranza: {item.ar}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
