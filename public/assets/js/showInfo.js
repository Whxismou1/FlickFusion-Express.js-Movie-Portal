import * as cesta_manager from "./modules/cesta-manager.mjs";
import * as bbdd_api from "./modules/bbdd-rest-api.mjs";
import * as multimedia_api from "./modules/multimedia-rest-api.mjs";
import * as pfp_render from "./modules/profileImage-render.mjs";

const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
let currentMovie = null;

/**
 * Metodo encargado de añadir peliculas al carrito
 */
const addToCartHandler = async () => {
  const butAddToCart = document.getElementById("btnAddCart");
  butAddToCart.disabled = true;
  const divStatusCart = document.getElementById("cart-adition-status");

  divStatusCart.innerText = "";
  divStatusCart.innerText = "Película añadida al carrito";
  cesta_manager.addMovieToCart(currentMovie);
};

const movieIsOnCart = (movie) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === movie.id) {
      return true;
    }
  }
  return false;
};

const movieIsPurchasedByUser = async (movie) => {
  const res = await bbdd_api.getPurchasedFilmsDB();

  const movies = await res.json();
  if (movies.length === 0) {
    return false;
  }

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].filmId === movie.id) {
      return true;
    }
  }
  return false;
};

/**
 * Metodo encrgado del renderizado y logica de la pagina showinfo
 */
const showInfoHandler = async () => {
  await pfp_render.loadUserProfileImage();

  const id = parseInt(window.location.pathname.split("/")[1].substring(8));
  const movie = await multimedia_api.getMovieById(id);
  const movieData = await movie.json();
  currentMovie = movieData;
  const imageMovie = document.getElementById("movie-image");
  imageMovie.src = "";

  imageMovie.src = IMG_PATH + movieData.poster_path;
  document.getElementById("movie-title").innerText = movieData.title;
  document.getElementById("movie-description").innerText = movieData.overview;

  const butAddToCart = document.getElementById("btnAddCart");

  const isMoviePurchasedByUser = await movieIsPurchasedByUser(movieData);

  if (isMoviePurchasedByUser === true || movieIsOnCart(movieData) === true) {
    butAddToCart.disabled = true;
  } else {
    butAddToCart.disabled = false;
    butAddToCart.addEventListener("click", addToCartHandler);
  }

  const trailer = await multimedia_api.getTrailerURLByMovie(id);
  const trailerKey = await trailer.json();
  const iframe = document.getElementById("trailer-iframe");
  iframe.src = `https://www.youtube.com/embed/${trailerKey}`;

  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Popularity", "Vote Average", "Vote Count"],
      datasets: [
        {
          label: "Movie Stats",
          data: [movieData.popularity, movieData.vote_average, movieData.vote_count],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Movie Statistics",
        },
      },
    },
  });
};

window.addEventListener("load", showInfoHandler);
