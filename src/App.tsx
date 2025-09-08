import "./App.css";
import { useEffect, useMemo, useState } from "react";
import MovieItem from "./components/MovieItem";
import { ClipLoader } from "react-spinners";
import RecommendationsCarousel from "./components/RecommendationsCarousel";
import MovieTile from "./components/MovieTile";

type Rec = {
  title: string; year?: number; poster?: string;
  genres?: string[]; score?: number; average?: number; votes?: number; because?: string;
};

// const API_URL = "https://reel-hot-takes-843767877817.us-east4.run.app";
const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [movies, setMovies] = useState<any[]>([]);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [username, setUsername] = useState<string>(new URLSearchParams(location.search).get("u") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [resultsShown, setResultsShown] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);
  const [movieTotal, setMovieTotal] = useState(0);
  const [sortKey, setSortKey] = useState<"hot" | "avg" | "year">("hot");

  const sortedMovies = useMemo(() => {
    const arr = [...movies];
    if (sortKey === "hot") arr.sort((a, b) => (b.hotness ?? 0) - (a.hotness ?? 0));
    else if (sortKey === "avg") arr.sort((a, b) => (b.average ?? 0) - (a.average ?? 0));
    else if (sortKey === "year") arr.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    return arr;
  }, [movies, sortKey]);

  const onSubmit = async () => {
    if (!username || isClicked) return;
    setIsLoading(true);
    setIsClicked(true);
    setIsError(null);
    setResultsShown(false);
    setDisplayCount(12);

    // shareable URL
    const qs = new URLSearchParams(location.search);
    qs.set("u", username);
    history.replaceState(null, "", `?${qs.toString()}`);

    try {
      const [ratingsRes, recsRes] = await Promise.all([
        fetch(`${API_URL}/users/${username}/ratings`),
        fetch(`${API_URL}/users/${username}/recommendations`),
      ]);
      if (!ratingsRes.ok) throw new Error("ratings fetch failed");

      const ratingsData = await ratingsRes.json();
      const recsData = recsRes.ok ? await recsRes.json() : { recommendations: [] };

      setMovies(ratingsData.movies || []);
      setMovieTotal((ratingsData.movies || []).length);
      setRecs(recsData.recommendations || []);
      setResultsShown(true);
    } catch (e) {
      console.error(e);
      setIsError("User not found or service unavailable. Please try again.");
      setResultsShown(false);
    } finally {
      setIsLoading(false);
      setIsClicked(false);
    }
  };

  useEffect(() => {
    // Auto-run if URL has ?u=
    if (username && !resultsShown && !isLoading) onSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen dark">
      {/* Header */}
      <header className="px-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-6xl pt-6">
          <h1
            className="text-3xl sm:text-5xl font-extrabold text-center
                       bg-gradient-to-r from-[#00B021] via-[#556678] to-[#F27405]
                       bg-clip-text text-transparent tracking-tight"
          >
            SCREEN SCOUT
          </h1>

          <p className="mt-1 text-center text-sm sm:text-base text-[hsl(var(--muted))]">
            Enter a{" "}
            <a className="text-[hsl(var(--primary))] font-bold" href="https://letterboxd.com/" target="_blank" rel="noreferrer">
              Letterboxd
            </a>{" "}
            username to see their hottest takes—and what they should watch next.
          </p>

          {/* Controls (compact) */}
          <div className="mx-auto max-w-5xl mt-3 card backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                className="flex-1 bg-transparent border border-[hsl(var(--border))] rounded-lg px-3 py-2 outline-none"
                placeholder="Letterboxd username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              />
              <button
                onClick={onSubmit}
                disabled={!username || isClicked}
                className={`btn-primary shrink-0 ${(!username || isClicked) ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? <span className="flex items-center gap-2"><ClipLoader size={16} color="#111" /> Fetching…</span> : "Get Hot Takes"}
              </button>

              <div className="sm:ml-auto flex items-center gap-2">
                <span className="text-xs text-[hsl(var(--muted))]">Sort</span>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                  className="bg-transparent border border-[hsl(var(--border))] rounded-lg text-sm px-3 py-2"
                >
                  <option value="hot">Hotness</option>
                  <option value="avg">Avg rating</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error */}
      {isError && (
        <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 mt-3">
          <div className="rounded-xl bg-red-50/10 text-red-300 border border-red-500/30 px-4 py-3">
            {isError}
          </div>
        </div>
      )}

      {/* Main */}
      <main className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 pt-4 pb-10 space-y-8">
        {/* Hottest Takes */}
        {resultsShown && !isError && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Hottest Takes</h2>
              <span className="text-xs text-[hsl(var(--muted))]">{movieTotal} films rated</span>
            </div>
            <div className="divider my-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {sortedMovies.slice(0, displayCount).map((movie: any, i: number) => (
                <MovieTile
                  title={movie.title}
                  userRating={movie.user_rating}
                  average={movie.average}
                  hotness={movie.hotness}
                  poster={movie.poster}
                  year={movie.year}
                  plot={movie.plot}
                  genres={movie.genres}
                  link={movie.link}
                  imdbId={movie.imdb_id}
                  type={movie.type}
                  votes={movie.votes}
                  directors={movie.directors}
                  writers={movie.writers}
                  stars={movie.stars}
                  originCountries={movie.originCountries}
                  spokenLanguages={movie.spokenLanguages}
                  interests={movie.interests}
                  runtimeSeconds={movie.runtimeSeconds}
                />
              ))}
            </div>

          </section>
        )}

        {/* Recommendations (under Hottest Takes) */}
        {resultsShown && !isError && recs?.length > 0 && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recommended for {username}</h2>
              <span className="text-xs text-[hsl(var(--muted))]">{recs.length} picks</span>
            </div>
            <div className="divider my-2" />
            <div className="card">
              <RecommendationsCarousel recs={recs} />
            </div>
          </section>
        )}

        {/* Initial state */}
        {!resultsShown && !isLoading && !isError && (
          <section className="mx-auto max-w-5xl text-center text-[hsl(var(--muted))]">
            <div className="card py-8">Search a username to get started.</div>
          </section>
        )}

        {/* Loading state (full page) */}
        {isLoading && (
          <section className="flex items-center justify-center py-12">
            <ClipLoader size={28} color="#F27405" />
          </section>
        )}
      </main>
    </div>
  );
}
