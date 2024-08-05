import { BASE_URL } from "./config.mjs";

/**
 * URL base de la API REST.
 */
const baseURL = BASE_URL + "api/user/";
const googleURL = BASE_URL + "auth/";

const getUserByToken = () => {
  return fetch(`${baseURL}getUserByToken`, {
    method: "GET",
    credentials: "include",
  });
};

/**
 * Realiza la petición de login al servidor.
 * @param {String} username Nombre de usuario introducido
 * @param {String} password Contraseña introducida
 * @returns  {Promise<Response>} Posible resultado de la operación asíncrona.
 */
const loginUser = (username, password) => {
  return fetch(`${baseURL}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
};

const registerUser = (user) => {
  return fetch(`${baseURL}register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

const logoutUser = () => {
  return fetch(`${baseURL}logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

const logOutGoogle = async () => {
  const res = await fetch(`${googleURL}logout`, {
    method: "POST",
    credentials: "include",
  });
  return res;
};

const getTypeOfCookies = async () => {
  const res = await fetch(`${baseURL}getTypeOfCookies`, {
    method: "GET",
    credentials: "include",
  });
  return res;
};

const changeProfilePicture = async (formData, username) => {
  return fetch(`${baseURL}changeProfilePicture?username=${username}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const deleteProfilePicture = async (username) => {
  return fetch(`${baseURL}deleteProfilePicture?username=${username}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const sendPasswordResetRequest = async (email) => {
  return fetch(`${baseURL}sendPasswordResetRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
};

const updatePassword = async (currentPass, newPass, confirmNewPass, user) => {
  return fetch(`${baseURL}updatePassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPass, newPass, confirmNewPass, user }),
  });
};

export {
  loginUser,
  registerUser,
  logoutUser,
  logOutGoogle,
  getTypeOfCookies,
  getUserByToken,
  changeProfilePicture,
  deleteProfilePicture,
  sendPasswordResetRequest,
  updatePassword,
};
