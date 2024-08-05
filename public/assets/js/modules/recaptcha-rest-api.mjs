import { BASE_URL } from "./config.mjs";

const checkRecaptcha = async (token) => {
  return fetch(`${BASE_URL}recaptcha/check/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
};

export { checkRecaptcha };
