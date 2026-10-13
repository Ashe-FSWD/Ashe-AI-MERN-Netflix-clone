import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import MovieCard from "../MovieCard/MovieCard";

// Import Swiper core and module styles
import "swiper/css";
import "swiper/css/navigation";

import styles from "./SlideShow.module.css";

/**
 * SlideShow Component
 * Renders a responsive horizontal movie row carousel using Swiper.js
 * with hover-triggered navigation arrows, category expansion, and AI explanation triggers.
 */
function SlideShow({
  title,
  categoryKey,
  movies = [],
  onPlayMovie,
  onMoreInfo,
  isAI = false,
  onOpenAIExplanation,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  // If no movies to show, skip rendering
  if (!movies || movies.length === 0) {
    return null;
  }

  const handleExploreAll = () => {
    if (categoryKey) {
      navigate(`/category/${categoryKey}`);
    } else {
      navigate(`/category/trending`);
    }
  };

  return (
    <section className={styles.rowContainer} aria-label={`${title} movie collection`}>
      {/* Category Row Title with Interactive Explore All */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <h2 className={styles.title} onClick={handleExploreAll}>
          <span>{title}</span>
          <span className={styles.exploreAll}>Explore all ›</span>
        </h2>

        {/* AI Inspector Button (for AI Recommendations row) */}
        {isAI && onOpenAIExplanation && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "rgba(229, 9, 20, 0.2)",
              border: "1px solid rgba(229, 9, 20, 0.6)",
              color: "#ffffff",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={onOpenAIExplanation}
          >
            <Sparkles size={14} color="#e50914" />
            <span>How AI Works</span>
          </button>
        )}
      </div>

      {/* Slider & Navigation Wrapper */}
      <div className={styles.sliderWrapper}>
        {/* Custom Previous Button */}
        <button
          ref={prevRef}
          className={`${styles.navButton} ${styles.navPrev}`}
          aria-label="Previous Movies"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          speed={500}
          grabCursor={true}
          breakpoints={{
            320: { slidesPerView: 2.2, spaceBetween: 8 },
            480: { slidesPerView: 2.8, spaceBetween: 10 },
            768: { slidesPerView: 3.8, spaceBetween: 12 },
            1024: { slidesPerView: 4.8, spaceBetween: 14 },
            1440: { slidesPerView: 5.8, spaceBetween: 16 },
          }}
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={movie.id ? `${movie.id}-${index}` : index}>
              <MovieCard
                movie={movie}
                onPlayMovie={onPlayMovie}
                onMoreInfo={onMoreInfo}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Next Button */}
        <button
          ref={nextRef}
          className={`${styles.navButton} ${styles.navNext}`}
          aria-label="Next Movies"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </section>
  );
}

export default SlideShow;
