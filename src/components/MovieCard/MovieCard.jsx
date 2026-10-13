import React, { useState } from "react";
import { Play, Plus, Check, ThumbsUp, ChevronDown } from "lucide-react";
import { IMAGE_BASE } from "../../utility/MovieInstance";
import { getGenreNames } from "../../utility/genreMap";
import { useWatchlist } from "../../context/WatchlistContext";
import { useToast } from "../Toast/ToastContext";
import fallbackPoster from "../../assets/image/10061.jpg";
import styles from "./MovieCard.module.css";

/**
 * MovieCard Component
 * Displays a 16:9 thumbnail and expands on hover into a rich Netflix-style
 * preview popup with media details and quick action buttons.
 */
function MovieCard({ movie, onPlayMovie, onMoreInfo }) {
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const { showToast } = useToast();
  const [imgError, setImgError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!movie) return null;

  const inWatchlist = isWatchlisted(movie);

  // Title formatting
  const title =
    movie.title || movie.name || movie.original_name || movie.original_title || "Untitled";

  // Dynamic Genres
  const genreList = getGenreNames(movie.genre_ids || movie.genres);

  // Dynamic Match Score & Ratings
  const voteScore = movie.vote_average
    ? Math.min(99, Math.max(70, Math.round(movie.vote_average * 10)))
    : 85;
  const matchPercentage = `${voteScore}% Match`;
  const matureRating = movie.matureRating || (movie.adult ? "18+" : "U/A 16+");
  const mediaType = movie.media_type === "tv" ? "TV Series" : "Movie";
  const badgeText = movie.badge || (voteScore >= 80 ? "Top 10" : "Recently added");
  const isTopTen = badgeText === "Top 10" || voteScore >= 80;

  // Resolve Image Path
  const getImageUrl = () => {
    if (imgError) return fallbackPoster;
    const path = movie.backdrop_path || movie.poster_path;
    if (!path) return fallbackPoster;
    if (path.startsWith("http") || path.startsWith("/src") || path.startsWith("/assets/") || path.startsWith("data:")) {
      return path;
    }
    return `${IMAGE_BASE}${path}`;
  };

  const imageSrc = getImageUrl();

  const handleCardClick = () => {
    if (onMoreInfo) {
      onMoreInfo(movie);
    }
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
    if (inWatchlist) {
      showToast(`Removed "${title}" from My List`, "info");
    } else {
      showToast(`Added "${title}" to My List`, "success");
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    const nextState = !isLiked;
    setIsLiked(nextState);
    if (nextState) {
      showToast(`Rated "${title}" 👍`, "success");
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick} role="button" tabIndex={0}>
      {/* Base 16:9 Thumbnail */}
      <img
        src={imageSrc}
        alt={title}
        className={styles.poster}
        onError={() => setImgError(true)}
        loading="lazy"
      />

      {/* Top 10 Indicator Badge on Base Card */}
      {isTopTen && <span className={styles.topTenBadge}>TOP 10</span>}

      {/* Fallback Title Overlay if image is dark or loading */}
      <div className={styles.posterTitleOverlay}>{title}</div>

      {/* Hover Preview Card matching Design 7 */}
      <div className={styles.hoverCard} onClick={(e) => e.stopPropagation()}>
        {/* Hover Image Container */}
        <div className={styles.hoverImageContainer}>
          <img
            src={imageSrc}
            alt={title}
            className={styles.hoverImage}
            onError={() => setImgError(true)}
          />
        </div>

        {/* Hover Content Details */}
        <div className={styles.hoverContent}>
          {/* Badge */}
          <span className={styles.badge}>{badgeText}</span>

          {/* Title */}
          <h4 className={styles.title}>{title}</h4>

          {/* Action Buttons Row */}
          <div className={styles.buttonRow}>
            {/* Play Button */}
            <button
              className={`${styles.circleBtn} ${styles.circleBtnPrimary}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onPlayMovie) onPlayMovie(movie);
              }}
              aria-label={`Play ${title}`}
            >
              <Play size={18} fill="currentColor" />
            </button>

            {/* Add to / Remove from My List */}
            <button
              className={`${styles.circleBtn} ${
                inWatchlist ? styles.circleBtnAdded : ""
              }`}
              onClick={handleWatchlistClick}
              aria-label={inWatchlist ? "Remove from My List" : "Add to My List"}
            >
              {inWatchlist ? <Check size={18} /> : <Plus size={18} />}
            </button>

            {/* Like Button */}
            <button
              className={`${styles.circleBtn} ${
                isLiked ? styles.circleBtnAdded : ""
              }`}
              onClick={handleLikeClick}
              aria-label="I like this"
            >
              <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
            </button>

            {/* More Info Chevron Button */}
            <button
              className={`${styles.circleBtn} ${styles.moreInfoBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onMoreInfo) onMoreInfo(movie);
              }}
              aria-label="More details"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Metadata Row */}
          <div className={styles.metaRow}>
            <span className={styles.matchScore}>{matchPercentage}</span>
            <span className={styles.tag}>{matureRating}</span>
            <span className={styles.categoryTag}>{mediaType}</span>
            <span className={styles.tag}>HD</span>
          </div>

          {/* Dynamic Genres */}
          <div className={styles.genres}>
            {genreList.map((genre, index) => (
              <React.Fragment key={`${genre}-${index}`}>
                <span>{genre}</span>
                {index < genreList.length - 1 && <span className={styles.dot}>•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
