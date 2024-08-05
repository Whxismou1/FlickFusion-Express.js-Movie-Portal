import * as user_api from "./modules/user-rest-api.mjs";

const forgotPasswordHandler = async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  const res = await user_api.sendPasswordResetRequest(email);
  const data = await res.text();

  alert(data);

  document.getElementById("forgot-password-form").reset();
};

const form = document.getElementById("forgot-password-form");
form.addEventListener("submit", forgotPasswordHandler);
