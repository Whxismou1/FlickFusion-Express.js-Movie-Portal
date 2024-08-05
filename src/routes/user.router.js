/**
 * @file Archivo de rutas de usuario
 * @name user.router.js
 * @description Este archivo contiene todas las rutas relacionadas con la gestión de usuarios de la aplicación.
 */

// Se importan los módulos
const express = require("express");

// Se importan los controladores
const authToken = require("../middlewares/authToken.middleware");
const userController = require("../controllers/user.controller");
const activationController = require("../controllers/accountActivation.controller");
const uploadMult = require("../config/multer-config");
const multer = require("multer");

//Se obtiene el router
const userRouter = express.Router();

//Ruta encargada de obtener todos los usuarios
userRouter.get("/", authToken.authTokenIsAdmin, userController.getAllUsers);

//Ruta encargada de obtener un usuario por su nombre
userRouter.post("/getUserByName", authToken.authTokenIsAdmin, userController.getUserByNameStricted);

//Ruta encargada de obtener un usuario por su nombre
userRouter.post(
  "/getUserByNameNonStricted",
  authToken.authTokenIsAdmin,
  userController.getUserByNameNonStricted
);

userRouter.post("/updatePassword", authToken.authToken, userController.updatePassword);

//Ruta encargada de activar la cuenta de un usuario
userRouter.get("/activate/:token", activationController.activateAccount);

//Ruta encargada de mostrar el formulario de reseteo de contraseña
userRouter.get("/resetPassword/:id", userController.showResetPasswordForm);

//Ruta encargada de resetear la contraseña de un usuario
userRouter.post("/resetPassword", userController.resetPassword);

//Rutas encargada del registro de usuarios
userRouter.post("/register", authToken.authToken2Login, userController.register);

//Rutas encargada del login de usuarios
userRouter.post("/login", authToken.authToken2Login, userController.login);

//Rutas encargada de cerrar la sesión de un usuario
userRouter.post("/logout", authToken.authToken, userController.logout);

//Rutas encargada de borrar un usuario por su id
userRouter.delete("/delete/:id", authToken.authTokenIsAdmin, userController.deleteUser);

//Rutas encargada de obtener un usuario por su token
userRouter.get("/getUserByToken", authToken.authToken, userController.getUserByToken);

//Rutas encargada de obtener un usuario por su token
userRouter.post("/sendPasswordResetRequest", userController.sendPasswordResetRequest);

//Rutas encargada de obtener el tipo de cookies
userRouter.get("/getTypeOfCookies", authToken.authToken, userController.getTypeOfCookies);

//Rutas encargada de borrar la foto de perfil de un usuario
userRouter.delete(
  "/deleteProfilePicture",
  authToken.authToken,
  userController.deleteProfilePicture
);

//Ruta encargada para cambiar la foto de perfil
userRouter.put(
  "/changeProfilePicture",
  authToken.authToken,
  (req, res, next) => {
    uploadMult.single("profilePicture")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Error de multer
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  userController.changeProfilePicture
);

module.exports = userRouter;
