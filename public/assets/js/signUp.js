import * as user_api from "./modules/user-rest-api.mjs";
/**
 * Manejador de evento signUp
 */

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return passwordRegex.test(password);
};

const signUpHandler = async (e) => {
  e.preventDefault();
  const divStat = document.getElementById("sign-up-status");
  const { username, email, password, confirmedPassword } = e.target;

  if (password.value !== confirmedPassword.value) {
    divStat.innerText = "Passwords do not match!";
    divStat.style.color = "red";
    return;
  }

  if (!validatePassword(password.value)) {
    divStat.innerText =
      "La contraseña debe tener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas, números y caracteres especiales";
    divStat.style.color = "red";
    return;
  }

  const userIntroduced = {
    username: username.value,
    email: email.value,
    password: password.value,
    confirmedPassword: confirmedPassword.value,
  };

  const res = await user_api.registerUser(userIntroduced);
  if (res.status === 409) {
    divStat.innerText = "El nombre de usuario o email es inválido!";
    divStat.style.color = "red";
    divStat.style.textAlign = "center";
    return;
  }

  if (res.status === 400) {
    divStat.innerText = "Las contraseñas no coinciden!";
    divStat.style.color = "red";
    return;
  }

  if (res.status === 500) {
    divStat.innerText = "Algo ha ido mal!";
    divStat.style.color = "red";
    return;
  }
  alert("Revise su correo electrónico para activar su cuenta.");
  window.location.replace("/");
};

/**
 * Controlar el evento de submit a la hora de registrarse
 */
const signUpForm = document.forms["sign-up-form"];
if (signUpForm) {
  signUpForm.addEventListener("submit", signUpHandler);
}

const togglePassword = (input, icon) => {
  if (input.type === "password") {
    input.type = "text";
    icon.setAttribute("class", "fa fa-eye toggle-password");
  } else {
    input.type = "password";
    icon.setAttribute("class", "fa fa-eye-slash toggle-password");
  }
};

const togglePasswordField = document.getElementById("togglePassword");
const password = document.getElementById("password");
togglePasswordField.addEventListener("click", () => {
  togglePassword(password, togglePasswordField);
});

const togglePasswordConfirmField = document.getElementById("togglePassword2");
const passwordConfirm = document.getElementById("password2");
togglePasswordConfirmField.addEventListener("click", () => {
  togglePassword(passwordConfirm, togglePasswordConfirmField);
});
