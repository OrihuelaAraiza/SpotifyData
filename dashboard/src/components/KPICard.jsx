import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function useCountUp(target, duration = 1200, decimals = 0) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setVal(target * ease);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  const formatted = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("es-MX");
  return [ref, formatted];
}

export function KPICard({ label, value, sub, icon, color, delay = 0, decimals = 0, suffix = "" }) {
  const [ref, displayed] = useCountUp(parseFloat(value) || 0, 1200, decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-xl p-5 cursor-default border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
      style={{ background: `linear-gradient(135deg, ${color}0a 0%, rgba(10,10,10,0.6) 100%)` }}
    >
      {/* accent line top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-60"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div className="mb-3 opacity-50" style={{ color }}>
        {icon}
      </div>

      <div
        className="font-display font-bold tracking-tight leading-none tabular-nums mb-2"
        style={{
          fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)",
          background: `linear-gradient(135deg, #fff 30%, ${color} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {typeof value === "string" ? value : displayed}{suffix}
      </div>

      <div className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.12em]">{label}</div>
      {sub && <div className="text-[10px] text-white/25 mt-0.5 leading-snug">{sub}</div>}
    </motion.div>
  );
}
