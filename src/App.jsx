import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { WifiOff } from "lucide-react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MovieDetailModal from "./components/Modal/MovieDetailModal";
import AIExplanationModal from "./components/Modal/AIExplanationModal";
import VideoModal from "./components/VideoPlayer/VideoModal";
import AuthModal from "./components/Auth/AuthModal";
import MovieCard from "./components/MovieCard/MovieCard";
import Home from "./pages/Home/Home";
import TVShows from "./pages/TVShows/TVShows";
import Movies from "./pages/Movies/Movies";
import NewAndPopular from "./pages/NewAndPopular/NewAndPopular";
import MyList from "./pages/MyList/MyList";
import Account from "./pages/Account/Account";
import CategoryView from "./pages/CategoryView/CategoryView";
import NotFound from "./pages/NotFound/NotFound";
import { movieInstance } from "./utility/MovieInstance";
import requests from "./utility/MovieRequest";
import { fallbackMovies } from "./utility/fallbackData";
import { useDebounce } from "./hooks/useDebounce";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [playingMovie, setPlayingMovie] = useState(null);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Network Connectivity Detection
  const isOnline = useOnlineStatus();

  // Debounced Live TMDB Search
  const debouncedSearchTerm = useDebounce(searchQuery, 400);

  useEffect(() => {
    let isMounted = true;

    async function performSearch() {
      if (!debouncedSearchTerm.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await movieInstance.get(requests.searchMovies, {
          params: { query: debouncedSearchTerm },
        });

        const results = response.data?.results || [];
        const filtered = results.filter(
          (item) =>
            (item.backdrop_path || item.poster_path) &&
            (item.media_type === "movie" || item.media_type === "tv" || !item.media_type)
        );

        if (isMounted) {
          setSearchResults(filtered.length > 0 ? filtered : fallbackSearch(debouncedSearchTerm));
        }
      } catch (error) {
        console.warn("Live TMDB search failed, using fallback:", error.message);
        if (isMounted) {
          setSearchResults(fallbackSearch(debouncedSearchTerm));
        }
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm]);

  function fallbackSearch(term) {
    const q = term.toLowerCase();
    return fallbackMovies.filter(
      (m) =>
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.overview && m.overview.toLowerCase().includes(q))
    );
  }

  return (
    <div className="app-container">
      {/* Offline Notice Banner */}
      {!isOnline && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            backgroundColor: "#e50914",
            color: "#ffffff",
            padding: "8px 16px",
            textAlign: "center",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <WifiOff size={16} />
          <span>You are currently offline. Running in offline fallback mode with local assets.</span>
        </div>
      )}

      {/* Netflix Sticky Header Navigation */}
      <Header onSearch={setSearchQuery} />

      {/* Live Search Results View (when search is active) */}
      {searchQuery.trim() ? (
        <main style={{ padding: "100px 4% 60px 4%", minHeight: "80vh" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#e5e5e5" }}>
            {isSearching ? `Searching for "${searchQuery}"...` : `Search Results for "${searchQuery}"`}
          </h2>
          {searchResults.length === 0 && !isSearching ? (
            <p style={{ color: "#8c8c8c", fontSize: "1.1rem" }}>
              No titles matched your search. Try searching for "Bridgerton", "Monarch", "Sherlock", or "Action".
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "24px 16px",
              }}
            >
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onPlayMovie={setPlayingMovie}
                  onMoreInfo={setSelectedMovie}
                />
              ))}
            </div>
          )}
        </main>
      ) : (
        /* Application Routes */
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onPlayMovie={setPlayingMovie}
                onMoreInfo={setSelectedMovie}
                onOpenAIExplanation={() => setShowAIExplanation(true)}
              />
            }
          />
          <Route
            path="/tv"
            element={
              <TVShows
                onPlayMovie={setPlayingMovie}
                onMoreInfo={setSelectedMovie}
                onOpenAIExplanation={() => setShowAIExplanation(true)}
              />
            }
          />
          <Route
            path="/movies"
            element={
              <Movies
                onPlayMovie={setPlayingMovie}
                onMoreInfo={setSelectedMovie}
                onOpenAIExplanation={() => setShowAIExplanation(true)}
              />
            }
          />
          <Route
            path="/latest"
            element={
              <NewAndPopular
                onPlayMovie={setPlayingMovie}
                onMoreInfo={setSelectedMovie}
                onOpenAIExplanation={() => setShowAIExplanation(true)}
              />
            }
          />
          <Route
            path="/my-list"
            element={
              <MyList
                onPlayMovie={setPlayingMovie}
                onMoreInfo={setSelectedMovie}
              />
            }
          />
          <Route
            path="/category/:categoryKey"
            element={
              <CategoryView
                onPlayMovie={setPlayingMovie}
                onMoreInfo={setSelectedMovie}
              />
            }
          />
          <Route path="/account" element={<Account />} />
          <Route
            path="/languages"
            element={
              <Home
                onPlayMovie={setPlayingMovie}
                onMoreInfo={setSelectedMovie}
                onOpenAIExplanation={() => setShowAIExplanation(true)}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}

      {/* Global Movie Details Pop-up Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={setPlayingMovie}
        />
      )}

      {/* Official YouTube Trailer Video Player Modal */}
      {playingMovie && (
        <VideoModal
          movie={playingMovie}
          onClose={() => setPlayingMovie(null)}
        />
      )}

      {/* AI Recommendation Inspector & Explanation Modal */}
      {showAIExplanation && (
        <AIExplanationModal
          onClose={() => setShowAIExplanation(false)}
        />
      )}

      {/* Authentication Modal (Sign In / Sign Up / OAuth) */}
      <AuthModal />

      {/* Netflix Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
