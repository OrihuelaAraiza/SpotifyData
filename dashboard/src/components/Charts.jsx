import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PolarRadiusAxis, ReferenceLine
} from "recharts";
import { genMonthLabels, mapToLabels } from "../lib/utils";

const tooltipStyle = {
  contentStyle: {
    background: "rgba(8,8,8,0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    backdropFilter: "blur(20px)",
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter",
    padding: "10px 14px",
  },
  itemStyle: { color: "#b3b3b3" },
  labelStyle: { color: "#fff", fontWeight: 700, marginBottom: 4 },
};

// ─── Timeline Chart ────────────────────────────────────────────
function AnnotationLabel({ viewBox, label, color }) {
  const { x, y } = viewBox;
  return (
    <g>
      <text x={x + 5} y={y + 16} fill={color} fontSize={9} fontFamily="Inter" fontWeight={700} opacity={0.85}>
        {label}
      </text>
    </g>
  );
}

export function TimelineChart({ data, color, colorAlpha, annotations = [] }) {
  const LABELS = genMonthLabels("2015-01", "2026-05");
  const values = mapToLabels(LABELS, data);

  const chartData = LABELS.map((m, i) => ({
    month: m,
    hours: values[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 20, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`grad-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="80%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
        <XAxis
          dataKey="month"
          tick={{ fill: "#444", fontSize: 10 }}
          tickFormatter={(v) => v.endsWith("-01") ? v.slice(0, 4) : ""}
          interval={0}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v) => [`${v ? v.toFixed(1) : "—"} horas`, "Escucha"]}
          labelFormatter={(v) => v}
        />
        {annotations.map((ann, i) => (
          <ReferenceLine
            key={i}
            x={ann.month}
            stroke={color}
            strokeDasharray="4 3"
            strokeOpacity={0.5}
            label={<AnnotationLabel label={ann.label} color={color} />}
          />
        ))}
        <Area
          type="monotone"
          dataKey="hours"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color.slice(1)})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          connectNulls={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Dual Timeline ─────────────────────────────────────────────
export function DualTimelineChart({ jpData, arData }) {
  const LABELS = genMonthLabels("2015-01", "2026-05");
  const jpVals = mapToLabels(LABELS, jpData);
  const arVals = mapToLabels(LABELS, arData);

  const chartData = LABELS.map((m, i) => ({
    month: m,
    label: m.endsWith("-01") ? m.slice(0, 4) : "",
    jp: jpVals[i],
    ar: arVals[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gradJP" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1DB954" stopOpacity={0.25} />
            <stop offset="80%" stopColor="#1DB954" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradAR" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E8119C" stopOpacity={0.25} />
            <stop offset="80%" stopColor="#E8119C" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
        <XAxis dataKey="label" tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v, name) => [`${v ? v.toFixed(1) : "—"} horas`, name === "jp" ? "Juan Pablo" : "Aranza"]}
          labelFormatter={(_, p) => p?.[0]?.payload?.month || ""}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, fontFamily: "Inter", color: "#999", paddingTop: 12 }}
          formatter={(v) => v === "jp" ? "Juan Pablo" : "Aranza"}
        />
        <Area type="monotone" dataKey="ar" stroke="#E8119C" strokeWidth={2} fill="url(#gradAR)" dot={false} activeDot={{ r: 3 }} connectNulls={false} />
        <Area type="monotone" dataKey="jp" stroke="#1DB954" strokeWidth={2} fill="url(#gradJP)" dot={false} activeDot={{ r: 3 }} connectNulls={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Hourly Bar Chart ──────────────────────────────────────────
export function HourlyChart({ data, color }) {
  const maxVal = Math.max(...data);
  const chartData = data.map((h, i) => ({
    hour: `${i}h`,
    hours: h,
    fill: `${color}${Math.round(30 + (h / maxVal) * 200).toString(16).padStart(2, "0")}`,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
        <XAxis dataKey="hour" tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v)}h`} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v) => [`${v.toFixed(1)} horas acumuladas`]}
          labelFormatter={(l) => `Hora: ${l}`}
        />
        <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Skip Rate Bar ─────────────────────────────────────────────
export function SkipRateChart({ data, color }) {
  const chartData = data.map((v, i) => ({
    hour: `${i}h`,
    rate: v,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
        <XAxis dataKey="hour" tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 55]} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v) => [`${v.toFixed(1)}% skip rate`]}
          labelFormatter={(l) => `Hora: ${l}`}
        />
        <Bar dataKey="rate" radius={[3, 3, 0, 0]}>
          {chartData.map((entry, i) => {
            const intensity = entry.rate / 55;
            const r = Math.round(180 + intensity * 75);
            const g = Math.round(60 - intensity * 40);
            return <Cell key={i} fill={`rgba(${r},${g},68,${0.4 + intensity * 0.6})`} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Top Artists ───────────────────────────────────────────────
export function ArtistsChart({ artists, color }) {
  const maxH = artists[0].h;
  const top10 = artists.slice(0, 10);
  const chartData = top10.map((a) => ({
    name: a.n.length > 18 ? a.n.slice(0, 16) + "…" : a.n,
    fullName: a.n,
    hours: a.h,
    plays: a.p,
    fill: `${color}${Math.round(80 + (a.h / maxH) * 175).toString(16).padStart(2, "0")}`,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 50, bottom: 0, left: 0 }} barCategoryGap="25%">
        <XAxis type="number" tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
        <YAxis type="category" dataKey="name" tick={{ fill: "#aaa", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v, _, { payload }) => [`${v.toFixed(1)} h · ${payload.plays.toLocaleString()} plays`, payload.fullName]}
          labelFormatter={() => ""}
        />
        <Bar dataKey="hours" radius={[0, 4, 4, 0]} label={{ position: "right", fill: "#555", fontSize: 10, formatter: (v) => `${v.toFixed(0)}h` }}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Weekday Comparison ────────────────────────────────────────
export function WeekdayChart({ jpData, arData }) {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const chartData = days.map((d, i) => ({
    day: d,
    jp: jpData[i],
    ar: arData[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
        <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v, name) => [`${v.toFixed(0)} horas`, name === "jp" ? "Juan Pablo" : "Aranza"]}
        />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "Inter", color: "#777" }} formatter={(v) => v === "jp" ? "Juan Pablo" : "Aranza"} />
        <Bar dataKey="jp" fill="rgba(29,185,84,0.7)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="ar" fill="rgba(232,17,156,0.7)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Radar Chart ───────────────────────────────────────────────
export function CompareRadar() {
  const data = [
    { subject: "Volumen", jp: 51.6, ar: 100 },
    { subject: "Diversidad", jp: 100, ar: 92.9 },
    { subject: "Engagement", jp: 72.5, ar: 84.1 },
    { subject: "Sesión Larga", jp: 75.4, ar: 100 },
    { subject: "Lealtad TOP1", jp: 100, ar: 41.6 },
    { subject: "Intensidad/Día", jp: 61.2, ar: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 11, fontFamily: "Inter" }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Juan Pablo" dataKey="jp" stroke="#1DB954" fill="#1DB954" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#1DB954", r: 3 }} />
        <Radar name="Aranza" dataKey="ar" stroke="#E8119C" fill="#E8119C" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#E8119C", r: 3 }} />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Inter", color: "#888" }} />
        <Tooltip {...tooltipStyle} formatter={(v) => [`${v.toFixed(1)} / 100`]} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ─── Donut Chart ───────────────────────────────────────────────
const RADIAN = Math.PI / 180;
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.08) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} fontFamily="Inter">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function DonutChart({ data, colors }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={70}
          dataKey="value"
          labelLine={false}
          label={CustomLabel}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          {...tooltipStyle}
          formatter={(v, name, { payload }) => {
            const total = data.reduce((s, d) => s + d.value, 0);
            return [`${((v / total) * 100).toFixed(1)}%`, payload.name];
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Dual Hourly ───────────────────────────────────────────────
export function DualHourlyChart({ jpData, arData }) {
  const chartData = jpData.map((_, i) => ({
    hour: `${i}h`,
    jp: jpData[i],
    ar: arData[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="15%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
        <XAxis dataKey="hour" tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v)}h`} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v, name) => [`${v.toFixed(1)} h`, name === "jp" ? "Juan Pablo" : "Aranza"]}
        />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "Inter", color: "#777" }} formatter={(v) => v === "jp" ? "Juan Pablo" : "Aranza"} />
        <Bar dataKey="jp" fill="rgba(29,185,84,0.65)" radius={[2, 2, 0, 0]} />
        <Bar dataKey="ar" fill="rgba(232,17,156,0.65)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
