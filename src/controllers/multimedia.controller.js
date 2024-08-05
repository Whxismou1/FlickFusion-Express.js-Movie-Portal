//API KEY TMDB PARA PODER HACER PETICIONES A LA API DE TMDB
const API_KEY = process.env.API_KEY_TMDB;

//IMPORTAMOS JWT PARA PODER HACER USO DE LOS TOKENS
const jwt = require("jsonwebtoken");

//IMPORTAMOS env PARA PODER USAR LAS VARIABLES DE ENTORNO
const env = require("dotenv");

//IMPORTAMOS EL MODELO DE COMPRAS
const purchaseDb = require("../models/purchase.model");
// const { get } = require("mongoose");

//configuramos las variables de entorno
env.config();

// Metodo encargado para obtener todos los generos de las peliculas
const getAllGenres = async (req, res) => {
  const resGenres = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?language=es&api_key=${API_KEY}`
  );

  const fGenres = await resGenres.json();

  if (fGenres.genres.length === 0) {
    return res.status(404).json("No se ha encontrado ningun genero");
  }
  return res.status(200).json(fGenres.genres);
};

// Metodo encargado para obtener todas las peliculas que cumplan los generos
const getMoviesByFilters = async (req, res) => {
  const filters = req.query.filters;
  const page = req.query.page;
  let queryGenres = "";

  if (Array.isArray(filters)) {
    for (const filter of filters) {
      queryGenres += `with_genres=${filter}&`;
    }
  } else {
    queryGenres += `with_genres=${filters}`;
  }

  const resGenres = await fetch(
    `https://api.themoviedb.org/3/discover/movie?language=es&api_key=${API_KEY}&${queryGenres}&page=${page}`
  );

  const moviesFiltered = await resGenres.json();

  if (moviesFiltered.results.length === 0) {
    return res.status(404).json("No se ha encontrado ninguna pelicula");
  }
  return res.status(200).json(moviesFiltered.results);
};

/**
 * Metodo encargado de obtener las peliculas que estan en tendencia
 * @param {*} req
 * @param {*} res
 * @returns {JSON} Devuelve un JSON con las peliculas que estan en tendencia
 */
const getTrendingFilms = async (req, res) => {
  try {
    const url2fetch = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${API_KEY}`
    );

    const trendingFilms = await url2fetch.json();

    res.status(200).json(trendingFilms.results);
  } catch (error) {
    console.error("Algo ha ido mal:", error);
    res.status(500).json({ message: "Algo ha ido mal", error: error.message });
  }
};

/**
 * Metodo encargado de obtener las peliculas que coincidan con el nombre
 * introducido en el formulario
 * @param {*} req
 * @param {*} res
 * @returns {JSON} Devuelve un JSON con las peliculas que coinciden con el nombre
 */

const getMovieByName = async (req, res) => {
  const query = req.body.title;

  const resFetc = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&include_adult=false&language=en-US&page=1`
  );

  const films = await resFetc.json();
  if (films.results.length === 0) {
    return res.status(404).json("No se ha encontrado ninguna pelicula");
  }

  return res.status(200).json(films.results);
};

/**
 *Metodo encargado de almacenar las peliculas compradas en la base de datos
 * @param {*} req Datos de la petición (cart & token)
 * @param {*} res
 */
const storeFilmsCartOnDB = async (req, res) => {
  try {
    const cart = req.body;
    if (req.isAuthenticated()) {
      const user = req.user;
      const purchases = await Promise.all(
        cart.map(async (film) => {
          return purchaseDb.create({
            username: user.username,
            filmId: film.id,
            filmTitle: film.title,
            poster_path: film.poster_path,
          });
        })
      );
      res.status(200).json({ message: "Peliculas almacenadas en la BBDD", purchases: purchases });
    } else {
      const token = req.cookies.jwt_token;
      const user = jwt.verify(token, process.env.JWT_KEY);

      const purchases = await Promise.all(
        cart.map(async (film) => {
          return purchaseDb.create({
            username: user.username,
            filmId: film.id,
            filmTitle: film.title,
            poster_path: film.poster_path,
          });
        })
      );
      res.status(200).json({ message: "Peliculas almacenadas en la BBDD", purchases: purchases });
    }
  } catch (error) {
    console.error("Algo ha ido mal almacenando las peliculas en la BBDD:", error);
    res
      .status(500)
      .json({
        message: "Algo ha ido mal almacenando las peliculas en la BBDD:",
        error: error.message,
      });
  }
};

/**
 * Metodo encargado de obtener una pelicula por su id
 * @param {*} req
 * @param {*} res
 * @returns {JSON} Devuelve un JSON con la pelicula
 */
const getFilmById = async (req, res) => {
  try {
    const { id } = req.params;
    const resFetc = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
    );
    const film = await resFetc.json();

    res.status(200).json(film);
  } catch (error) {
    console.error("Algo ha ido mal:", error);
    res.status(404).json({ message: "Error finding data", error: error.message });
  }
};

/**
 * Metodo encargado de obtener la URL del trailer de una pelicula
 * @param {*} req
 * @param {*} res
 * @returns {JSON} Devuelve un JSON con la URL del trailer de la pelicula
 */
const getURLFilmTrailer = async (req, res) => {
  try {
    const { id } = req.params;
    const url2fetch = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
    );

    const trailerData = await url2fetch.json();
    const trailer = trailerData.results.find((video) => video.type === "Trailer");
    if (trailer === undefined) {
      res.status(200).json("No trailer found");
      return;
    }
    const trailerKey = trailer.key;

    res.status(200).json(trailerKey);
  } catch (error) {
    console.error("Algo ha ido mal:", error);
    res.status(404).json({ message: "Algo ha ido mal", error: error.message });
  }
};

/**
 * Metodo encargado de obtener las peliculas compradas por un usuario
 * @param {*} req
 * @param {*} res
 * @returns {JSON} Devuelve un JSON con las peliculas compradas por el usuario
 */
const getMoviesPurchasedByUser = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user;
      const purchases = await purchaseDb.find({ username: user.username });
      return res.status(200).json(purchases);
    } else {
      const token = req.cookies.jwt_token;
      const user = jwt.verify(token, process.env.JWT_KEY);

      const purchases = await purchaseDb.find({ username: user.username });
      return res.status(200).json(purchases);
    }
  } catch (error) {
    console.error("Algo ha ido mal:", error);
    return res.status(500).json({ message: "Algo ha ido mal", error: error.message });
  }
};

const getMoviesFromAPIByPage = async (req, res) => {
  try {
    const page = req.query.page;
    const resFetchAPI = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=es-ES&page=${page}&sort_by=popularity.desc`
    );

    const films = await resFetchAPI.json();
    return res.status(200).json(films.results);
  } catch (error) {
    console.error("Algo ha ido mal:", error);
    return res.status(500).json({ message: "Algo ha ido mal", error: error.message });
  }
};

module.exports = {
  getAllGenres,
  getMovieByName,
  storeFilmsCartOnDB,
  getTrendingFilms,
  getFilmById,
  getURLFilmTrailer,
  getMoviesPurchasedByUser,
  getMoviesFromAPIByPage,
  getMoviesByFilters,
};
