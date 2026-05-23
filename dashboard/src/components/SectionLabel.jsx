import { motion } from "framer-motion";

export function SectionLabel({ icon, children, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3 my-8"
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[10px] font-bold tracking-[2px] uppercase text-white/25">{children}</span>
      <div className="flex-1 h-px bg-white/[0.05]" />
    </motion.div>
  );
}
