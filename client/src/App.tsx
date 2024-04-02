import './App.css'
import {useState} from 'react'
import axios from 'axios'
import LoadingBar from './components/LoadingBar'


function App() {
  const[movies, setMovies] = useState([])
  const [username, setUsername] = useState('')
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [resultsShown, setResultsShown] = useState(false);


  function getMovies() {
    setIsLoading(true)
    setIsClicked(true)
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
      clearInterval(intervalId);
      setProgress(0)
      setIsLoading(false)
      setIsClicked(false)
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
    <div className='py-12 px-52 flex flex-col items-center h-screen'>
      <p>Enter a Letterboxd username to see that user's hottest takes!</p>
      <div className="flex flex-col">
        <div className="flex p-8 gap-4">
          <input type="text" className="border border-black px-3 rounded-lg" placeholder='Letterboxd Username' onChange={e => setUsername(e.target.value)}/>
          <button onClick={() => !isClicked && getMovies()} className="--fire-gradient rounded-lg px-4 py-2 text-white font-bold">Get Hot Takes</button>
        </div>
        <div>
          {isLoading && (
            <div>
              <LoadingBar progress={progress} />
            </div>
          )}
        </div>
      </div>
      <p className='pt-4 pb-6 px-36 text-center text-md'>Hotness ratings are calculated by taking a user's letterboxd rating and comparing it against the average user score on <a href="https://www.themoviedb.org/?language=en-US" className="text-red-500">The Movie Database</a> for more accurate results. Movies are slightly weighted by popularity, i.e. a large rating difference of a popular movie will have a higher hotness rating than the same rating difference on a lesser-known movie.</p>
      {resultsShown && (
        <div className={`flex flex-col gap-6 py-8 px-12 overflow-auto rounded-xl h-[400px] border border-gray-300`}>
          {movies.map((movie: { title: string, user_rating: number, average: number, votes: number, hotness: number, poster: number, year: number, overview: string, genres: Array<string> }) => (
            <div key={movie.title} className="flex border border-black rounded-3xl gap-6 p-6 h-[216px] text-sm">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <p className={`${getHotnessColor(movie.hotness)} mb-4 font-bold`}>Hotness</p>
                  <p className={`${getHotnessColor(movie.hotness)} text-5xl font-bold underline`}>{Math.round(movie.hotness)}</p>
                </div>
                <img src={`https://image.tmdb.org/t/p/original/${movie.poster}`} alt={`${movie.title} poster`} className="w-auto h-full"/>
              </div>
              <div className='flex w-full'>
                <div className="flex flex-col w-full px-12 justify-between">
                  <div className="flex justify-between items-center">
                    <a href={`https://letterboxd.com/film/${formatTitle(movie.title)}`}>
                      <h2 className='text-xl'><b>{movie.title}</b></h2>
                    </a>
                    <p><i>{movie.year}</i></p>
                  </div>
                  <div className="h-[60%] overflow-y-auto flex items-center mb-3 --overview-text">
                    <p>{movie.overview}</p>
                  </div>
                  <div className="flex justify-between">
                    <div>{movie.genres.slice(0,3).map((genre: string) => (
                      <span key={genre} className="text-sm --fire-gradient rounded-full px-4 py-2 mx-1 text-white font-bold">{genre}</span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <p>User Rating: {movie.user_rating}</p>
                      <p>Average: {movie.average.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <footer className="mt-8 flex items-center gap-2 absolute bottom-6">
        Developed by Jake
        <a href="https://github.com/jakekressley/Flick-Flares" target='blank'>
          <img src="/github-mark.png" alt="github logo" className="w-[24px] h-auto"/>
        </a>
      </footer>
    </div>
  );
}

export default App
