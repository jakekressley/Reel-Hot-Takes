import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import RecommendationsCarousel from "./components/RecommendationsCarousel";
import MovieTile from "./components/MovieTile";

type Rec = {
  title: string; year?: number; poster?: string;
  genres?: string[]; score?: number; average?: number; votes?: number; because?: string;
};

const API_URL = "https://reel-hot-takes-843767877817.us-east4.run.app";
//const API_URL = "http://127.0.0.1:8000";

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
  let sortKey = "hot"; // "hot" | "avg" | "year"

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
      // First fetch ratings
      const ratingsRes = await fetch(`${API_URL}/users/${username}/ratings`);
      if (!ratingsRes.ok) throw new Error("ratings fetch failed");
      const ratingsData = await ratingsRes.json();
      setMovies(ratingsData.movies || []);
      setMovieTotal((ratingsData.movies || []).length);

      // Then fetch recommendations (after ratings are set)
      const recsRes = await fetch(`${API_URL}/users/${username}/recommendations`);
      const recsData = recsRes.ok ? await recsRes.json() : { recommendations: [] };
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
    if (username && !resultsShown && !isLoading) onSubmit();
  }, []);

  return (
    <div className="min-h-screen dark bg-[#14171C]">
      <header className="relative pt-8 px-4 xl:pt-10 xl:px-40 flex flex-col items-center">
        <h1 className="text-4xl xl:text-6xl font-extrabold tracking-tight text-white">
          Screen Scout
        </h1>

        <p className="mt-3 text-sm xl:text-base text-white/80 text-center max-w-2xl">
          Drop a <a className="text-[#F27405]" href="https://letterboxd.com/" target="blank">Letterboxd</a> username to see their hottest takes—and what they should watch next.
        </p>

        <div className="w-full xl:max-w-3xl mt-5">
          <div className="rounded-2xl border border-white/15 bg-[#14171C]/70 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                placeholder="Enter Letterboxd username (e.g. itsjake77, pvandeputte)"
                className="flex-1 bg-transparent border border-white/15 rounded-lg px-3 py-2
                     text-white placeholder-white/50 outline-none"
              />

              <button
                onClick={onSubmit}
                disabled={!username || isClicked}
                className="relative inline-flex items-center justify-center
                     rounded-lg px-4 py-2 font-semibold text-white bg-[#F27405] hover:bg-[#e65c00]
                     disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Show Hot Takes"
              >
                {isClicked ? "Fetching…" : "Show Hot Takes"}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-white/60">No username? Try:</span>
              {["itsjake77", "pvandeputte", "bubblebubble15", "elijahv22", "maryhoffman"].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => { setUsername(u); onSubmit(); }}
                  className="inline-flex items-center rounded-full h-7 px-3 text-[12px]
                       bg-[#2C343F]/90 border border-[#556678]/50 text-white/90
                       hover:bg-[#2C343F] transition whitespace-nowrap"
                  aria-label={`Use sample username ${u}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-md text-white/60 text-center">
          Hotness compares the user’s rating to the global average, lightly weighted by popularity.
        </p>
      </header>

      {isError && (
        <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 mt-3">
          <div className="rounded-xl bg-red-50/10 text-red-300 border border-red-500/30 px-4 py-3">
            {isError}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 pt-4 pb-10 space-y-8">
        {/* Hottest Takes */}
        {resultsShown && !isError && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold"></h2>
              <span className="text-xs text-[hsl(var(--muted))]">{movieTotal} films rated</span>
            </div>
            <div className="divider my-2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {sortedMovies.slice(0, displayCount).map((movie: any, i: number) => (
                <MovieTile
                  key={`${movie.title}-${i}`}
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

            {displayCount < sortedMovies.length && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setDisplayCount(c => Math.min(c + 12, sortedMovies.length))}
                  className="relative inline-flex items-center justify-center
                 rounded-lg px-4 py-2 font-semibold text-white bg-[#F27405] hover:bg-[#e65c00] cursor-pointer"
                >
                  Show 12 more
                </button>
              </div>
            )}

          </section>
        )}

        {resultsShown && !isError && recs?.length > 0 && (
          <section className="mt-16 text-white text-center">
            <h2 className="text-lg font-semibold text-center">Recommended Movies for {username}</h2>
            <div className="flex items-center justify-between">
              <h1></h1>
              <span className="text-xs text-[hsl(var(--muted))]">{recs.length} picks</span>
            </div>
            <div className="divider my-2" />
            <div className="card">
              <RecommendationsCarousel recs={recs} />
            </div>
          </section>
        )}

        {!resultsShown && !isLoading && !isError && (
          <section className="mx-auto max-w-5xl text-center text-[hsl(var(--muted))]">
            <div className="card py-8">Search a username to get started.</div>
          </section>
        )}

        {isLoading && (
          <section className="flex items-center justify-center py-12">
            <ClipLoader size={28} color="#F27405" />
          </section>
        )}
      </main>
    </div>
  );
}
