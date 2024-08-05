//Variable que guarda la posicion del ultimo usuario renderizado
import * as admin_api from "./adminPanel-rest-api.mjs";
let lastUser = 0;

const setLastUser = (value) => {
  lastUser = value;
};

/**
 * Metodo encargado de renderizar los usuarios de la base de datos
 * Cada usuario sera un botón que elimina ese mismo usuario de la base de datos
 * @param {Array[]} users
 */ const renderUsers = (users) => {
  const article = document.getElementById("usuarios-table");

  // Limpiar el contenido previo
  article.innerHTML = "";

  // Validar el valor de lastUser
  if (lastUser < 0) {
    lastUser = 0;
  }

  const renderUserButton = (user) => {
    const button = document.createElement("button");
    const img = document.createElement("img");
    img.src = "/assets/img/iconUser.png";
    img.alt = user.username;
    img.width = 150;
    img.height = 225;
    button.style.margin = "5px";
    button.style.outline = "none";
    button.style.border = "none";
    button.style.backgroundColor = "transparent";
    button.setAttribute("class", "outline secondary");
    if (user.userType !== "ADMIN") {
      button.addEventListener("click", () => {
        const confirmDelete = confirm("¿Estás seguro de que quieres eliminar el usuario?");
        if (confirmDelete) {
          admin_api.removeUser(user._id);
          button.remove();
        }
      });
    }
    button.appendChild(img);
    button.appendChild(document.createTextNode(user.username));
    article.appendChild(button);
  };

  // Renderizar usuarios
  const maxUsers = Math.min(users.length, lastUser + 18);
  for (let i = lastUser; i < maxUsers; i++) {
    renderUserButton(users[i]);
  }

  // Botón "Anterior"
  if (lastUser > 0) {
    const previousPage = document.createElement("button");
    previousPage.innerText = "Anterior";
    previousPage.addEventListener("click", () => {
      lastUser -= 18;
      renderUsers(users);
    });
    article.appendChild(previousPage);
  }

  // Botón "Siguiente"
  if (lastUser + 18 < users.length) {
    const nextPage = document.createElement("button");
    nextPage.innerText = "Siguiente";
    nextPage.addEventListener("click", () => {
      lastUser += 18;
      renderUsers(users);
    });
    article.appendChild(nextPage);
  }
};

export { renderUsers, setLastUser };
