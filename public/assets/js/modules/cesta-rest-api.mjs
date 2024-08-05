import { BASE_URL } from "./config.mjs";
const PAYMENTURL = BASE_URL + "payments/";

const purchaseFilms = (filmsOnCart) => {
  return fetch(`${PAYMENTURL}create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filmsOnCart),
    credentials: "include",
  });
};

export { purchaseFilms };
