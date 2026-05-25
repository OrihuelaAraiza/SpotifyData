import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { Music2 } from "lucide-react";

export function TopList({ tracks, color }) {
  const maxH = tracks[0].h;

  return (
    <div className="space-y-1.5">
      {tracks.map((track, i) => {
        const pct = (track.h / maxH) * 100;
        const rankColors = ["text-yellow-400", "text-zinc-400", "text-orange-600"];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            whileHover={{ x: 3, transition: { duration: 0.15 } }}
            className="group flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-200 cursor-default"
          >
            <span className={cn("text-[12px] font-bold w-5 text-center shrink-0", rankColors[i] || "text-white/20")}>
              {i + 1}
            </span>
            {/* Album art */}
            <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 ring-1 ring-white/10">
              {track.img ? (
                <img src={track.img} alt={track.t} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: color + "20" }}>
                  <Music2 size={14} style={{ color, opacity: 0.5 }} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white/90 truncate">{track.t}</div>
              <div className="text-[11px] text-white/35 truncate">{track.a}</div>
            </div>
            {/* Mini bar */}
            <div className="w-14 shrink-0">
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: i * 0.05 + 0.3, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
              <div className="text-[10px] text-white/30 mt-0.5 text-right font-mono">{track.h.toFixed(1)}h</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
