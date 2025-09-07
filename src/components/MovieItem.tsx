import MovieItemProps from "../types/Types";
// import clsx from "clsx"; // optional if you like class merging

function hotnessClass(h: number) {
  // h assumed 0–100; clamp just in case
  const p = Math.max(0, Math.min(100, h)) / 100;
  if (p <= 0.1) return "text-green-800";
  if (p <= 0.2) return "text-green-600";
  if (p <= 0.3) return "text-green-500";
  if (p <= 0.4) return "text-lime-500";
  if (p <= 0.5) return "text-yellow-500";
  if (p <= 0.6) return "text-amber-600";
  if (p <= 0.7) return "text-orange-600";
  if (p <= 0.8) return "text-red-500";
  if (p <= 0.9) return "text-red-600";
  return "text-red-800";
}

function fmtAvg(avg?: number) {
  return typeof avg === "number" ? avg.toFixed(1) : "—";
}

export default function MovieItem({
  title,
  userRating,
  average,
  hotness,
  poster,
  year,
  overview,
  genres,
  isDarkMode,
  link, // optional: if you pass the Letterboxd/IMDb URL, we’ll prefer it
}: MovieItemProps & { link?: string }) {
  const delta = (userRating ?? 0) - (average ?? 0);
  const hotClass = hotnessClass(hotness);

  const href =
    link ||
    // fallback to Letterboxd slug if you don’t have a link field
    `https://letterboxd.com/film/${encodeURIComponent(
      title.toLowerCase().replace(/:\s/g, "-").replace(/[^a-z0-9]/g, "-")
    )}`;

  return (
    <article
      className={`grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-4 xl:gap-6 border rounded-3xl p-4 xl:p-6 ${
        isDarkMode ? "border-darkinputborder text-white" : "border-black"
      }`}
    >
      {/* Left: poster + hotness */}
      <div className="flex xl:flex-col gap-4 xl:gap-3 items-center">
        <div className="relative w-28 xl:w-32">
          <img
            src={poster || "/placeholder-poster.png"}
            alt={`${title} poster`}
            loading="lazy"
            className="w-full aspect-2/3 object-cover rounded-2xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/placeholder-poster.png";
            }}
          />
        </div>

        <div className="flex items-baseline xl:flex-col xl:items-center gap-2 xl:gap-1">
          <span className={`font-bold text-xl xl:text-lg ${hotClass}`}>Hotness</span>
          <span className={`font-extrabold text-3xl xl:text-4xl ${hotClass}`}>
            {Math.round(hotness)}
          </span>
        </div>
      </div>

      {/* Right: content */}
      <div className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
            <h2 className="text-lg xl:text-xl font-bold">{title}</h2>
          </a>
          <time className="text-sm opacity-80 italic">{year ?? ""}</time>
        </header>

        <p className="text-sm leading-relaxed max-h-28 xl:max-h-24 overflow-y-auto pr-1">
          {overview}
        </p>

        <div className="flex flex-wrap gap-2">
          {(genres ?? []).slice(0, 3).map((g) => (
            <span key={g} className="text-xs px-3 py-1 rounded-full text-white font-semibold --fire-gradient">
              {g}
            </span>
          ))}
        </div>

        <div className="mt-1 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <div className="flex items-baseline gap-4">
            <p className="text-sm">You: {userRating ?? "—"}</p>
            <p className="text-sm">Avg: {fmtAvg(average)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
