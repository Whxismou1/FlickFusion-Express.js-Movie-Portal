import { BASE_URL } from "./config.mjs";
const baseURLUsers = BASE_URL + "api/user/";
/**
 * @function getUserByName
 * @description Función que obtiene un usuario por nombre
 * @param {*} query  Nombre del usuario a buscar
 * @returns
 */
const getUserByNameNonStricted = (query) => {
  return fetch(`${baseURLUsers}getUserByNameNonStricted`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: query }),
    credentials: "include",
  });
};

/**
 * @function getAllUsers
 * @description Función que obtiene todos los usuarios
 * @returns
 */
const getAllUsers = async () => {
  return fetch(`${baseURLUsers}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

const removeUser = async (id) => {
  const res = await fetch(`${baseURLUsers}delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res;
};
export { getUserByNameNonStricted, getAllUsers, removeUser };
