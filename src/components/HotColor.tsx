export function hotColor(h: number) {
  const v = Math.max(0, Math.min(100, Math.round(h)));
  if (v >= 80) return "#f0d7d7ff"; // deep red
  if (v >= 60) return "#ad4343ff"; // light red
  if (v >= 40) return "#F27405"; // orange
  if (v >= 20) return "#f59e0b"; // amber
  return "#00B021";              // green
}