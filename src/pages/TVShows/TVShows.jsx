import React from "react";
import Banner from "../../components/Banner/Banner";
import DisplayRow from "../../components/DisplayRow/DisplayRow";

function TVShows({ onPlayMovie, onMoreInfo }) {
  return <main style={{ paddingTop: "20px" }}>
    <Banner mode="tv" onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} />
    <DisplayRow mode="tv" onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} />
  </main>;
}
export default TVShows;
