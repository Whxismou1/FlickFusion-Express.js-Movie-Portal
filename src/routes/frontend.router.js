/**
 * @file Archivo de rutas de la aplicación web
 * @name frontend.router.js
 * @description Este archivo contiene las rutas del frontend de la aplicación web.
 */

// Se importan los módulos
const path = require("path");
const express = require("express");

// Se importan los middlewares
const authToken = require("../middlewares/authToken.middleware");

// Ruta base del frontend
const frontend_base_url = path.join(__dirname, "/../../public");

const router = express.Router();

//Ruta a la pagina principal (login)
router.use("/", express.static(frontend_base_url));

router.use("/forgotPassword", express.static(path.join(frontend_base_url, "assets/html/forgotPassword.html")));


//Ruta a la cesta
router.use(
  "/cesta",
  authToken.authTokenIsNotAdmin,
  express.static(path.join(frontend_base_url, "assets/html/cesta.html"))
);

//Ruta a la pagina del perfil de usuario
router.use(
  "/miPerfil",
  authToken.authTokenIsNotAdmin,
  express.static(path.join(frontend_base_url, "assets/html/miPerfil.html"))
);

//Ruta a la pagina principal de administrador
router.use(
  "/adminPanel",
  authToken.authTokenIsAdmin,
  express.static(path.join(frontend_base_url, "assets/html/adminPanel.html"))
);

//Ruta a la pagina de politica de privacidad
router.use(
  "/privacyPolicy",
  authToken.authTokenIsNotAdmin,
  express.static(path.join(frontend_base_url, "assets/html/privacyPolicy.html"))
);

//Ruta a la pagina de informacion de peliculas
router.use(
  "/showInfo:id",
  authToken.authTokenIsNotAdmin,
  express.static(path.join(frontend_base_url, "assets/html/showInfo.html"))
);

//Ruta a la pagina de registro
router.use("/signUp", express.static(path.join(frontend_base_url, "assets/html/signUp.html")));

//Ruta a la pagina principal
router.use(
  "/paginaPrincipal",
  authToken.authTokenIsNotAdmin,
  express.static(path.join(frontend_base_url, "assets/html/paginaPrincipal.html"))
);

//Ruta a la pagina de informacion sobre nosotros
router.use(
  "/aboutUs",
  authToken.authTokenIsNotAdmin,
  express.static(path.join(frontend_base_url, "assets/html/aboutUs.html"))
);

//Ruta a la pagina de preguntas frecuentes
router.use(
  "/FAQ",
  authToken.authTokenIsNotAdmin,
  express.static(path.join(frontend_base_url, "assets/html/FAQ.html"))
);

//Ruta a la pagina de terminos de uso
router.use(
  "/termsOfUse",
  authToken.authTokenIsNotAdmin,
  express.static(path.join(frontend_base_url, "assets/html/termsOfUse.html"))
);

//Ruta a la pagina de añadir pelicula
router.use(
  "/anyadirPelicula",
  authToken.authTokenIsAdmin,
  express.static(path.join(frontend_base_url, "assets/html/anyadirPelicula.html"))
);

//Ruta a la pagina de explorar
router.use(
  "/explorar",
  authToken.authTokenIsNotAdmin,
  express.static(path.join(frontend_base_url, "assets/html/explorar.html"))
);

module.exports = router;
