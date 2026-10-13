import React, { useState, useEffect, useMemo } from "react";
import SlideShow from "../SlideShow/SlideShow";
import { SkeletonRow } from "../Skeleton/SkeletonCard";
import { movieInstance, isTMDBConfigured } from "../../utility/MovieInstance";
import requests from "../../utility/MovieRequest";
import { fallbackMovies } from "../../utility/fallbackData";
import { getAIRecommendations } from "../../utility/recommendationEngine";
import { useWatchlist } from "../../context/WatchlistContext";
import styles from "./DisplayRow.module.css";

const HOME_CATEGORIES = [
  { id: "popular", title: "Popular on Netflix", url: requests.fetchNetflixOriginals, type: "tv" },
  { id: "trending", title: "Trending Now", url: requests.fetchTrending, type: "all" },
  { id: "top-rated", title: "Top Rated Movies", url: requests.fetchTopRatedMovies, type: "movie" },
  { id: "action", title: "Action Movies", url: requests.fetchActionMovies, type: "movie" },
  { id: "comedy", title: "Comedies", url: requests.fetchComedyMovies, type: "movie" },
  { id: "horror", title: "Horror Movies", url: requests.fetchHorrorMovies, type: "movie" },
  { id: "romance", title: "Romance Movies", url: requests.fetchRomanceMovies, type: "movie" },
  { id: "documentaries", title: "Documentaries", url: requests.fetchDocumentaries, type: "movie" },
];

const MOVIE_CATEGORIES = [
  { id: "popular-movies", title: "Popular Movies", url: requests.fetchPopularMovies, type: "movie" },
  { id: "now-playing", title: "Now Playing in Theaters", url: requests.fetchNowPlayingMovies, type: "movie" },
  { id: "upcoming", title: "Upcoming Movies", url: requests.fetchUpcomingMovies, type: "movie" },
  { id: "top-rated-movies", title: "Top Rated Movies", url: requests.fetchTopRatedMovies, type: "movie" },
  { id: "action", title: "Action Movies", url: requests.fetchActionMovies, type: "movie" },
  { id: "comedy", title: "Comedies", url: requests.fetchComedyMovies, type: "movie" },
  { id: "horror", title: "Horror Movies", url: requests.fetchHorrorMovies, type: "movie" },
];

const TV_CATEGORIES = [
  { id: "popular-tv", title: "Popular TV Shows", url: requests.fetchPopularTV, type: "tv" },
  { id: "netflix-originals", title: "Netflix Originals", url: requests.fetchNetflixOriginals, type: "tv" },
  { id: "top-rated-tv", title: "Top Rated TV Shows", url: requests.fetchTopRatedTV, type: "tv" },
  { id: "airing-today", title: "Airing Today", url: requests.fetchAiringTodayTV, type: "tv" },
  { id: "on-the-air", title: "Currently On The Air", url: requests.fetchOnTheAirTV, type: "tv" },
];

const LATEST_CATEGORIES = [
  { id: "trending", title: "Trending This Week", url: requests.fetchTrending, type: "all" },
  { id: "upcoming", title: "Upcoming Movies", url: requests.fetchUpcomingMovies, type: "movie" },
  { id: "now-playing", title: "Recently Released Movies", url: requests.fetchNowPlayingMovies, type: "movie" },
  { id: "airing-today", title: "TV Shows Airing Today", url: requests.fetchAiringTodayTV, type: "tv" },
];

const MODE_CATEGORIES = {
  home: HOME_CATEGORIES,
  movies: MOVIE_CATEGORIES,
  tv: TV_CATEGORIES,
  latest: LATEST_CATEGORIES,
};

function normaliseMediaType(item, defaultType = "movie") {
  if (item?.media_type === "movie" || item?.media_type === "tv") return item.media_type;
  if (item?.first_air_date || item?.name || item?.original_name) return "tv";
  return defaultType;
}

function DisplayRow({ onPlayMovie, onMoreInfo, onOpenAIExplanation, mode = "home" }) {
  const { watchlist } = useWatchlist();
  const categories = MODE_CATEGORIES[mode] || HOME_CATEGORIES;
  const [movieRows, setMovieRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiWarning, setApiWarning] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchRows() {
      setLoading(true);
      const entries = await Promise.all(categories.map(async (category) => {
        try {
          const response = await movieInstance.get(category.url);
          const results = (response.data?.results || []).map((item) => ({
            ...item,
            media_type: normaliseMediaType(item, category.type === "all" ? "movie" : category.type),
          }));
          return [category.id, results.length ? results : fallbackFor(category.type)];
        } catch (error) {
          console.warn(`TMDB request failed for ${category.title}:`, error.message);
          return [category.id, fallbackFor(category.type)];
        }
      }));
      if (active) {
        setMovieRows(Object.fromEntries(entries));
        setApiWarning(!isTMDBConfigured);
        setLoading(false);
      }
    }
    fetchRows();
    return () => { active = false; };
  }, [mode]);

  function fallbackFor(type) {
    if (type === "movie") return fallbackMovies.filter((item) => item.media_type === "movie");
    if (type === "tv") return fallbackMovies.filter((item) => item.media_type === "tv");
    return fallbackMovies;
  }

  const aiRecommendations = useMemo(() => {
    const catalog = [...new Map(Object.values(movieRows).flat().map((item) => [`${item.media_type || "movie"}-${item.id}`, item])).values()];
    return getAIRecommendations(catalog.length ? catalog : fallbackMovies, watchlist, 12);
  }, [movieRows, watchlist]);

  return (
    <div className={styles.displayRowContainer}>
      {apiWarning && !loading && (
        <p role="status" style={{ margin: "0 4% 16px", color: "#f0c36d" }}>
          TMDB API key is not configured. Showing available local demo titles where possible.
        </p>
      )}
      {loading ? <><SkeletonRow /><SkeletonRow /><SkeletonRow /></> : <>
        {mode === "home" && aiRecommendations.length > 0 && (
          <SlideShow key="ai-recommendations" categoryKey="ai" title="✨ Top Picks For You (Personalized)" movies={aiRecommendations} onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} isAI onOpenAIExplanation={onOpenAIExplanation} />
        )}
        {categories.map((category) => (
          <SlideShow key={category.id} categoryKey={category.id} title={category.title} movies={movieRows[category.id] || fallbackFor(category.type)} onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} />
        ))}
      </>}
    </div>
  );
}

export default DisplayRow;
