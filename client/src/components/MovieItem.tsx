import { useWindowSize } from "@uidotdev/usehooks";
import MovieItemProps from "../types/Types";

function getHotnessColor(hotness: number) {
  const percentage = hotness / 100;
  if (percentage <= 0.1) {
    return "text-green-800";
  } else if (percentage <= 0.2) {
    return "text-green-600";
  } else if (percentage <= 0.3) {
    return "text-green-400";
  } else if (percentage <= 0.4) {
    return "text-yellow-400";
  } else if (percentage <= 0.5) {
    return "text-yellow-500";
  } else if (percentage <= 0.6) {
    return "text-orange-400";
  } else if (percentage <= 0.7) {
    return "text-orange-600";
  } else if (percentage <= 0.8) {
    return "text-red-400";
  } else if (percentage <= 0.9) {
    return "text-red-600";
  } else {
    return "text-red-800";
  }
}

function formatTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/:\s/g, "-")
    .replace(/[^a-z0-9]/g, "-");
}


const MovieItem: React.FC<MovieItemProps> = ({ title, userRating, average, hotness, poster, year, overview, genres, isDarkMode }) => {
    const screenWidth = useWindowSize().width;
    return (
    <div
      key={title}
      className={`flex flex-col xl:flex-row border border-black ${
        isDarkMode && "border-darkinputborder"
      } rounded-3xl gap-3 xl:gap-6 p-4 xl:h-[216px] text-sm`}
    >
      {screenWidth && screenWidth <= 1280 && (
        <>
          <div className="flex flex-col xl:flex-row items-center w-full xl:w-auto gap-6 justify-center xl:justify-normal"></div>
          <div className="flex w-full">
            <div className="flex flex-col w-full px-2 xl:px-12 justify-between">
              <div
                className={`flex gap-3 xl:gap-0 xl:justify-between items-center ${
                  isDarkMode && "text-white"
                }`}
              >
                <a
                  href={`https://letterboxd.com/film/${formatTitle(
                    title
                  )}`}
                  target="blank"
                >
                  <h2 className="text-md xl:text-xl">
                    <b>{title}</b>
                  </h2>
                </a>
                <p>
                  <i>{year}</i>
                </p>
              </div>
              <div className="h-[60%] xl:overflow-y-auto flex items-center mb-3 --overview-text gap-6">
                <p>{overview}</p>
                <img
                  src={`${poster}`}
                  alt={`${title} poster`}
                  className="xl:block w-auto h-[144px] xl:h-full"
                />
              </div>
              <div className="flex flex-col xl:flex-row justify-between">
                <div className="flex flex-wrap gap-y-1">
                  {genres.slice(0, 3).map((genre: string) => (
                    <span
                      key={genre}
                      className="text-xs --fire-gradient rounded-full px-2 py-1 xl:px-4 xl:py-2 mx-1 text-white font-bold"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="flex gap-10 mt-2 items-center justify-between xl:items-center">
                  <div className="flex gap-3 mt-2 items-baseline xl:items-center">
                    <p className="text-sm">User Rating: {userRating}</p>
                    <p className="text-sm">
                      Average: {average.toFixed(1)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-0 ml-0 justify-center">
                    <p
                      className={`${getHotnessColor(
                        hotness
                      )} xl:mb-4 font-bold text-md xl:text-2xl`}
                    >
                      Hotness
                    </p>
                    <p
                      className={`${getHotnessColor(
                        hotness
                      )} text-3xl xl:text-5xl font-bold`}
                    >
                      {Math.round(hotness)}
                    </p>
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
              <p
                className={`${getHotnessColor(
                  hotness
                )} xl:mb-4 font-bold text-3xl xl:text-2xl`}
              >
                Hotness
              </p>
              <p
                className={`${getHotnessColor(
                  hotness
                )} text-3xl xl:text-5xl font-bold`}
              >
                {Math.round(hotness)}
              </p>
            </div>
            <img
              src={`${poster}`}
              alt={`${title} poster`}
              className="xl:block w-auto h-[100px] xl:h-full"
            />
          </div>
          <div className="flex w-full">
            <div className="flex flex-col w-full px-6 xl:px-12 justify-between">
              <div className="flex justify-between items-center">
                <a
                  href={`https://letterboxd.com/film/${formatTitle(
                    title
                  )}`}
                  target="blank"
                >
                  <h2 className="text-md xl:text-xl">
                    <b>{title}</b>
                  </h2>
                </a>
                <p>
                  <i>{year}</i>
                </p>
              </div>
              <div className="h-[60%] xl:overflow-y-auto flex items-center mb-3 --overview-text">
                <p>{overview}</p>
              </div>
              <div className="flex flex-col xl:flex-row justify-between">
                <div className="flex flex-wrap gap-y-1">
                  {genres.slice(0, 3).map((genre: string) => (
                    <span
                      key={genre}
                      className="text-xs --fire-gradient rounded-full px-2 py-1 xl:px-4 xl:py-2 mx-1 text-white font-bold"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  <p className="text-sm">User Rating: {userRating}</p>
                  <p className="text-sm">Average: {average.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieItem;
