import { useEffect, useState } from "react";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_KEY = "ff0a7ec6";

// structural component //
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("inception");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // const tempQuery = "interstellar";

  /*
  useEffect(function () {
    console.log("After initial render"); // runs second because effects are not executed until after the browser paint
  }, []);

  useEffect(function () {
    console.log("After every render"); // runs third simply because it follows the above useEffect
  });

  useEffect(
    function () {
      console.log("After dependency is updated");
    },
    [query]
  );

  console.log("During render"); // runs first as part of the render logic, during render
  */

  function handleSelectMovie(id) {
    // setSelectedId(id);
    setSelectedId((currentId) => (id === currentId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      // fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=interstellar`)
      //   .then((res) => res.json())
      //   .then((data) => setMovies(data.Search));
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); // ensures error object is reset before each fetch request to prevent unintentional errors
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
          );

          if (!response.ok) {
            throw new Error("Something went wrong. Unable to fetch movies.");
          }

          const data = await response.json();

          if (data.Response === "False") {
            throw new Error("Movie not found.");
          }

          setMovies(data.Search);
          // setIsLoading(false);
          // console.log(data.Search); // logs movie data
          // console.log(movies); // won't work because state is asynchronous and therefore this will be stale state
        } catch (error) {
          // console.error(error);
          console.error(error.message);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      // if (!query.length) {
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return; // the fetch request will not be executed if the condition is not met
      }

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* implicit approach to passing components as children */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// presentational component //
function Loader() {
  return <p className="loader">Loading...</p>;
}

// presentational component //
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

// structural component //
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

// presentational component //
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// stateful component //
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// presentational component //
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// structural component //
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// stateful component //
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// stateful component //
function MovieList({ movies, onSelectMovie }) {
  // const [movies, setMovies] = useState(tempMovieData);
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

// presentational component //
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie }) {
  return (
    <div className="details">
      <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
      {selectedId}
    </div>
  );
}

// presentational component //
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// presentational component //
function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

// presentational component //
function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

/*
// stateful component //
function Box({ element }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && element}
    </div>
  );
}

// stateful component //
function ListBox({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
    <button
    className="btn-toggle"
    onClick={() => setIsOpen1((open) => !open)}
    >
    {isOpen1 ? "–" : "+"}
    </button>
    {isOpen1 && children}
    </div>
  );
}

// stateful component //
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </>
      )}
    </div>
  );
}
*/
