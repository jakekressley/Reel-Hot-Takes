import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import LoadingBar from './components/LoadingBar'
import { useWindowSize } from "@uidotdev/usehooks";



function App() {
  const[movies, setMovies] = useState([])
  const [username, setUsername] = useState('')
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [resultsShown, setResultsShown] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const screenWidth = useWindowSize().width;

  useEffect(() => {
    if (window.innerWidth < 1280) {
      setIsSmallScreen(true)
    } else {
      setIsSmallScreen(false)
    }
  })


  function getMovies() {
    setIsLoading(true)
    setIsClicked(true)
    setIsError(false)
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => prevProgress < 80 ? prevProgress + 1 : prevProgress);
    }, 200);

    axios.get(`https://cinescout.onrender.com/user/${username}`)
    .then(response => {
      setMovies(response.data);
      clearInterval(intervalId);
      setProgress(0)
      setIsLoading(false)
      setIsClicked(false)
      setResultsShown(true)
    })
    .catch(error => {
      console.error(error);
      console.log("error caught")
      clearInterval(intervalId);
      setProgress(0)
      setIsLoading(false)
      setIsClicked(false)
      setIsError(true)
    });
  }

  function getHotnessColor(hotness: number) {
    const percentage = hotness / 100;
    if (percentage <= 0.1) {
      return 'text-green-800';
    } else if (percentage <= 0.2) {
      return 'text-green-600';
    } else if (percentage <= 0.3) {
      return 'text-green-400';
    } else if (percentage <= 0.4) {
      return 'text-yellow-400';
    } else if (percentage <= 0.5) {
      return 'text-yellow-500';
    } else if (percentage <= 0.6) {
      return 'text-orange-400';
    } else if (percentage <= 0.7) {
      return 'text-orange-600';
    } else if (percentage <= 0.8) {
      return 'text-red-400';
    } else if (percentage <= 0.9) {
      return 'text-red-600';
    } else {
      return 'text-red-800';
    }
  }

  function formatTitle(title: string) {
    return title
      .toLowerCase()
      .replace(/:\s/g, '-')
      .replace(/[^a-z0-9]/g, '-');
  }

  return (
    <div className='pt-10 px-4 xl:pt-8 xl:pb-12 xl:px-40 flex flex-col items-center h-screen'>
      <span className="text-4xl xl:text-6xl font-bold --font-gradient">Flick Flares</span>
      <p className='text-sm xl:text-lg mt-4 text-center px-12'>Enter a Letterboxd username to see that user's hottest takes!</p>
      <div className="flex flex-col">
        <div className="flex px-8 pt-8 pb-4 gap-2 xl:gap-4 flex-col xl:flex-row">
          <input type="text" className="border border-black px-3 rounded-lg py-2" placeholder='Letterboxd Username' onChange={e => setUsername(e.target.value)}/>
          <button onClick={() => !isClicked && getMovies()} className="--fire-gradient rounded-lg px-4 py-2 text-white font-bold">Get Hot Takes</button>
        </div>
        <div>
          {isLoading && (
            <div className="flex justify-center">
              <LoadingBar progress={progress} />
            </div>
          )}
        </div>
      </div>
      <p className='pt-2 pb-6 px-12 text-sm text-center xl:px-40 xl:text-center xl:text-md'>Hotness ratings are calculated by taking a user's letterboxd rating and comparing it against the average user score on <a href="https://www.themoviedb.org/?language=en-US" className="text-red-500">The Movie Database</a> for more accurate results. Movies are slightly weighted by popularity, i.e. a large rating difference of a popular movie will have a higher hotness rating than the same rating difference on a lesser-known movie.</p>
    {isError && (
      <div className="flex items-center justify-center h-full mb-10">
        <p className="text-2xl font-bold">User not found. Please enter a valid Letterboxd user.</p>
      </div>
      )}
      {resultsShown && (
        <div className={`flex flex-col gap-6 py-8 px-4 xl:px-12 xl:overflow-auto rounded-xl h-auto xl:h-[400px] 2xl:[800px] 2xl:text-4xl border border-gray-300`}>
          {movies.map((movie: { title: string, user_rating: number, average: number, votes: number, hotness: number, poster: number, year: number, overview: string, genres: Array<string> }) => (
            <div key={movie.title} className="flex flex-col xl:flex-row border border-black rounded-3xl gap-3 xl:gap-6 p-4 xl:h-[216px] text-sm">
              {screenWidth && screenWidth <= 1280 && (
                <>
                  <div className="flex flex-col xl:flex-row items-center w-full xl:w-auto gap-6 justify-center xl:justify-normal">
                  </div>
                  <div className='flex w-full'>
                  <div className="flex flex-col w-full px-2 xl:px-12 justify-between">
                    <div className="flex gap-3 xl:gap-0 xl:justify-between items-center">
                      <a href={`https://letterboxd.com/film/${formatTitle(movie.title)}`} target='blank'>
                        <h2 className='text-md xl:text-xl'><b>{movie.title}</b></h2>
                      </a>
                      <p><i>{movie.year}</i></p>
                    </div>
                    <div className="h-[60%] xl:overflow-y-auto flex items-center mb-3 --overview-text gap-6">
                      <p>{movie.overview}</p>
                      <img src={`https://image.tmdb.org/t/p/original/${movie.poster}`} alt={`${movie.title} poster`} className="xl:block w-auto h-[144px] xl:h-full"/>
                    </div>
                    <div className="flex flex-col xl:flex-row justify-between">
                      <div className="flex flex-wrap gap-y-1">{movie.genres.slice(0,3).map((genre: string) => (
                        <span key={genre} className="text-xs --fire-gradient rounded-full px-2 py-1 xl:px-4 xl:py-2 mx-1 text-white font-bold">{genre}</span>
                        ))}
                      </div>
                      <div className="flex gap-10 mt-2 items-center justify-between xl:items-center">
                        <div className="flex gap-3 mt-2 items-baseline xl:items-center">
                          <p className="text-sm">User Rating: {movie.user_rating}</p>
                          <p className="text-sm">Average: {movie.average.toFixed(1)}</p>
                        </div>
                        <div className="flex flex-col items-center gap-0 ml-0 justify-center">
                          <p className={`${getHotnessColor(movie.hotness)} xl:mb-4 font-bold text-md xl:text-2xl`}>Hotness</p>
                          <p className={`${getHotnessColor(movie.hotness)} text-3xl xl:text-5xl font-bold`}>{Math.round(movie.hotness)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </>
              )}
              {screenWidth && screenWidth > 1280 && (
                <>
                  <div className="flex flex-col xl:flex-row items-center w-full xl:w-auto gap-6 justify-center xl:justify-normal">
                    <div className="flex flex-row xl:flex-col items-baseline xl:items-center gap-4 xl:gap-0">
                      <p className={`${getHotnessColor(movie.hotness)} xl:mb-4 font-bold text-3xl xl:text-2xl`}>Hotness</p>
                      <p className={`${getHotnessColor(movie.hotness)} text-3xl xl:text-5xl font-bold`}>{Math.round(movie.hotness)}</p>
                    </div>
                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster}`} alt={`${movie.title} poster`} className="xl:block w-auto h-[100px] xl:h-full"/>
                  </div>
                  <div className='flex w-full'>
                    <div className="flex flex-col w-full px-6 xl:px-12 justify-between">
                      <div className="flex justify-between items-center">
                        <a href={`https://letterboxd.com/film/${formatTitle(movie.title)}`} target='blank'>
                          <h2 className='text-md xl:text-xl'><b>{movie.title}</b></h2>
                        </a>
                        <p><i>{movie.year}</i></p>
                      </div>
                      <div className="h-[60%] xl:overflow-y-auto flex items-center mb-3 --overview-text">
                        <p>{movie.overview}</p>
                      </div>
                      <div className="flex flex-col xl:flex-row justify-between">
                        <div className="flex flex-wrap gap-y-1">{movie.genres.slice(0,3).map((genre: string) => (
                          <span key={genre} className="text-xs --fire-gradient rounded-full px-2 py-1 xl:px-4 xl:py-2 mx-1 text-white font-bold">{genre}</span>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-2">
                          <p className="text-sm">User Rating: {movie.user_rating}</p>
                          <p className="text-sm">Average: {movie.average.toFixed(1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {/* {screenWidth}
      {isSmallScreen && (
        <div>
          small screen
        </div>
      )} */}
      <footer className="xl:mt-8 flex items-center gap-2 xl:absolute xl:bottom-4">
        Developed by Jake
        <a href="https://github.com/jakekressley/Flick-Flares" target='blank'>
          <img src="/github-mark.png" alt="github logo" className="w-[24px] h-auto"/>
        </a>
      </footer>
    </div>
  );
}

export default App
