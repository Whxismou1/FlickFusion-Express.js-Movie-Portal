/**
 * @file Archivo principal de la aplicación
 * @name app.js
 * @description Este archivo es el punto de entrada principal de la aplicación. Aquí se configuran las rutas, middlewares y se inicia el servidor.
 */

// Se importan los módulos
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const db = require("./controllers/db.controller");
const userRouters = require("./routes/user.router");
const frontRouter = require("./routes/frontend.router");
const authRouter = require("./routes/auth.router");
const recaptchaRouter = require("./routes/recaptcha.router");
const session = require("express-session");
const paymentRoutes = require("./routes/payments.routes");
const filmsRouter = require("./routes/multimedia.router");
const path = require("path");
const fs = require("fs");

require("./config/passport-setup");

/**
 * @function startWebApp
 * @description Función asíncrona que inicia la aplicación web. Configura los middlewares, rutas, carga la base de datos y arranca el servidor.
 */
const startWebApp = async () => {
  // Se crea una instancia de la aplicación
  const app = express();
  // Configurar los middlewares de json, cors y cookies
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.set("view engine", "ejs");
  // Se configura la sesión de usuario
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );

  // Se configura el middleware de passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Se cargan las variables de entorno
  dotenv.config();
  app.use("/recaptcha", recaptchaRouter);

  // Se configura las rutas de usuario
  app.use("/api/user/", userRouters);

  // Se configuran las rutas de autenticación de google
  app.use("/auth", authRouter);

  // Se configuran las rutas del front
  app.use("/", frontRouter);

  // Se configuran las rutas de los pagos
  app.use("/payments", paymentRoutes);

  // Se configuran las rutas de los archivos multimedia
  app.use("/api/multimedia/", filmsRouter);

  //se crea la conexión a la base de datos
  await db.createConnection();

  const uploadsDir = path.join(__dirname, "../public/assets/uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Se inicia el servidor en el puerto especificado en las variables de entorno(3000)
  app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on web ${process.env.PROD_URL}`);
  });
};

// Se inicia la aplicación
startWebApp();
