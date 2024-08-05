/**
 * @file Archivo de controladores de usuario
 * @name user.controller.js
 * @description Este archivo contiene los controladores de usuario.
 */

// Se importan los módulos y el modelo de usuario
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const userDb = require("../models/user.model");
const fs = require("fs");
const { sendEmail } = require("./email.controller");

// Metodo encargado de obtener todos los usuarios
const getAllUsers = async (req, res) => {
  const users = await userDb.find();

  if (users.length === 0) return res.status(404).send("No se han encontrado usuarios");

  return res.status(200).json(users);
};

//Metodo encargado de obtener un usuario por su token
const getUserByToken = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user;
      return res.status(200).json(user);
    } else {
      const token = req.cookies.jwt_token;

      const decoded = jwt.verify(token, process.env.JWT_KEY);

      const user = await userDb.findOne({ username: decoded.username });
      return res.status(200).json(user);
    }
  } catch (error) {
    console.error("Error obteniendo la info del usuario:", error);
    return res
      .status(500)
      .json({ message: "Error obteniendo la info del usuario", error: error.message });
  }
};

const sendPasswordResetRequest = async (req, res) => {
  const email = req.body.email;
  const user = await userDb.findOne({ email });

  if (!user) {
    console.log("No se ha encontrado el usuario");
  }

  user.requestPasswordChange = true;
  await user.save();

  const passwordResetUrl = `${process.env.PROD_URL}/api/user/resetPassword/${user._id.toString()}`;
  const emailContent = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; text-align: center;">
    <h2>Restablecimiento de Contraseña</h2>
    <p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el botón de abajo para cambiar tu contraseña:</p>
    <a href="${passwordResetUrl}" style="display: inline-block; margin: 20px auto; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
    <p>O puedes copiar y pegar el siguiente enlace en tu navegador:</p>
    <p><a href="${passwordResetUrl}" style="color: #4CAF50;">${passwordResetUrl}</a></p>
    <p>Si no has solicitado restablecer tu contraseña, ignora este correo.</p>
    <p>Atentamente,<br>El equipo de FlickFusion</p>
  </div>
`;
  await sendEmail(user.email, "Reset password", emailContent);

  res
    .status(200)
    .send(
      "Si el email introducido es correcto, recibirás un correo con las instrucciones para restablecer tu contraseña"
    );
};

//Metodo encargado de obtener un usuario por su usuario estricto
const getUserByNameStricted = async (req, res) => {
  const username = req.body.username;
  const usernameInDB = await userDb.findOne({ username });
  if (!usernameInDB) {
    return res.status(404).send("Usuario no encontrado");
  } else {
    return res.status(200).json(usernameInDB);
  }
};

//Metodo encargado de obtener un usuario por su usuario no estricto
const getUserByNameNonStricted = async (req, res) => {
  const username = req.body.username;
  const regex = new RegExp("^" + username, "i");
  const usernameInDB = await userDb.find({ username: { $regex: regex } });
  if (usernameInDB.length === 0) {
    return res.status(404).send("Usuario no encontrado");
  } else {
    return res.status(200).json(usernameInDB);
  }
};

//Metodo encargado de registrar un usuario
const register = async (req, res) => {
  //Se obtienen del body el usuario y contraseña introducidos por el usuario
  const { username, password, email, confirmedPassword } = req.body;
  if (
    username === undefined ||
    password === undefined ||
    email === undefined ||
    confirmedPassword === undefined
  ) {
    res.status(400).send("Todos los campos son obligatorios");
    return;
  }

  //Si no coinciden las contraseñas, se envía un mensaje de error
  if (password !== confirmedPassword) {
    res.status(400).send("Las contraseñas no coinciden");
    return;
  }

  try {
    //Se busca si en la base de datos el usuario ya existe
    const userbyNameInDB = await userDb.findOne({ username });

    //Si el usuario ya existe, se envía un mensaje de error
    if (userbyNameInDB) {
      res.status(409).send("El usuario es invalido!");
      return;
    }

    //Se busca si en la base de datos el email ya existe
    const userbyEmailInDB = await userDb.findOne({ email });
    if (userbyEmailInDB) {
      res.status(409).send("El email es invalido!");
      return;
    }

    //Si el usuario no existe, se encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(20).toString("hex");

    //Se crea un nuevo usuario con el usuario y la contraseña encriptada
    const newUser = new userDb({ username, email, password: hashedPassword, activationToken });

    //Se guarda el nuevo usuario en la base de datos
    await newUser.save();

    const activationUrl = `${process.env.PROD_URL}/api/user/activate/${activationToken}`;
    const emailContent = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; text-align: center;">
        <h2>Activación de Cuenta</h2>
        <p>Gracias por registrarte. Por favor, haz clic en el botón de abajo para activar tu cuenta:</p>
        <a href="${activationUrl}" style="display: inline-block; margin: 20px auto; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Activar Cuenta</a>
        <p>O puedes copiar y pegar el siguiente enlace en tu navegador:</p>
        <p><a href="${activationUrl}" style="color: #4CAF50;">${activationUrl}</a></p>
        <p>Si no te has registrado en nuestro sitio, ignora este correo.</p>
        <p>Atentamente,<br>El equipo de FlickFusion</p>
      </div>
    `;
    await sendEmail(newUser.email, "Account Activation", emailContent);
    res.status(201).json({
      message:
        "Usuario registrado, revisa el correo y sigue las instrucciones para activar la cuenta",
    });
  } catch (error) {
    console.log("Algo ha ido mal durante el registro: ", error);
    return res.status(500).json({ error: "Algo ha ido mal durante el registro" });
  }
};

/**
 * Genera un nuevo token JWT para un usuario específico.
 *
 * @param {*} data Usuario para el que se genera el token.
 * @returns {import("jsonwebtoken").Jwt} Token JWT.
 */
const createToken = (data) => {
  const opciones = {
    expiresIn: "5h",
  };
  const token = jwt.sign(data, process.env.JWT_KEY, opciones);
  return token;
};

//Metodo encargado de activar la cuenta de un usuario
const login = async (req, res) => {
  //Se obtienen del body el usuario y contraseña introducidos por el usuario
  const { username, password } = req.body;

  try {
    //Se busca en la base de datos el usuario que coincida con el username introducido
    const user = await userDb.findOne({ username: username });

    //Si no se encuentra el usuario, se envía un mensaje de error
    if (!user) {
      res.status(401).send("Credenciales incorrectas");
      return;
    }

    //Si se encuentra un usuario se compara la contraseña introducida con la contraseña almacenada en la base de datos
    const pass = await bcrypt.compare(password, user.password);

    //Si las contraseñas no coinciden, se envía un mensaje de error
    if (!pass) {
      res.status(401).send("Credenciales incorrectas");
      return;
    }

    if (!user.accountActivated) {
      res.status(452).send("Cuenta no activada");
      return;
    }

    const token = createToken({ username, userType: user.userType });

    res.cookie("jwt_token", token, { httpOnly: true, sameSite: "Strict" });

    //Si las contraseñas coinciden, se envía el usuario
    res.status(200).json(user);
  } catch (error) {
    console.log("Algo ha ido mal durante el inicio de sesion: ", error);
    res.status(500).send("Algo ha ido mal durante el inicio de sesion");
  }
};

//Metodo encargado de cerrar la sesión de un usuario
const logout = async (req, res) => {
  res.clearCookie("jwt_token");
  res.status(200).send("El usuario ha cerrado la sesión");
};

//Metodo encargado de borrar un usuario por su id
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await userDb.findById(id);

  if (!user) {
    return res.status(404).send("Usuario no encontrado");
  }

  if (user.userType === "ADMIN") {
    return res.status(403).send("No puedes borrar un usuario administrador");
  }

  await userDb.findByIdAndDelete(id);

  return res.status(204).send();
};

//Metodo encargado de obtener el tipo de cookies
const getTypeOfCookies = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (cookies["connect.sid"]) {
      res.status(200).json({ type: "oauth" });
    } else if (cookies["jwt_token"]) {
      res.status(200).json({ type: "jwt" });
    }
  } catch (e) {
    console.error("Error obteniendo la información del usuario:", error);
    res
      .status(500)
      .json({ message: "Error obteniendo la información del usuario", error: error.message });
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const username = req.query.username;

    const user = await userDb.findOne({ username });

    await deletePFP(user);

    res.status(200).send("Foto de perfil eliminada correctamente");
  } catch (error) {
    res.status(500).send("Error eliminando la foto de perfil:", error);
  }
};

const deletePFP = async (user) => {
  const path2Remove = path.join(__dirname, "../../public", user.profilePicture);
  if (user.profilePicture !== "assets/img/iconUser.png") {
    fs.unlink(path2Remove, (err) => {
      if (err) {
        console.log("Error borrando la foto de perfil anterior:", err);
      }
    });
  }
  user.profilePicture = "assets/img/iconUser.png";
  await user.save();
};

const changeProfilePicture = async (req, res) => {
  const username = req.body.username;
  const user = await userDb.findOne({ username });
  const image = req.file;
  if (!image) {
    return res.status(400).send("No se ha subido ninguna imagen");
  }

  try {
    await deletePFP(user);

    user.profilePicture = `assets/uploads/${image.fieldname}-${user.username}${path.extname(
      image.originalname
    )}`;

    await user.save();

    return res.status(200).send("Foto de perfil cambiada correctamente");
  } catch (error) {
    return res.status(500).send("Error cambiando la foto de perfil:", error);
  }
};

const resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;
  const user = await userDb.findOne({ _id: token });

  if (!user) {
    return res.status(404).send("Usuario no encontrado");
  }

  if (user.requestPasswordChange === false) {
    return res.status(401).send("Unauthorized");
  }

  if (password !== confirmPassword) {
    return res.status(400).send("Las contraseñas no coinciden");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.requestPasswordChange = false;
  await user.save();
  return res.status(200).send("Contraseña cambiada correctamente");
};

const showResetPasswordForm = async (req, res) => {
  const token = req.params.id;

  const user = await userDb.findOne({ _id: token });

  if (user.requestPasswordChange === false) {
    return res.status(401).send("Unauthorized");
  }

  res.render("resetPassword", { token });
};

const updatePassword = async (req, res) => {
  const { currentPass, newPass, confirmNewPass, user } = req.body;
  const pass = await bcrypt.compare(currentPass, user.password);

  const userOnDb = await userDb.findOne({ username: user.username });

  if (!pass) {
    return res.status(401).send("Credenciales incorrectas");
  }

  if (newPass !== confirmNewPass) {
    return res.status(400).send("Las contraseñas no coinciden");
  }

  const hashedPassword = await bcrypt.hash(newPass, 10);
  userOnDb.password = hashedPassword;
  await userOnDb.save();

  return res.status(200).send("Contraseña cambiada correctamente");
};

module.exports = {
  getAllUsers,
  register,
  login,
  deleteUser,
  getUserByNameStricted,
  getUserByNameNonStricted,
  logout,
  getTypeOfCookies,
  getUserByToken,
  deleteProfilePicture,
  changeProfilePicture,
  sendPasswordResetRequest,
  resetPassword,
  showResetPasswordForm,
  updatePassword,
};
