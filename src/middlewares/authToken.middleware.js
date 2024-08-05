/**
 * @file Archivo de middleware de autenticación
 * @name authToken.middleware.js
 * @description Este archivo contiene los diferentes middlewares de autenticación.
 */

// Se importa el módulo jwt
const jwt = require("jsonwebtoken");

// Middleware para comprobar si el usuario está autenticado tanto por google como normal
const authToken = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  const token = req.cookies.jwt_token;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    //Para obtener el usuario payload.username
    if (!payload) {
      return res.status(401).send("Unauthorized");
    }
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

// Middleware para comprobar si el usuario ya está autenticado para logearse
const authToken2Login = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(401).send("The user is already logged in. Go to /miPerfil");
  }

  const token = req.cookies.jwt_token;
  if (token) {
    return res.status(401).send("The user is already logged in. Go to /miPerfil");
  }
  next();
};

// Middleware para comprobar si el usuario es administrador
const authTokenIsAdmin = (req, res, next) => {
  const token = req.cookies.jwt_token;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  const user = jwt.verify(token, process.env.JWT_KEY);

  if (user.userType === "ADMIN") {
    next();
  } else {
    return res.status(401).send("Unauthorized");
  }
};

// Middleware para comprobar si el usuario no es administrador
const authTokenIsNotAdmin = (req, res, next) => {
  const stripeToken = req.query.token;

  if (stripeToken || req.isAuthenticated() || req.cookies["connect.sid"]) {
    return next();
  }

  const token = req.cookies.jwt_token;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  const user = jwt.verify(token, process.env.JWT_KEY);

  if (user.userType !== "ADMIN") {
    return next();
  } else {
    return res.status(401).send("Unauthorized");
  }
};

module.exports = { authToken, authToken2Login, authTokenIsAdmin, authTokenIsNotAdmin };
