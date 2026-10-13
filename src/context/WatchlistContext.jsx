import React, { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();
const STORAGE_KEY = "netflix_watchlist";
const itemKey = (item) => `${item?.media_type || (item?.first_air_date || item?.name ? "tv" : "movie")}:${item?.id}`;

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist)); }
    catch (error) { console.warn("Could not save watchlist to localStorage:", error); }
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    if (!movie?.id) return;
    const normalized = { ...movie, media_type: movie.media_type || (movie.first_air_date || movie.name ? "tv" : "movie") };
    setWatchlist((current) => current.some((item) => itemKey(item) === itemKey(normalized)) ? current : [normalized, ...current]);
  };

  const removeFromWatchlist = (movieOrId) => {
    setWatchlist((current) => current.filter((item) => {
      if (typeof movieOrId === "object") return itemKey(item) !== itemKey(movieOrId);
      return item.id !== movieOrId;
    }));
  };

  const isWatchlisted = (movieOrId) => {
    if (typeof movieOrId === "object") return watchlist.some((item) => itemKey(item) === itemKey(movieOrId));
    return watchlist.some((item) => item.id === movieOrId);
  };

  const toggleWatchlist = (movie) => {
    if (!movie?.id) return;
    if (isWatchlisted(movie)) removeFromWatchlist(movie);
    else addToWatchlist(movie);
  };

  return <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist, isWatchlisted }}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error("useWatchlist must be used within a WatchlistProvider");
  return context;
}
