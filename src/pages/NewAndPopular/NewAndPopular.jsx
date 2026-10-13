import React from "react";
import Banner from "../../components/Banner/Banner";
import DisplayRow from "../../components/DisplayRow/DisplayRow";

function NewAndPopular({ onPlayMovie, onMoreInfo }) {
  return <main style={{ paddingTop: "20px" }}>
    <Banner mode="latest" onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} />
    <DisplayRow mode="latest" onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} />
  </main>;
}
export default NewAndPopular;
