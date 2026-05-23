import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function genMonthLabels(start, end) {
  const labels = [];
  let [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  while (sy < ey || (sy === ey && sm <= em)) {
    labels.push(`${sy}-${String(sm).padStart(2,'0')}`);
    sm++; if (sm > 12) { sm = 1; sy++; }
  }
  return labels;
}

export function mapToLabels(labels, dataObj) {
  return labels.map(m => dataObj[m] != null ? dataObj[m] : null);
}

export function interpolateColor(hex1, hex2, t) {
  const r1=parseInt(hex1.slice(1,3),16), g1=parseInt(hex1.slice(3,5),16), b1=parseInt(hex1.slice(5,7),16);
  const r2=parseInt(hex2.slice(1,3),16), g2=parseInt(hex2.slice(3,5),16), b2=parseInt(hex2.slice(5,7),16);
  const r=Math.round(r1+(r2-r1)*t), g=Math.round(g1+(g2-g1)*t), b=Math.round(b1+(b2-b1)*t);
  return `rgb(${r},${g},${b})`;
}
