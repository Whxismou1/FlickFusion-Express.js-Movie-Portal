import * as user_api from "./user-rest-api.mjs";

const loadUserProfileImage = async () => {
  try {
    const res = await user_api.getUserByToken();
    const user = await res.json();
    const userProfileImg = document.getElementById("user-profile-img");
    userProfileImg.src = user.profilePicture || "assets/img/iconUser.png";
  } catch (error) {
    console.error("Error al cargar la imagen de perfil del usuario:", error);
  }
};

window.addEventListener("load", loadUserProfileImage);

export { loadUserProfileImage };
