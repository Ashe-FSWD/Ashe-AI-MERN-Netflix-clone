import React from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "../../context/WatchlistContext";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./MyList.module.css";

function MyList({ onPlayMovie, onMoreInfo }) {
  const { watchlist } = useWatchlist();

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>My List</h1>

      {watchlist.length === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Your list is empty</h2>
          <p className={styles.emptyText}>
            Explore movies and TV shows to add titles to your personal watchlist.
          </p>
          <Link to="/" className={styles.browseBtn}>
            Explore Titles
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {watchlist.map((movie) => (
            <MovieCard
              key={`${movie.media_type || "movie"}-${movie.id}`}
              movie={movie}
              onPlayMovie={onPlayMovie}
              onMoreInfo={onMoreInfo}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default MyList;
