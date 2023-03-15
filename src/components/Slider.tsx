import {
  AnimatePresence,
  motion,
  useIsPresent,
  useScroll,
} from "framer-motion";
import { getMoviesByCategory, IGetMoviesResult } from "../api";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../Routes/utils";

const SliderBox = styled.div`
  align-items: center;
  position: relative;
  height: 30vh;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const IndexBtn = styled.button<{ direction: "left" | "right" }>`
  width: 50px;
  height: 50px;
  position: absolute;
  border: 0;
  padding: 10px;
  cursor: pointer;
  z-index: 0;
  background-color: transparent;
  ${(props) => (props.direction === "left" ? "left: 0" : "right: 0")};
  ${(props) =>
    props.direction === "left" ? "margin-left: 15px" : "margin-right: 15px"};
  top: 35%;
  content: "";
  border-top: 5px solid #000;
  border-right: 5px solid #000;
  transform: ${(props) =>
    props.direction === "left" ? "rotate(225deg)" : "rotate(45deg)"};
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)<{ top: number }>`
  position: fixed;
  top: 0px;
  width: 100%;
  height: 1600px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 999;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 4;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
  word-wrap: break-word;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: ({ isClickedLeftArrow }: { isClickedLeftArrow: boolean }) => ({
    x: isClickedLeftArrow ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: ({ isClickedLeftArrow }: { isClickedLeftArrow: boolean }) => ({
    x: isClickedLeftArrow ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    zIndex: 99,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

const Slider = ({ category }: { category: string }) => {
  const history = useHistory();
  const isPresent = useIsPresent();
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [isClickedLeftArrow, setIsClickedLeftArrow] = useState(false);
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    `/movies/${category}/:movieId`
  );
  const { scrollY } = useScroll();
  const { data } = useQuery<IGetMoviesResult>(["movies", category], () =>
    getMoviesByCategory(category)
  );

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onOverlayClick = (e: React.SyntheticEvent) => {
    history.push("/");
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setIsClickedLeftArrow(false);
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setIsClickedLeftArrow(true);
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  const onBoxClicked = (movieId: number, category: string) => {
    history.push(`/movies/${category}/${movieId}`);
  };
  return (
    <>
      <SliderBox>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={{ isClickedLeftArrow }}
        >
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={category + index}
            custom={{ isClickedLeftArrow }}
          >
            <IndexBtn direction="left" onClick={decreaseIndex} />
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={category + movie.id}
                  key={category + movie.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  onClick={() => onBoxClicked(movie.id, category)}
                  transition={{ type: "tween" }}
                  bgPhoto={
                    movie.poster_path
                      ? makeImagePath(movie.backdrop_path, "w500")
                      : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"
                  }
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
            <IndexBtn direction="right" onClick={increaseIndex} />
          </Row>
        </AnimatePresence>
      </SliderBox>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              top={scrollY.get()}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100, zIndex: 999 }}
              layoutId={category + bigMovieMatch.params.movieId}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{isPresent && clickedMovie.title}</BigTitle>
                  <BigOverview>
                    {isPresent && clickedMovie.overview}
                  </BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Slider;
