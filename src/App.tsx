import "./App.css";
import { useState } from "react";
import axios from "axios";
import LoadingBar from "./components/LoadingBar";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import MovieItem from "./components/MovieItem";

function App() {
  const [movies, setMovies] = useState([]);
  const [username, setUsername] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [resultsShown, setResultsShown] = useState(false);
  const [isError, setIsError] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  const [movieTotal, setMovieTotal] = useState(0);
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
  };

  function getMovies() {
    setIsLoading(true);
    setIsClicked(true);
    setIsError(false);
    const intervalId = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress < 80 ? prevProgress + 1 : prevProgress
      );
    }, 200);

    axios
      .get(`https://cinescout.onrender.com/user/${username}`)
      .then((response) => {
        setMovies(response.data);
        clearInterval(intervalId);
        setProgress(0);
        setIsLoading(false);
        setIsClicked(false);
        setResultsShown(true);
        setMovieTotal(response.data.length);
      })
      .catch((error) => {
        console.error(error);
        console.log("error caught");
        clearInterval(intervalId);
        setProgress(0);
        setIsLoading(false);
        setIsClicked(false);
        setIsError(true);
      });
  }


  return (
    <div className={`h-screen ${isDarkMode && "bg-darkbackground"}`}>
      <div
        className={`pt-10 px-4 xl:pt-8 xl:pb-12 xl:px-40 flex flex-col items-center h-auto ${
          isDarkMode && "bg-darkbackground text-darkcolor"
        }`}
      >
        <span className="text-4xl xl:text-6xl font-bold --font-gradient">
          Reel Hot Takes
        </span>
        <div className="absolute top-8 right-10 xl:right-20">
          <DarkModeSwitch
            style={{ marginBottom: "2rem" }}
            checked={isDarkMode}
            onChange={toggleDarkMode}
            size={40}
            sunColor={"#f7c923"}
            moonColor={"#f7c923"}
          />
        </div>
        <p className="text-sm xl:text-lg mt-4 text-center px-12 ">
          Enter a{" "}
          <a
            href="https://letterboxd.com/"
            target="_blank"
            className="text-red-500 font-bold"
          >
            Letterboxd
          </a>{" "}
          username to see that user's hottest takes!
        </p>
        <div className="flex flex-col">
          <div className="flex px-8 pt-8 pb-4 gap-2 xl:gap-4 flex-col xl:flex-row">
            <input
              type="text"
              className={`border border-inputborder px-3 rounded-lg py-2 ${
                isDarkMode && "border-darkinputborder bg-transparent"
              }`}
              placeholder="Letterboxd Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={() => !isClicked && getMovies()}
              className="--fire-gradient rounded-lg px-4 py-2 text-white font-bold"
            >
              Get Hot Takes
            </button>
          </div>
          <div>
            {isLoading && (
              <div className="flex justify-center">
                <LoadingBar progress={progress} />
              </div>
            )}
          </div>
        </div>
        <p className="pt-2 pb-2 px-12 text-sm text-center xl:px-40 xl:text-center xl:text-md">
          Hotness ratings are calculated by taking a user's letterboxd rating
          and comparing it against the average user score on{" "}
          <a
            href="https://www.themoviedb.org/?language=en-US"
            className="text-red-500 font-bold"
          >
            The Movie Database
          </a>{" "}
          for more accurate results. Movies are slightly weighted by popularity,
          i.e. a large rating difference of a popular movie will have a higher
          hotness rating than the same rating difference on a lesser-known
          movie.
        </p>
        <p className="text-sm mb-4">
          <strong className="text-red-500">Note</strong>: the gathering process
          may take up to a few minutes if it is the first user request or the
          user has a lot of movies rated.
        </p>
        {isError && (
          <div className="flex items-center justify-center h-full mb-10">
            <p className="text-2xl font-bold">
              User not found. Please enter a valid Letterboxd user.
            </p>
          </div>
        )}
        {resultsShown && (
          <div
            className={`flex flex-col gap-6 py-8 px-4 xl:px-12 xl:overflow-auto rounded-xl h-auto xl:h-full border border-gray-300 items-center`}
          >
            {movies
              .slice(0, displayCount)
              .map(
                (movie: {
                  title: string;
                  user_rating: number;
                  average: number;
                  votes: number;
                  hotness: number;
                  poster: number;
                  year: number;
                  overview: string;
                  genres: Array<string>;
                }) => (
                  <MovieItem
                    title={movie.title}
                    userRating={movie.user_rating}
                    average={movie.average}
                    hotness={movie.hotness}
                    poster={movie.poster}
                    year={movie.year}
                    overview={movie.overview}
                    genres={movie.genres}
                    isDarkMode={isDarkMode}
                  />
                )
              )}
            {displayCount < movieTotal && (
              <button
                className="text-xs --fire-gradient rounded-full px-2 py-1 xl:px-4 xl:py-2 mx-1 text-white font-bold w-24 h-10"
                onClick={() => setDisplayCount(displayCount + 10)}
              >
                Load More
              </button>
            )}
          </div>
        )}
        {/* {screenWidth}
        {isSmallScreen && (
          <div>
            small screen
          </div>
        )} */}
        {!resultsShown && (
          <footer
            className={`xl:mt-8 flex items-center gap-2 ${
              resultsShown ? "" : "absolute bottom-4"
            }`}
          >
            Developed by Jake
            <a
              href="https://github.com/jakekressley/Flick-Flares"
              target="blank"
            >
              <img
                src="/github-mark.png"
                alt="github logo"
                className="w-[24px] h-auto"
              />
            </a>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
