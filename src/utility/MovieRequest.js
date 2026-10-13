// TMDB API paths. Keep query parameters in the path or pass them through
// axios' `params` option; do not include API keys in these strings.
const requests = {
  fetchTrending: "/trending/all/week",
  fetchNetflixOriginals: "/discover/tv?with_networks=213",
  fetchPopularMovies: "/movie/popular",
  fetchNowPlayingMovies: "/movie/now_playing",
  fetchUpcomingMovies: "/movie/upcoming",
  fetchTopRatedMovies: "/movie/top_rated",
  fetchActionMovies: "/discover/movie?with_genres=28",
  fetchComedyMovies: "/discover/movie?with_genres=35",
  fetchHorrorMovies: "/discover/movie?with_genres=27",
  fetchRomanceMovies: "/discover/movie?with_genres=10749",
  fetchDocumentaries: "/discover/movie?with_genres=99",
  fetchPopularTV: "/tv/popular",
  fetchTopRatedTV: "/tv/top_rated",
  fetchAiringTodayTV: "/tv/airing_today",
  fetchOnTheAirTV: "/tv/on_the_air",
  searchMovies: "/search/multi",
};

export default requests;
