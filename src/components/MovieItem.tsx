import MovieItemProps from "../types/Types";

function fmtAvg(avg?: number) {
  return typeof avg === "number" ? avg.toFixed(1) : "—";
}

function slugifyForLetterboxd(title: string) {
  return encodeURIComponent(
    title.toLowerCase().replace(/:\s/g, "-").replace(/[^a-z0-9]/g, "-")
  );
}

export default function MovieItem({
  title,
  userRating,
  average,
  hotness,
  poster,
  year,
  plot,
  genres,
  link,
}: MovieItemProps & { link?: string }) {
  const href =
    link || (title ? `https://letterboxd.com/film/${slugifyForLetterboxd(title)}/` : "#");
  const hot = Math.round(hotness ?? 0);

  return (
    <article className="card p-3 sm:p-3 grid gap-2">
      {/* Poster with hotness badge */}
      <div className="relative">
        <img
          src={poster || "/placeholder-poster.png"}
          alt={`${title} poster`}
          loading="lazy"
          className="w-3/5 aspect-[2/3] object-cover rounded-xl"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder-poster.png";
          }}
        />
        <span className="chip chip--hot absolute left-2 bottom-2 text-[10px] px-2 py-0.5">
          Hotness {hot}
        </span>
      </div>

      {/* Title / year */}
      <div className="flex items-start justify-between gap-2">
        <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2">{title}</h3>
        </a>
        <time className="text-[10px] text-[hsl(var(--muted))]">{year ?? ""}</time>
      </div>

      {/* Plot (tight, optional) */}
      {plot && (
        <p className="text-xs leading-snug text-[hsl(var(--muted))] line-clamp-2">
          {plot}
        </p>
      )}

      {/* Genres (max 3) */}
      {Array.isArray(genres) && genres.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {genres.slice(0, 3).map((g) => (
            <span key={g} className="chip px-2 py-0.5 text-[10px]">
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Ratings row */}
      <div className="text-[11px] text-[hsl(var(--muted))]">
        You: {typeof userRating === "number" ? userRating : "—"}
        <span className="mx-1">·</span>
        Avg: {fmtAvg(average)}
      </div>
    </article>
  );
}
