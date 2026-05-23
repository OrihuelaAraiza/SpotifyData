import { useState } from "react";
import { interpolateColor } from "../lib/utils";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function HeatmapGrid({ data, color }) {
  const [tooltip, setTooltip] = useState(null);
  const maxVal = Math.max(...data.flat());

  return (
    <div className="relative">
      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 text-[11px] font-medium text-white rounded-lg border border-white/10 pointer-events-none"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 36,
            background: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(20px)",
          }}
        >
          {DAYS[tooltip.day]} {tooltip.hour}:00 · {tooltip.val.toFixed(1)} horas
        </div>
      )}

      <div className="overflow-x-auto pb-2">
        {/* Hour labels */}
        <div className="flex ml-12 mb-1">
          {HOURS.map((h) => (
            <div
              key={h}
              className="flex-1 text-center text-[9px] text-white/20 font-medium"
              style={{ minWidth: 28 }}
            >
              {h % 6 === 0 ? `${h}h` : ""}
            </div>
          ))}
        </div>

        {/* Rows */}
        {data.map((row, di) => (
          <div key={di} className="flex items-center gap-1 mb-1">
            <div className="text-[11px] text-white/40 font-semibold w-10 text-right shrink-0 pr-2">
              {DAYS[di]}
            </div>
            {row.map((val, hi) => {
              const t = maxVal > 0 ? val / maxVal : 0;
              const bg = interpolateColor("#1a1a1a", color, t);
              return (
                <div
                  key={hi}
                  className="heatmap-cell flex-1 rounded-[3px] cursor-pointer"
                  style={{
                    minWidth: 24,
                    height: 26,
                    background: bg,
                    opacity: t < 0.05 ? 0.3 : 1,
                  }}
                  onMouseMove={(e) =>
                    setTooltip({ x: e.clientX, y: e.clientY, day: di, hour: hi, val })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </div>
        ))}

        {/* Scale legend */}
        <div className="flex items-center gap-2 mt-3 ml-12">
          <span className="text-[10px] text-white/20">Menos</span>
          <div className="flex h-2 flex-1 rounded-full overflow-hidden">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ background: interpolateColor("#1a1a1a", color, i / 19) }}
              />
            ))}
          </div>
          <span className="text-[10px] text-white/20">Más</span>
        </div>
      </div>
    </div>
  );
}
