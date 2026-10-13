import React from "react";
import Banner from "../../components/Banner/Banner";
import DisplayRow from "../../components/DisplayRow/DisplayRow";

function Movies({ onPlayMovie, onMoreInfo }) {
  return <main style={{ paddingTop: "20px" }}>
    <Banner mode="movies" onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} />
    <DisplayRow mode="movies" onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} />
  </main>;
}
export default Movies;
