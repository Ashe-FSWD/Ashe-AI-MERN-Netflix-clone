import React from "react";
import Banner from "../../components/Banner/Banner";
import DisplayRow from "../../components/DisplayRow/DisplayRow";

function Home({ onPlayMovie, onMoreInfo, onOpenAIExplanation }) {
  return (
    <main>
      <Banner onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} />
      <DisplayRow
        onPlayMovie={onPlayMovie}
        onMoreInfo={onMoreInfo}
        onOpenAIExplanation={onOpenAIExplanation}
      />
    </main>
  );
}

export default Home;
