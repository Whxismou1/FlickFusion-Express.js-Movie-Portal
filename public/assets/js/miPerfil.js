import * as user_api from "./modules/user-rest-api.mjs";
import * as bbdd_api from "./modules/bbdd-rest-api.mjs";
import * as pfp_render from "./modules/profileImage-render.mjs";

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return passwordRegex.test(password);
};

const logoutHandler = async (e) => {
  e.preventDefault();
  try {
    const res = await user_api.getTypeOfCookies();

    if (!res.ok) {
      alert("You are not logged in");
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
      alert("Se ha cerrado la sesión correctamente");
      window.location.replace("/");
    } else {
      alert("Error cerrando la sesión", backRes.statusText);
    }
    localStorage.removeItem("cart");
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
  }
};

const logOut = document.getElementById("log-out-button");
if (logOut) {
  logOut.addEventListener("click", logoutHandler);
}

const handlerChangerPFP = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = async (event) => {
    const file = event.target.files[0];
    formData.append("profilePicture", file);

    // Agregar el username al formData
    const user = await user_api.getUserByToken();
    const userData = await user.json();
    formData.append("username", userData.username);

    try {
      const res = await user_api.changeProfilePicture(formData, userData.username);
      const resJson = await res.text();
      if (res.ok) {
        alert("Foto de perfil cambiada correctamente");
        window.location.reload();
      } else {
        alert(
          "Algo ha ido mal. Comprueba que el formato es correcto (png, jpg o jpeg) y que el tamaño es menor o igual a 1MB"
        );
      }
    } catch (error) {
      console.error("Algo ha ido mal cambiando la foto de perfil:", error);
    }
  };

  fileInput.click();
};
const handlerDeleterPFP = async (e) => {
  e.preventDefault();
  const res = await user_api.getUserByToken();
  const user = await res.json();
  const resDel = await user_api.deleteProfilePicture(user.username);
  if (resDel.ok) {
    alert("Foto de perfil eliminada correctamente");
    window.location.reload();
  } else {
    alert("Error al eliminar la foto de perfil");
  }
};
const loadInfoUser = async () => {
  await pfp_render.loadUserProfileImage();
  const fieldPass = document.getElementById("fields-art-pass");

  const userPlace = document.getElementById("usernameplace");
  const emailPlace = document.getElementById("emailplace");
  const imagenPlace = document.getElementById("img-logo-user");

  const buttonProfileMultifuncion = document.getElementById("multiedit-pfp");

  try {
    const res = await user_api.getUserByToken();

    const user = await res.json();
    const actualPhoto = user.profilePicture.split("/")[2].split(".")[0];
    if (user.registrationMethod === "oauth") {
      fieldPass.style.display = "none";
    } else {
      fieldPass.style.display = "block";
    }

    if (actualPhoto === "iconUser") {
      buttonProfileMultifuncion.innerText = "Editar foto";
      buttonProfileMultifuncion.addEventListener("click", handlerChangerPFP);
    } else {
      buttonProfileMultifuncion.innerText = "Borrar foto";
      buttonProfileMultifuncion.addEventListener("click", handlerDeleterPFP);
    }

    userPlace.innerHTML = user.username;
    emailPlace.innerHTML = user.email;
    imagenPlace.src = user.profilePicture;
    // Verificar si hay un parámetro de éxito o error en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const isSuccess = urlParams.get("success");

    if (isSuccess === "suc") {
      alert("Pago exitoso");
      const cart = JSON.parse(localStorage.getItem("cart"));
      const añadirPeliBBDD = await bbdd_api.storeFilmsCartOnDB(cart);
      const resBBDD = await añadirPeliBBDD.json();
      localStorage.removeItem("cart");
    } else if (isSuccess === "can") {
      alert("Pago cancelado");
      localStorage.removeItem("cart");
    } else {
    }
  } catch (error) {
    console.log("Error al cargar la información del usuario: ", error);
  }
};

const makeVisibleFields = async (e) => {
  e.preventDefault();
  const divPass = document.getElementById("password-change-fields");
  divPass.style.display = divPass.style.display === "block" ? "none" : "block";
  document.getElementById("current-password").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("confirm-password").value = "";
  document.getElementById("status-update-password").innerHTML = "";
};

const changePassHandler = async (e) => {
  e.preventDefault();

  const divStat = document.getElementById("status-update-password");
  divStat.innerHTML = "";

  const resUser = await user_api.getUserByToken();

  const user = await resUser.json();

  const currentPass = document.getElementById("current-password").value;
  const newPass = document.getElementById("new-password").value;
  const confirmNewPass = document.getElementById("confirm-password").value;

  if (newPass !== confirmNewPass) {
    divStat.innerHTML = "Las contraseñas no coinciden";
    divStat.style.color = "red";
    return;
  }

  if (!validatePassword(newPass)) {
    divStat.innerHTML =
      "La contraseña debe tener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas, números y caracteres especiales";
    divStat.style.color = "red";
    return;
  }

  const res = await user_api.updatePassword(currentPass, newPass, confirmNewPass, user);
  if (res.ok) {
    divStat.innerHTML = "Contraseña actualizada correctamente";
    divStat.style.color = "green";
    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
  } else if (res.status === 401) {
    divStat.innerHTML = "Credenciales incorrectas";
    divStat.style.color = "red";
    return;
  } else if (res.status === 400) {
    divStat.innerHTML = "Las contraseñas no coinciden";
    divStat.style.color = "red";
    return;
  }
};

const togglePassword = (input, icon) => {
  if (input.type === "password") {
    input.type = "text";
    icon.setAttribute("class", "fa fa-eye toggle-password");
  } else {
    input.type = "password";
    icon.setAttribute("class", "fa fa-eye-slash toggle-password");
  }
};

window.addEventListener("load", loadInfoUser);
const buttonChangePassword = document.getElementById("change-password-button");
buttonChangePassword.addEventListener("click", makeVisibleFields);

const changePassButton = document.getElementById("submit-password-change");
changePassButton.addEventListener("click", changePassHandler);

const togglePassword1 = document.getElementById("togglePassword1");
const password = document.getElementById("current-password");
togglePassword1.addEventListener("click", () => {
  togglePassword(password, togglePassword1);
});

const togglePassword2 = document.getElementById("togglePassword2");
const newPassword = document.getElementById("new-password");
togglePassword2.addEventListener("click", () => {
  togglePassword(newPassword, togglePassword2);
});

const togglePassword3 = document.getElementById("togglePassword3");
const confirmPassword = document.getElementById("confirm-password");
togglePassword3.addEventListener("click", () => {
  togglePassword(confirmPassword, togglePassword3);
});
