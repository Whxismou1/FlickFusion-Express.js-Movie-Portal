import { BASE_URL } from "./config.mjs";

const baseURL = BASE_URL + "api/multimedia/";

const storeFilmsCartOnDB = (cart) => {
  return fetch(`${baseURL}movies/storeFilmsCartOnDB`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cart),
    credentials: "include",
  });
};

const getPurchasedFilmsDB = () => {
  return fetch(`${baseURL}movies/getMoviesPurchased`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export { storeFilmsCartOnDB, getPurchasedFilmsDB };
