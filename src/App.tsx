import "./App.css";
import { useEffect, useMemo, useState } from "react";
import LoadingBar from "./components/LoadingBar";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import MovieItem from "./components/MovieItem";
import { RecCard } from "./components/Rec";

type Rec = {
  title: string; year?: number; poster?: string;
  genres?: string[]; score?: number; average?: number; votes?: number; because?: string;
};

const API_URL = "https://reel-hot-takes-843767877817.us-east4.run.app";

export default function App() {
  const [movies, setMovies] = useState<any[]>([]);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [username, setUsername] = useState<string>(new URLSearchParams(location.search).get("u") || "");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [resultsShown, setResultsShown] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(10);
  const [movieTotal, setMovieTotal] = useState(0);
  const [isDarkMode, setDarkMode] = useState(false);
  const [sortKey, setSortKey] = useState<"hot" | "avg" | "year">("hot");

  const toggleDarkMode = (checked: boolean) => setDarkMode(checked);

  // Derived + safe formatting
  const sortedMovies = useMemo(() => {
    const arr = [...movies];
    if (sortKey === "hot") {
      arr.sort((a, b) => (b.hotness ?? 0) - (a.hotness ?? 0));
    } else if (sortKey === "avg") {
      arr.sort((a, b) => (b.average ?? 0) - (a.average ?? 0));
    } else if (sortKey === "year") {
      arr.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    }
    return arr;
  }, [movies, sortKey]);

  // Handle Enter key
  const onSubmit = async () => {
    if (!username || isClicked) return;
    setIsLoading(true);
    setIsClicked(true);
    setIsError(null);
    setResultsShown(false);
    setDisplayCount(10);

    // shareable URL
    const qs = new URLSearchParams(location.search);
    qs.set("u", username);
    history.replaceState(null, "", `?${qs.toString()}`);

    // smooth fake progress until we finish
    const id = setInterval(() => setProgress((p) => (p < 85 ? p + 1 : p)), 180);

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
    } catch (e: any) {
      console.error(e);
      setIsError("User not found or service unavailable. Please try again.");
      setResultsShown(false);
    } finally {
      clearInterval(id);
      setProgress(0);
      setIsLoading(false);
      setIsClicked(false);
    }
  };

  useEffect(() => {
    // Auto-run if URL has ?u=
    if (username && !resultsShown && !isLoading) {
      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-darkbackground text-darkcolor" : "bg-white text-black"}`}>
      {/* Header / Hero */}
      <header className="relative pt-10 px-4 xl:pt-10 xl:px-40 flex flex-col items-center">
        <h1 className="text-4xl xl:text-6xl font-bold --font-gradient select-none">Reel Hot Takes</h1>
        <div className="absolute top-6 right-6 xl:right-20">
          <DarkModeSwitch
            checked={isDarkMode}
            onChange={toggleDarkMode}
            size={36}
            sunColor="#f7c923"
            moonColor="#f7c923"
          />
        </div>
        <p className="text-sm xl:text-lg mt-4 text-center px-6 xl:px-0">
          Enter a <a href="https://letterboxd.com/" target="_blank" rel="noopener noreferrer" className="text-red-500 font-bold">Letterboxd</a> username to see their hottest takes—and what they should watch next.
        </p>

        {/* Search / Controls (sticky on desktop) */}
        <div className="w-full xl:max-w-5xl mt-6 sticky xl:top-0 z-10">
          <div className={`rounded-2xl border ${isDarkMode ? "border-darkinputborder bg-[rgba(10,10,10,0.7)]" : "border-gray-200 bg-white/70"} backdrop-blur p-3`}>
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  className={`w-full border rounded-lg px-3 py-2 outline-none ${isDarkMode ? "border-darkinputborder bg-transparent" : "border-gray-300"}`}
                  placeholder="Letterboxd username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                />
                <button
                  onClick={onSubmit}
                  disabled={!username || isClicked}
                  className={`rounded-lg px-4 py-2 text-white font-bold ${isClicked ? "opacity-60 cursor-not-allowed" : ""} --fire-gradient`}
                >
                  {isClicked ? "Fetching…" : "Get Hot Takes"}
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs opacity-70">Sort</label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                  className={`text-sm px-3 py-2 rounded-lg ${isDarkMode ? "bg-transparent border border-darkinputborder" : "bg-white border border-gray-300"}`}
                >
                  <option value="hot">Hotness</option>
                  <option value="avg">Avg rating</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>
            {isLoading && (
              <div className="mt-3">
                <LoadingBar progress={progress} />
              </div>
            )}
          </div>
        </div>

        {/* Methodology note */}
        <p className="pt-4 pb-2 text-xs xl:text-sm text-center xl:px-40 opacity-80">
          Hotness compares a user’s rating to the global average on TMDB, lightly weighted by popularity (more votes = stronger signal).
        </p>
        <p className="text-xs opacity-70">
          <strong className="text-red-500">Note</strong>: the first request may take longer to warm caches.
        </p>
      </header>

      {/* Error banner */}
      {isError && (
        <div className="mx-4 xl:mx-40 mt-4 rounded-xl bg-red-50 text-red-800 border border-red-200 px-4 py-3">
          {isError}
        </div>
      )}

      {/* Results */}
      {resultsShown && !isError && (
        <main className="px-4 xl:px-40 pt-6 pb-16 space-y-10">
          {/* Recommendations */}
          {recs?.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-3">
                <h2 className="text-xl font-semibold">Recommended for {username}</h2>
                <span className="text-xs opacity-70">{recs.length} picks</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recs.map((r, idx) => (
                  <RecCard key={`${r.title}-${idx}`} r={r as any} />
                ))}
              </div>
            </section>
          )}

          {/* Hottest Takes */}
          <section>
            <div className="flex items-end justify-between mb-3">
              <h2 className="text-xl font-semibold">Hottest Takes</h2>
              <span className="text-xs opacity-70">{movieTotal} films rated</span>
            </div>

            <div className={`flex flex-col gap-6 py-4`}>
              {sortedMovies.slice(0, displayCount).map((movie: any, i: number) => (
                <MovieItem
                  key={`${movie.title}-${i}`}
                  title={movie.title}
                  userRating={movie.user_rating}
                  average={movie.average}
                  hotness={movie.hotness}
                  poster={movie.poster}
                  year={movie.year}
                  overview={movie.overview}
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
                  isDarkMode={isDarkMode}
                />
              ))}

              {displayCount < movieTotal && (
                <div className="flex justify-center">
                  <button
                    className="text-sm --fire-gradient rounded-full px-5 py-2 text-white font-bold"
                    onClick={() => setDisplayCount((c) => c + 10)}
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      {!resultsShown && !isError && (
        <footer className="mt-12 pb-6 flex items-center justify-center gap-2">
          <span className="opacity-80">Developed by Jake</span>
          <a href="https://github.com/jakekressley/" target="_blank" rel="noopener noreferrer">
            <img src="/github-mark.png" alt="GitHub" className="w-5 h-5 opacity-80 hover:opacity-100 transition" />
          </a>
        </footer>
      )}
    </div>
  );
}
