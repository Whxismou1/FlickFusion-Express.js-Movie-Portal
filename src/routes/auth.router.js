/**
 * @file Archivo de rutas de autenticación de passport para la conexion con Google
 * @name auth.router.js
 * @description Este archivo contiene las rutas de autenticación de passport para la conexión con Google.
 */

// Se importan los módulos
const express = require("express");
const passport = require("passport");
const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

// Ruta para iniciar sesión con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

// Ruta de callback para Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.PROD_URL,
  }),
  (req, res) => {
    // Redirigir al perfil del usuario después de iniciar sesión
    res.redirect(process.env.PROD_URL + "/paginaPrincipal");
  }
);

// Ruta de cierre de sesión
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error al desconectar al usuario:", err);
      res.status(500).send("Error al cerrar sesión");
    } else {
      req.session.destroy((err) => {
        // Destruye la sesión
        if (err) {
          console.error("Error al destruir la sesión:", err);
          res.status(500).send("Error al cerrar sesión");
        } else {
          // Borra la cookie de sesión
          res.clearCookie("connect.sid");
          // Redirige a la página de inicio de sesion
          res.redirect("/");
        }
      });
    }
  });
});

//se exporta el modulo
module.exports = router;
