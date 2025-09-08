type MovieItemProps = {
    title: string;
    userRating: number;
    average: number;
    hotness: number;
    link: string;
    imdbId: string;
    type: string;
    votes: number;
    directors: string[];
    writers: string[];
    stars: string[];
    originCountries: string[];
    spokenLanguages: string[];
    interests: number;
    runtimeSeconds: number;
    poster: string;
    year: number;
    plot: string;
    genres: string[];
};

export default MovieItemProps;