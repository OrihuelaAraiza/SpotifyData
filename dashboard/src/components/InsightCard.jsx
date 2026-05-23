import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function InsightCard({ insight, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
      className="group cursor-default"
    >
      <div
        className="relative h-full rounded-xl p-5 border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
        style={{ borderLeftColor: color, borderLeftWidth: 3 }}
      >
        {/* Background glow */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `linear-gradient(90deg, ${color}08 0%, transparent 100%)` }}
        />

        <div className="relative">
          <div className="text-2xl mb-3">{insight.icon}</div>
          <div className="text-[13px] font-700 text-white mb-2 font-semibold">{insight.title}</div>
          <div className="text-[12px] text-white/50 leading-relaxed mb-3">{insight.text}</div>
          <div
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: `${color}15`, color }}
          >
            <span className="w-1 h-1 rounded-full" style={{ background: color }} />
            {insight.highlight}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
