import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { movieInstance } from "../../utility/MovieInstance";
import requests from "../../utility/MovieRequest";
import { fallbackMovies } from "../../utility/fallbackData";
import styles from "./CategoryView.module.css";
import { useWatchlist } from "../../context/WatchlistContext";
import { getAIRecommendations } from "../../utility/recommendationEngine";

const CATEGORY_MAP = {
  popular: { title: "Popular on Netflix", url: requests.fetchNetflixOriginals },
  trending: { title: "Trending Now", url: requests.fetchTrending },
  "top-rated": { title: "Top Rated", url: requests.fetchTopRatedMovies },
  action: { title: "Action Thrillers", url: requests.fetchActionMovies },
  comedy: { title: "Comedies", url: requests.fetchComedyMovies },
  horror: { title: "Horror Movies", url: requests.fetchHorrorMovies },
  romance: { title: "Romance Movies", url: requests.fetchRomanceMovies },
  documentaries: { title: "Documentaries", url: requests.fetchDocumentaries },
  ai: { title: "✨ Top Picks For You (AI Recommended)", url: null },
};

function CategoryView({ onPlayMovie, onMoreInfo }) {
  const { categoryKey } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rating");
  const { watchlist } = useWatchlist();

  const catConfig = CATEGORY_MAP[categoryKey] || {
    title: "Movie Collection",
    url: requests.fetchTrending,
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchCategoryMovies() {
      setLoading(true);
      try {
        if (!catConfig.url) {
          const endpoints = [requests.fetchTrending, requests.fetchPopularMovies, requests.fetchPopularTV];
          const responses = await Promise.allSettled(endpoints.map((endpoint) => movieInstance.get(endpoint)));
          const catalog = responses.flatMap((result) => result.status === "fulfilled" ? (result.value.data?.results || []) : []);
          const recommendations = getAIRecommendations(catalog.length ? catalog : fallbackMovies, watchlist, 30);
          if (isMounted) setMovies(recommendations);
          return;
        }
        const response = await movieInstance.get(catConfig.url);
        const results = response.data?.results || [];
        if (isMounted) setMovies(results.length > 0 ? results : fallbackMovies);
      } catch (err) {
        if (isMounted) setMovies(fallbackMovies);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCategoryMovies();

    return () => {
      isMounted = false;
    };
  }, [categoryKey, watchlist]);

  // Sort movies dynamically
  const sortedMovies = useMemo(() => {
    const list = [...movies];
    if (sortBy === "rating") {
      return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    }
    if (sortBy === "title") {
      return list.sort((a, b) =>
        (a.title || a.name || "").localeCompare(b.title || b.name || "")
      );
    }
    return list;
  }, [movies, sortBy]);

  return (
    <main className={styles.container}>
      <div className={styles.backBtn} onClick={() => navigate(-1)} role="button">
        <ArrowLeft size={18} />
        <span>Back to Browse</span>
      </div>

      <div className={styles.headerRow}>
        <h1 className={styles.title}>{catConfig.title}</h1>

        <div className={styles.controls}>
          <label htmlFor="sort-select" style={{ fontSize: "0.85rem", color: "#8c8c8c" }}>
            Sort by:
          </label>
          <select
            id="sort-select"
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Highest Rated</option>
            <option value="title">Title (A - Z)</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {sortedMovies.map((movie) => (
          <MovieCard
            key={`${movie.media_type || "movie"}-${movie.id}`}
            movie={movie}
            onPlayMovie={onPlayMovie}
            onMoreInfo={onMoreInfo}
          />
        ))}
      </div>
    </main>
  );
}

export default CategoryView;
