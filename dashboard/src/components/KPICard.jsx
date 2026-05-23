import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";

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

  const formatted = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return [ref, formatted];
}

export function KPICard({ label, value, sub, icon, color, accent, delay = 0, decimals = 0, suffix = "" }) {
  const [ref, displayed] = useCountUp(parseFloat(value) || 0, 1200, decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card
        className={cn(
          "relative overflow-hidden cursor-default transition-all duration-300 border border-white/[0.06]",
          "hover:border-white/[0.12]"
        )}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }}
        />
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="flex items-center justify-center opacity-60" style={{ color }}>
              {icon}
            </span>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          </div>
          <div
            className="text-3xl font-black tracking-tight leading-none mb-1.5 tabular-nums"
            style={{ color: accent || color || "#fff" }}
          >
            {typeof value === "string" ? value : displayed}{suffix}
          </div>
          <div className="text-[12px] font-medium text-white/60">{label}</div>
          {sub && <div className="text-[11px] text-white/30 mt-0.5">{sub}</div>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
