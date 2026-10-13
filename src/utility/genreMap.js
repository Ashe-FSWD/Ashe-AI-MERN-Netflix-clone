/**
 * TMDB Genre ID to Name Mapping
 * Allows dynamic display of movie genres instead of static hardcoded lists.
 */
const TMDB_GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

/**
 * Helper to convert array of genre IDs or genre objects to string array
 */
export function getGenreNames(genreIdsOrObjects, maxCount = 3) {
  if (!genreIdsOrObjects || !Array.isArray(genreIdsOrObjects)) {
    return ["Action", "Drama", "Thriller"];
  }

  const names = genreIdsOrObjects
    .map((item) => {
      if (typeof item === "number") {
        return TMDB_GENRES[item] || null;
      }
      if (typeof item === "string") {
        return item;
      }
      if (item && item.name) {
        return item.name;
      }
      return null;
    })
    .filter(Boolean);

  return names.length > 0 ? names.slice(0, maxCount) : ["Action", "Drama", "Thriller"];
}

export default TMDB_GENRES;
