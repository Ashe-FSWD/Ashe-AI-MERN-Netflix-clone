import React, { useState, useEffect } from "react";
import { Play, Info } from "lucide-react";
import { movieInstance, BANNER_BASE } from "../../utility/MovieInstance";
import requests from "../../utility/MovieRequest";
import { fallbackBanner, fallbackMovies } from "../../utility/fallbackData";
import styles from "./Banner.module.css";

const BANNER_ENDPOINTS = {
  home: requests.fetchNetflixOriginals,
  movies: requests.fetchPopularMovies,
  tv: requests.fetchPopularTV,
  latest: requests.fetchTrending,
};

function Banner({ onPlayMovie, onMoreInfo, mode = "home" }) {
  const [movie, setMovie] = useState(fallbackBanner);

  useEffect(() => {
    let active = true;
    async function fetchBannerMovie() {
      try {
        const response = await movieInstance.get(BANNER_ENDPOINTS[mode] || BANNER_ENDPOINTS.home);
        const results = response.data?.results || [];
        const suitable = results.filter((item) => item.backdrop_path);
        const list = suitable.length ? suitable : results;
        if (active && list.length) {
          const selected = list[Math.floor(Math.random() * list.length)];
          setMovie({ ...selected, media_type: selected.media_type || (selected.first_air_date || selected.name ? "tv" : "movie") });
        }
      } catch (error) {
        console.warn("Banner request failed; showing a local fallback:", error.message);
        if (active) {
          const fallback = mode === "movies" ? fallbackMovies.find((item) => item.media_type === "movie") : mode === "tv" ? fallbackMovies.find((item) => item.media_type === "tv") : fallbackBanner;
          setMovie(fallback || fallbackBanner);
        }
      }
    }
    fetchBannerMovie();
    return () => { active = false; };
  }, [mode]);

  const truncate = (text, maxLength = 160) => !text ? "" : text.length > maxLength ? `${text.substring(0, maxLength - 1)}…` : text;
  const bgImage = movie?.backdrop_path
    ? (movie.backdrop_path.startsWith("http") || movie.backdrop_path.startsWith("/src") || movie.backdrop_path.startsWith("/assets/") || movie.backdrop_path.startsWith("data:"))
      ? movie.backdrop_path : `${BANNER_BASE}${movie.backdrop_path}`
    : fallbackBanner.backdrop_path;
  const displayTitle = movie?.title || movie?.name || movie?.original_name || "Featured Title";

  return (
    <section className={styles.banner} style={{ backgroundImage: `url("${bgImage}")` }} aria-label="Featured content banner">
      <div className={styles.bannerOverlay} />
      <div className={styles.content}>
        <div className={styles.brandBadge}><span>NETFLIX</span><span className={styles.seriesTag}>{movie?.media_type === "tv" ? "SERIES" : "FILM"}</span></div>
        <h1 className={styles.title}>{displayTitle}</h1>
        <p className={styles.description}>{truncate(movie?.overview, 180)}</p>
        <div className={styles.buttonContainer}>
          <button className={styles.playButton} onClick={() => onPlayMovie?.(movie)} aria-label={`Play trailer for ${displayTitle}`}><Play size={22} fill="currentColor" /><span>Play Trailer</span></button>
          <button className={styles.infoButton} onClick={() => onMoreInfo?.(movie)} aria-label={`More info about ${displayTitle}`}><Info size={22} /><span>More Info</span></button>
        </div>
      </div>
      <div className={styles.fadeBottom} />
    </section>
  );
}

export default Banner;
