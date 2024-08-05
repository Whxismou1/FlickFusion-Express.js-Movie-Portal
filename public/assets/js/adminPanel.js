import * as user_api from "./modules/user-rest-api.mjs";
import * as admin_api from "./modules/adminPanel-rest-api.mjs";
import * as admin_render_comp from "./modules/adminPanel-render-components.mjs";

const logoutHandler = async (e) => {
  e.preventDefault();
  try {
    const res = await user_api.getTypeOfCookies();

    if (!res.ok) {
      alert("No estás logueado");
      return;
    }
    const user = await res.json();
    let backRes;

    if (user.type === "oauth") {
      backRes = await user_api.logOutGoogle();
    } else if (user.type === "jwt") {
      backRes = await user_api.logoutUser();
    }

    if (backRes.ok) {
      alert("Se ha cerrado sesión correctamente");
      window.location.replace("/");
    } else {
      alert("Error cerrando la sesión", backRes.statusText);
    }
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
  }
};

const getUsersSearchHandler = async (e) => {
  e.preventDefault();
  const user = e.target.usersbar.value;
  if (user === "") {
    location.reload();
    return;
  }

  const res = await admin_api.getUserByNameNonStricted(user);
  if (res.ok) {
    const data = await res.json();

    const users = Array.isArray(data) ? data : [data];

    admin_render_comp.renderUsers(users);
    admin_render_comp.setLastUser(0);
  } else {
    const article = document.getElementById("usuarios-table");
    article.innerHTML = "";
    article.innerText = "No se ha encontrado ningún usuario";
  }
};
/**
 * @type {HTMLFormElement}
 *Metodo encargado de renderizar y obtener todo lo relacionado con usuarios y peliculas
 */
window.addEventListener("load", async () => {
  const resUsers = await admin_api.getAllUsers();
  const dataUsers = await resUsers.json();

  admin_render_comp.renderUsers(dataUsers);
});

const removeUserHandler = (id) => {
  admin_api.removeUser(id);
};

const formGetUsers = document.forms["users-search"];
formGetUsers.addEventListener("submit", getUsersSearchHandler);

const logOut = document.getElementById("log-out-button");
if (logOut) {
  logOut.addEventListener("click", logoutHandler);
}

export { removeUserHandler };
