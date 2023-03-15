import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetMoviesResult, getMoviesByCategory } from "../api";
import { makeImagePath } from "./utils";
import Slider from "../components/Slider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Sliders = styled.div`
  height: 200vh;
`;

const category = {
  now_playing: "now_playing",
  popular: "popular",
  top_rated: "top_rated",
  upcoming: "upcoming",
};

const Home = () => {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", category.now_playing],
    () => getMoviesByCategory(category.now_playing)
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            <Slider category={category.now_playing} />
            <Slider category={category.popular} />
            <Slider category={category.top_rated} />
            <Slider category={category.upcoming} />
          </Sliders>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
