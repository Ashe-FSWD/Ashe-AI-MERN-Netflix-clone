/**
 * PRODUCTION PATTERN: Content-Based Recommendation Engine (Educational Simulation)
 *
 * In real-world production platforms like Netflix, recommendations are powered by:
 * 1. Content-Based Filtering: Recommends items similar to titles the user previously interacted with (genres, actors, directors, keywords).
 * 2. Collaborative Filtering: Recommends items based on patterns of similar users (matrix factorization, cosine similarity).
 * 3. Deep Learning Vector Embeddings: Two-Tower Neural Networks encoding user history and movie metadata into shared high-dimensional vector spaces.
 *
 * This module implements a client-side Content-Based Recommendation Algorithm
 * calculating genre affinity vectors and rating weights from the user's liked & watchlisted items.
 */

/**
 * Calculates personalized movie recommendations based on user preference vectors.
 *
 * @param {Array} catalog - The list of all available movies/shows
 * @param {Array} userInteractions - The list of movies the user has added to My List or Liked
 * @param {number} topK - Number of top recommendations to return (default: 10)
 * @returns {Array} Ranked list of recommended movies
 */
export function getAIRecommendations(catalog = [], userInteractions = [], topK = 10) {
  if (!catalog || catalog.length === 0) return [];

  // If the user hasn't interacted with anything yet, return top-rated popular titles as cold-start fallback
  if (!userInteractions || userInteractions.length === 0) {
    return [...catalog]
      .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      .slice(0, topK);
  }

  // 1. Build the User Genre Affinity Vector (Frequency weighting)
  const genreWeights = {};
  const interactedIds = new Set(userInteractions.map((item) => item.id));

  userInteractions.forEach((movie) => {
    const genres = movie.genre_ids || movie.genres || [];
    genres.forEach((genre) => {
      const genreKey = typeof genre === "object" ? genre.id || genre.name : genre;
      genreWeights[genreKey] = (genreWeights[genreKey] || 0) + 1;
    });
  });

  // 2. Score candidate items that the user hasn't seen yet
  const scoredCandidates = catalog
    .filter((candidate) => !interactedIds.has(candidate.id))
    .map((candidate) => {
      const candidateGenres = candidate.genre_ids || candidate.genres || [];
      let similarityScore = 0;

      candidateGenres.forEach((genre) => {
        const genreKey = typeof genre === "object" ? genre.id || genre.name : genre;
        if (genreWeights[genreKey]) {
          // Weight by genre frequency affinity
          similarityScore += genreWeights[genreKey] * 1.5;
        }
      });

      // Factor in global popularity/rating (Bayesian average boost)
      const ratingBoost = (candidate.vote_average || 7.0) * 0.2;
      const finalScore = similarityScore + ratingBoost;

      return {
        ...candidate,
        aiScore: Math.round(finalScore * 10) / 10,
        badge: similarityScore > 1 ? "99% Match for You" : "Recommended",
      };
    });

  // 3. Rank candidates in descending order of AI affinity score
  scoredCandidates.sort((a, b) => b.aiScore - a.aiScore);

  return scoredCandidates.length > 0
    ? scoredCandidates.slice(0, topK)
    : catalog.slice(0, topK);
}
