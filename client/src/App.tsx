import './App.css'
import {useState} from 'react'
import axios from 'axios'


function App() {
  const[movies, setMovies] = useState([])
  const [username, setUsername] = useState('')
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  function getMovies() {
    setProgress(3)
    setIsLoading(true)
    axios.get(`https://cinescout.onrender.com/user/${username}`)
    .then(response => {
      setMovies(response.data);
      setProgress(100)
      setIsLoading(false)
    })
    .catch(error => {
      console.error(error);
      setProgress(0)
      setIsLoading(false)
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
    <div className='p-12 flex flex-col items-center'>
      <div className="flex">
        <input type="text" className="border border-black" placeholder='Letterboxd Username' onChange={e => setUsername(e.target.value)}/>
        <button onClick={getMovies} className="--fire-gradient rounded-lg px-4 py-2 text-white">Get Hot Takes</button>
      </div>
      <p>{progress}%</p>
      {{isLoading} && <p>It is loading</p>}
      <p>This site uses the methodology that blah blah blah. Hotness ratings are calculated by taking a user's letterboxd rating and comparing it against the average user score on The Movie Database for more accurate results</p>
      <div className="flex flex-col gap-6 p-20 overflow-auto border border-pink-500 h-[500px]">
        {/* Render each movie */}
        {movies.map((movie: { title: string, user_rating: number, average: number, votes: number, hotness: number, poster: number, year: number, overview: string, genres: Array<string> }) => (
          <div key={movie.title} className="flex border border-black rounded-3xl gap-6 p-6 h-[250px]">
            <div className="flex items-center gap-6">
              <p className={`${getHotnessColor(movie.hotness)} text-5xl font-bold underline`}>{Math.round(movie.hotness)}</p>
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
                <div className="h-[60%] overflow-y-auto flex items-center">
                  <p>{movie.overview}</p>
                </div>
                <div className="flex justify-between">
                  <div>{movie.genres.map((genre: string) => (
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
      <footer>
        Developed by Jake Kressley
      </footer>
    </div>
  );
}

export default App
