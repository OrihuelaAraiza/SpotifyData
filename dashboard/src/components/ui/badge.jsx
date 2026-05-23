import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-white/10 text-white/70 border border-white/10",
    jp: "bg-jp/15 text-jp border border-jp/20",
    ar: "bg-aranza/15 text-aranza border border-aranza/20",
    gold: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
