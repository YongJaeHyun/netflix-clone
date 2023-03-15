const API_KEY = "43131f4b5d03bda1d955ad83afc76464";
const BASE_PATH = "https://api.themoviedb.org/3/";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minumum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMoviesByCategory(category: string) {
  return fetch(`${BASE_PATH}/movie/${category}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
