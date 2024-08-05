import { BASE_URL } from "./config.mjs";
const baseURL = BASE_URL + "api/multimedia";

const searchByName = (query) => {
  return fetch(`${baseURL}/movies/getMovieByName`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: query }),
    credentials: "include",
  });
};

/**
 * @function getAllFilms
 * @description Función que obtiene todas las películas
 * @returns
 */
const getAllFilms = async (actualPage) => {
  return fetch(`${baseURL}/movies/getAllMoviesByPage?page=${actualPage}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

/**
 * @function getMoviesByFilter
 * @description Función que obtiene todas las peliculas que cumplen los filtros
 * @returns
 */
const getMoviesByFilter = async (movieFilters, page) => {
  const params = new URLSearchParams();

  movieFilters.forEach((filter) => {
    params.append("filters", filter);
  });
  const queryString = params.toString();
  return fetch(`${baseURL}/movies/getMoviesByFilters?page=${page}&${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

/**
 * @function getAllGenres
 * @description Función que obtiene todos los géneros
 * @returns
 */
const getAllGenres = async () => {
  return fetch(`${baseURL}/movies/genres`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

const getTrendingFilms = async () => {
  return fetch(`${baseURL}/movies/trending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

const getTrailerURLByMovie = async (id) => {
  return fetch(`${baseURL}/movies/trailer/${id}`, { method: "GET", credentials: "include" });
};

const getMovieById = async (id) => {
  return fetch(`${baseURL}/movies/${id}`, { method: "GET", credentials: "include" });
};

export {
  searchByName,
  getAllFilms,
  getTrendingFilms,
  getAllGenres,
  getMoviesByFilter,
  getTrailerURLByMovie,
  getMovieById,
};
