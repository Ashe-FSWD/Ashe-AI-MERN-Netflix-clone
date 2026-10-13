import axios from "axios";

// Vite exposes VITE_* variables in browser code. This key is therefore not a
// secret; never place private AI/database credentials in frontend variables.
const API_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim();

export const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const BANNER_BASE = "https://image.tmdb.org/t/p/original/";
export const THUMB_BASE = "https://image.tmdb.org/t/p/w300";

const movieInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 12000,
  params: {
    ...(API_KEY ? { api_key: API_KEY } : {}),
    language: "en-US",
  },
});

// Components can check this to explain missing configuration to the developer.
export const isTMDBConfigured = Boolean(API_KEY);
export { movieInstance, API_KEY };
export default movieInstance;
