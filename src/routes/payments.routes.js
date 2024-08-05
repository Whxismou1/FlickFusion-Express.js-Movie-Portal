/**
 * @file Archivo de rutas de pagos
 * @name payments.routes.js
 * @description Este archivo contiene todas las rutas relacionadas con los pagos de la aplicación.
 */

// Se importan los módulos
const express = require("express");
const authMid = require("../middlewares/authToken.middleware");
const dotenv = require("dotenv");
dotenv.config();

// Se importan los controladores
const paymentController = require("../controllers/payments.controller");

//Se obtiene el router
const router = express.Router();

//Ruta para crear una sesión de pago
router.post("/create-checkout-session", authMid.authToken, paymentController.createSession);

//Ruta para redirigir al usuario en caso de éxito
router.get("/success", (req, res) => {
  const token = req.query.token;
  const redirectUrl = `${process.env.PROD_URL}/miPerfil?success=suc&token=${token}`;
  res.redirect(redirectUrl);
});

//Ruta para redirigir al usuario en caso de cancelación
router.get("/cancel", (req, res) => {
  const token = req.query.token;
  const redirectUrl = `${process.env.PROD_URL}/miPerfil?success=can&token=${token}`;
  res.redirect(redirectUrl);
});

module.exports = router;
