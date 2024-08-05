/**
 * @file Archivo de rutas de multimedia
 * @name multimedia.router.js
 * @description Este archivo contiene todas las rutas relacionadas con la gestion de multimedia de la aplicación.
 */

// Se importan los módulos
const express = require("express");

// Se importan los controladores
const filmController = require("../controllers/multimedia.controller");

//Importar middlewares
const authToken = require("../middlewares/authToken.middleware");

//Se obtiene el router
const filmRouter = express.Router();

//Ruta para obtener las peliculas compradas por el usuario
filmRouter.get(
  "/movies/getMoviesPurchased",
  authToken.authToken,
  filmController.getMoviesPurchasedByUser
);

//Ruta para obtener las peliculas desde la base de datos
filmRouter.get("/movies/getAllMoviesByPage", filmController.getMoviesFromAPIByPage);

//Ruta para obtener una pelicula por su nombre
filmRouter.post("/movies/getMovieByName", authToken.authToken, filmController.getMovieByName);

//Ruta para obtener los generos de las peliculas
filmRouter.get("/movies/genres", authToken.authToken, filmController.getAllGenres);
//Ruta para obtener las peliculas que cumplen los filtros
filmRouter.get("/movies/getMoviesByFilters", authToken.authToken, filmController.getMoviesByFilters);

//Ruta para añadir las peliculas commpradas en la base de datos
filmRouter.post(
  "/movies/storeFilmsCartOnDB",
  authToken.authToken,
  filmController.storeFilmsCartOnDB
);

//Ruta para obtener las peliculas trending
filmRouter.get("/movies/trending", authToken.authToken, filmController.getTrendingFilms);

//Ruta para obtener el trailer de las peliculas
filmRouter.get("/movies/trailer/:id", authToken.authToken, filmController.getURLFilmTrailer);

//Ruta para obtener las peliculas por su id
filmRouter.get("/movies/:id", authToken.authToken, filmController.getFilmById);

module.exports = filmRouter;
