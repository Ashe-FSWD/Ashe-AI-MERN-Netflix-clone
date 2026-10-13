import React, { useEffect, useMemo } from "react";
import { X, Sparkles, Cpu, BarChart3 } from "lucide-react";
import { useWatchlist } from "../../context/WatchlistContext";
import TMDB_GENRES from "../../utility/genreMap";
import styles from "./AIExplanationModal.module.css";

/**
 * AI Explanation & Inspector Modal
 * Displays real-time breakdown of user taste profile vectors and algorithm mechanics.
 */
function AIExplanationModal({ onClose }) {
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Compute live user genre affinity distribution
  const genreDistribution = useMemo(() => {
    const counts = {};
    let total = 0;

    watchlist.forEach((movie) => {
      const genres = movie.genre_ids || movie.genres || [];
      genres.forEach((g) => {
        const name = typeof g === "number" ? TMDB_GENRES[g] || "Other" : g?.name || g;
        counts[name] = (counts[name] || 0) + 1;
        total += 1;
      });
    });

    const entries = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    entries.sort((a, b) => b.count - a.count);
    return { entries: entries.slice(0, 5), total };
  }, [watchlist]);

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close AI inspector"
        >
          <X size={22} />
        </button>

        <div className={styles.header}>
          <div className={styles.badge}>AI ARCHITECTURE</div>
          <h2 className={styles.title}>How "Top Picks For You" Works</h2>
        </div>

        <p className={styles.description}>
          This feed is dynamically personalized in real time using a <b>Content-Based Vector Ranking Algorithm</b>. 
          When you bookmark titles to <i>My List</i> or click <i>Like (👍)</i>, your Taste Vector updates instantly.
        </p>

        {/* Live Taste Profile Breakdown */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <BarChart3 size={16} style={{ display: "inline", marginRight: "6px" }} />
            Your Live Taste Profile ({watchlist.length} Saved Titles)
          </div>

          {genreDistribution.entries.length === 0 ? (
            <p style={{ color: "#8c8c8c", fontSize: "0.88rem" }}>
              Add movies to <i>My List</i> to let the algorithm construct your personal taste profile!
            </p>
          ) : (
            <div className={styles.genreList}>
              {genreDistribution.entries.map((g) => (
                <div key={g.name} className={styles.genreBarRow}>
                  <span className={styles.genreLabel}>{g.name}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${Math.max(15, g.percent)}%` }}
                    />
                  </div>
                  <span className={styles.genreCount}>{g.percent}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Algorithm Mathematics */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Cpu size={16} style={{ display: "inline", marginRight: "6px" }} />
            Scoring Formula
          </div>
          <pre className={styles.codeBox}>
{`Score(Movie) = Σ(GenreAffinity * 1.5) + (VoteAverage * 0.2)
Where:
- GenreAffinity: Frequency of matching genres in your Watchlist
- VoteAverage: TMDB community quality prior`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default AIExplanationModal;
