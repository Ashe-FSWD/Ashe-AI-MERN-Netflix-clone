import React, { useState, useEffect } from "react";
import { X, Play, AlertCircle } from "lucide-react";
import { movieInstance, BANNER_BASE } from "../../utility/MovieInstance";
import styles from "./VideoModal.module.css";

/**
 * PRODUCTION PATTERN: Embedded Video / Trailer Streaming Player
 *
 * In real-world production platforms, clicking "Play" triggers video playback.
 * Here, we dynamically query TMDB's video endpoint for official HD trailers
 * on YouTube and embed them with responsive, accessible controls.
 */
function VideoModal({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrailer() {
      if (!movie || !movie.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Check both movie and tv endpoints depending on media type
        const endpoint =
          movie.media_type === "tv" || movie.first_air_date
            ? `/tv/${movie.id}/videos`
            : `/movie/${movie.id}/videos`;

        const response = await movieInstance.get(endpoint);
        const results = response.data?.results || [];

        // Search for official YouTube trailer
        const officialTrailer = results.find(
          (vid) =>
            vid.site === "YouTube" &&
            (vid.type === "Trailer" || vid.type === "Teaser" || vid.type === "Clip")
        );

        if (isMounted) {
          if (officialTrailer && officialTrailer.key) {
            setTrailerKey(officialTrailer.key);
          } else if (results.length > 0 && results[0].key) {
            setTrailerKey(results[0].key);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.warn("Could not fetch official trailer:", err.message);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTrailer();

    // Close on Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      isMounted = false;
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const title = movie.title || movie.name || movie.original_name || "Featured Title";
  const bgBackdrop = movie.backdrop_path
    ? movie.backdrop_path.startsWith("http") || movie.backdrop_path.startsWith("/src") || movie.backdrop_path.startsWith("/assets/")
      ? movie.backdrop_path
      : `${BANNER_BASE}${movie.backdrop_path}`
    : null;

  return (
    <div
      className={styles.videoBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-title"
    >
      <div
        className={styles.videoContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close video player"
        >
          <X size={22} />
        </button>

        {loading ? (
          <div className={styles.fallbackPlayer}>
            <div className={styles.loadingSpinner} />
          </div>
        ) : trailerKey ? (
          /* Official YouTube HD Player */
          <iframe
            className={styles.iframePlayer}
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
            title={`Trailer for ${title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          /* No trailer available */
          <div
            className={styles.fallbackPlayer}
            style={{ backgroundImage: bgBackdrop ? `url("${bgBackdrop}")` : "none" }}
          >
            <div className={styles.fallbackOverlay}>
              <div className={styles.pulsePlay}>
                <Play size={32} fill="currentColor" />
              </div>
              <h3 id="video-title" className={styles.fallbackTitle}>
                {title}
              </h3>
              <p className={styles.fallbackNotice}>
                No official trailer is available for this title. This educational clone only plays trailers; it does not stream full licensed movies or TV episodes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoModal;
