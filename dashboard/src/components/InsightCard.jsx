import { motion } from "framer-motion";

export function InsightCard({ insight, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative h-full rounded-2xl overflow-hidden cursor-default"
      style={{ background: `linear-gradient(145deg, ${color}12 0%, ${color}05 50%, rgba(10,10,10,0.4) 100%)` }}
    >
      {/* border */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-white/[0.12] transition-colors duration-300 pointer-events-none" />

      {/* Decorative quote mark */}
      <div
        className="absolute -top-3 right-4 font-display font-bold leading-none select-none pointer-events-none"
        style={{ fontSize: "7rem", color: color, opacity: 0.12 }}
      >
        "
      </div>

      <div className="relative p-5 flex flex-col h-full">
        {/* label */}
        <div
          className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
          style={{ color: color + "cc" }}
        >
          {insight.title}
        </div>

        {/* highlight — THE statement */}
        <div
          className="font-display font-bold leading-tight mb-3"
          style={{
            fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
            background: `linear-gradient(135deg, #fff 20%, ${color} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {insight.highlight}
        </div>

        {/* body */}
        <div className="text-[12px] text-white/45 leading-relaxed flex-1">
          {insight.text}
        </div>
      </div>
    </motion.div>
  );
}
