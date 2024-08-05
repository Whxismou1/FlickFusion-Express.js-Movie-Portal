import * as user_api from "./modules/user-rest-api.mjs";
import * as recaptcha_api from "./modules/recaptcha-rest-api.mjs";

const loginHandler = async (e) => {
  e.preventDefault();
  const errorDiv = document.getElementById("wrong-credentials");
  errorDiv.innerText = "";
  const captchaResponse = grecaptcha.getResponse();

  if (!captchaResponse.length > 0) {
    const errorDiv = document.getElementById("wrong-credentials");
    errorDiv.innerText = "Por favor, verifica el captcha";
    errorDiv.style.color = "red";
    grecaptcha.reset();
    return;
  }

  const resCaptcha = await recaptcha_api.checkRecaptcha(captchaResponse);
  const dataCatpcha = await resCaptcha.json();

  if (dataCatpcha.success === false) {
    const errorDiv = document.getElementById("wrong-credentials");
    errorDiv.innerText = "Por favor, verifica el captcha";
    errorDiv.style.color = "red";
    grecaptcha.reset();
    return;
  }

  const username = e.target.username.value;
  const password = e.target.password.value;

  const res = await user_api.loginUser(username, password);
  errorDiv.innerText = "";
  if (res.status === 401) {
    errorDiv.innerText = "Credenciales incorrectas";
    errorDiv.style.color = "red";
    grecaptcha.reset();
    return;
  }

  if (res.status === 500) {
    errorDiv.innerText = "Algo ha ido mal!";
    errorDiv.style.color = "red";
    grecaptcha.reset();
    return;
  }

  if (res.status === 452) {
    errorDiv.innerText = "Verifica la cuenta!";
    errorDiv.style.color = "red";
    grecaptcha.reset();
    return;
  }

  const user = await res.json();

  if (user.userType === "ADMIN") {
    window.location.replace("/adminPanel");
  } else {
    window.location.replace("/paginaPrincipal");
  }
};

const showPassHandler = (e) => {
  e.preventDefault();

  const passwordInput = document.getElementById("password");
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  if (type === "password") {
    e.target.setAttribute("class", "fa fa-eye-slash");
  } else {
    e.target.setAttribute("class", "fa fa-eye");
  }
};

const signWithGoogleHandler = async (e) => {
  e.preventDefault();

  window.location.replace("/auth/google");
};

const forgotPasswordHandler = async (e) => {
  e.preventDefault();
  window.location.replace("/forgotPassword");
};
/**
 * Manejador de evento login normal
 */
const loginForm = document.forms["login-form"];
if (loginForm) {
  loginForm.addEventListener("submit", loginHandler);
}

/**
 * Manejador de evento login por google
 */
const signWithGoogle = document.getElementById("signWithGoogle");

if (signWithGoogle) {
  signWithGoogle.addEventListener("click", signWithGoogleHandler);
}
// ./assets/html/forgotPassword.html

const forgotPassButton = document.getElementById("forgot-pass-button");
forgotPassButton.addEventListener("click", forgotPasswordHandler);

const butonShowPass = document.getElementById("togglePassword");
butonShowPass.addEventListener("click", showPassHandler);
