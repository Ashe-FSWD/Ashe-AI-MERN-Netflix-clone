import React, { useEffect } from "react";
import { X, Play, Plus, Check, ThumbsUp } from "lucide-react";
import { BANNER_BASE, IMAGE_BASE } from "../../utility/MovieInstance";
import { getGenreNames } from "../../utility/genreMap";
import { useWatchlist } from "../../context/WatchlistContext";
import { useToast } from "../Toast/ToastContext";
import fallbackPoster from "../../assets/image/banner.jpeg";
import styles from "./MovieDetailModal.module.css";

/**
 * MovieDetailModal Component
 * Provides a detailed pop-up preview modal for any movie or TV series.
 */
function MovieDetailModal({ movie, onClose, onPlay }) {
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const { showToast } = useToast();

  useEffect(() => {
    // Close modal on Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Prevent background scrolling when modal is active
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!movie) return null;

  const inWatchlist = isWatchlisted(movie);

  const title =
    movie.title || movie.name || movie.original_name || movie.original_title || "Untitled";

  const releaseYear = (
    movie.release_date ||
    movie.first_air_date ||
    "2024"
  ).substring(0, 4);

  const voteScore = movie.vote_average
    ? Math.min(99, Math.max(70, Math.round(movie.vote_average * 10)))
    : 88;

  const genres = getGenreNames(movie.genre_ids || movie.genres, 5);

  const backdropSrc = movie.backdrop_path
    ? movie.backdrop_path.startsWith("http") || movie.backdrop_path.startsWith("/src") || movie.backdrop_path.startsWith("/assets/") || movie.backdrop_path.startsWith("data:")
      ? movie.backdrop_path
      : `${BANNER_BASE}${movie.backdrop_path}`
    : movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : fallbackPoster;

  const handleWatchlistClick = () => {
    toggleWatchlist(movie);
    if (inWatchlist) {
      showToast(`Removed "${title}" from My List`, "info");
    } else {
      showToast(`Added "${title}" to My List`, "success");
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-movie-title"
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close details modal"
        >
          <X size={20} />
        </button>

        {/* Modal Backdrop Banner */}
        <div
          className={styles.modalHero}
          style={{ backgroundImage: `url("${backdropSrc}")` }}
        >
          <div className={styles.modalHeroOverlay} />
          <div className={styles.heroContent}>
            <h2 id="modal-movie-title" className={styles.modalTitle}>
              {title}
            </h2>
            <div className={styles.modalActions}>
              <button
                className={styles.playBtn}
                onClick={() => onPlay && onPlay(movie)}
              >
                <Play size={20} fill="currentColor" />
                <span>Play</span>
              </button>

              <button
                className={`${styles.roundBtn} ${
                  inWatchlist ? styles.roundBtnActive : ""
                }`}
                onClick={handleWatchlistClick}
                aria-label={inWatchlist ? "Remove from My List" : "Add to My List"}
              >
                {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
              </button>

              <button
                className={styles.roundBtn}
                onClick={() => showToast(`Rated "${title}" 👍`, "success")}
                aria-label="Like"
              >
                <ThumbsUp size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Info */}
        <div className={styles.modalBody}>
          <div className={styles.leftCol}>
            <div className={styles.metaRow}>
              <span className={styles.matchScore}>{voteScore}% Match</span>
              <span className={styles.releaseYear}>{releaseYear}</span>
              <span className={styles.badge}>
                {movie.matureRating || (movie.adult ? "18+" : "U/A 16+")}
              </span>
              <span className={styles.hdBadge}>HD</span>
            </div>

            <p className={styles.overview}>
              {movie.overview ||
                "An enthralling story packed with action, drama, and unexpected twists as unforgettable characters embark on an extraordinary journey."}
            </p>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Genres:</span>
              <span className={styles.infoValue}>{genres.join(", ")}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Original Language:</span>
              <span className={styles.infoValue}>
                {(movie.original_language || "en").toUpperCase()}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Popularity:</span>
              <span className={styles.infoValue}>
                {Math.round(movie.popularity || 150)} pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailModal;
