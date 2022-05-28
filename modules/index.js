import config from "../conf/index.js";

let movies = [];

/**
 * Fetches and populates movies to the DOM
 */
async function init() {
  let movieList = await fetchMovieList();
  if (movieList) {
    document.getElementById("list-title").innerText = movieList.name;
    movies = movieList.items;
    addMoviesToDom(movies);
  }
}

/**
 * Fetches movie list from server
 */
async function fetchMovieList() {
  try {
    const response = await fetch(
      `${config.endpoint}/list/1?api_key=${config.apiKey}`
    );
    const movieList = await response.json();
    return movieList;
  } catch (error) {
    return null;
  }
}

/**
 * Iterates through all movies and adds it to the DOM
 * @param  {[Object]} movies List of movies retrived from server
 */
function addMoviesToDom(movies) {
  if (movies.length === 0) {
    document.getElementById("movies").innerText = "No movies found";
    return;
  }
  movies.forEach(
    ({ poster_path, vote_average, release_date, vote_count, title }) => {
      addMovieToDOM(poster_path, vote_average, release_date, vote_count, title);
    }
  );
}

/**
 * Adds movie div to the DOM
 * @param  {String} posterPath Path to poster image
 * @param  {Number} voteAvarage User rating
 * @param  {String} releaseDate Release Date
 * @param  {Number} voteCount Number of user votes
 * @param  {String} title Title of the movie
 */
function addMovieToDOM(posterPath, voteAvarage, releaseDate, voteCount, title) {
  let div = document.createElement("div");
  div.className = "col-3";
  div.innerHTML = `
    <div class="card">
      <div class="card-image">
        <div class="poster-image">
          <img
            src="https://image.tmdb.org/t/p/w500${posterPath}"
            alt="${title}"
            loading="lazy"
          />
        </div>
      </div>
      <div class="card-detail">
        <div class="card-actions">
          <div class="chip">
            <span>Rating : ${voteAvarage} (${voteCount})</span>
          </div>
          <div class="chip">
            <span>${new Date(releaseDate).toDateString()}</span>
          </div>
        </div>
      </div>
    </div>
    `;
  document.getElementById("movies").append(div);
}

/**
 * Sorts movies in specific order
 * @param  {[Object]} movies List of movies
 * @return {[Object]}      Sorted list of movies
 */
function sortMovies(movies) {
  const sortBy = document.getElementById("sort").value;
  let sortedMovies = [...movies];
  switch (sortBy) {
    case "releaseasc":
      sortedMovies.sort(
        (a, b) => new Date(a.release_date) - new Date(b.release_date)
      );
      break;
    case "releasedesc":
      sortedMovies.sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
      break;
    case "namaeasc":
      sortedMovies.sort((a, b) =>
        a.title > b.title ? 1 : b.title > a.title ? -1 : 0
      );
      break;
    case "namedesc":
      sortedMovies.sort((a, b) =>
        a.title < b.title ? 1 : b.title < a.title ? -1 : 0
      );
      break;
  }
  return sortedMovies;
}

/**
 * Filters movies
 * @param  {[Object]} movies List of movies
 * @return {[Object]}      Filtered list of movies
 */
function filterMoviesByRating(movies) {
  const rating = document.getElementById("filter").value;
  let filteredMovies = [...movies];
  switch (rating) {
    case "morethan9":
      filteredMovies = movies.filter(({ vote_average }) => vote_average > 9);
      break;
    case "between7and9":
      filteredMovies = movies.filter(
        ({ vote_average }) => vote_average > 7 && vote_average < 9
      );
      break;
    case "between5and7":
      filteredMovies = movies.filter(
        ({ vote_average }) => vote_average > 5 && vote_average < 7
      );
      break;
    case "lessthan5":
      filteredMovies = movies.filter(({ vote_average }) => vote_average < 5);
      break;
  }
  return filteredMovies;
}

/**
 * Filters movies
 * @param  {[Object]} movies List of movies
 * @return {[Object]}      Filtered list of movies
 */
function searchMovies(movies) {
  const searchText = document.getElementById("search").value;
  if (searchText.length === 0) {
    return movies;
  } else {
    let filteredMovies = movies.filter(({ title }) =>
      title.toLowerCase().includes(searchText.toLowerCase())
    );
    return filteredMovies;
  }
}

/**
 * Filters movies
 */
function filterChanged() {
  document.getElementById("movies").textContent = "";
  const filteredMovies = searchMovies(filterMoviesByRating(sortMovies(movies)));
  addMoviesToDom(filteredMovies);
}

export { init, filterChanged };
