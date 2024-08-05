/**
 * @file Archivo de modelo de usuario
 * @name user.model.js
 * @description Este archivo contiene el modelo de usuario.
 */

// Se importa mongoose
const mongoose = require("mongoose");

// Se crea el esquema del usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  userType: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
    required: true,
  },
  accountActivated: {
    type: Boolean,
    default: false,
  },
  activationToken: {
    type: String,
  },
  creation: { type: Date, default: Date.now() },
  googleId: String,
  registrationMethod: {
    type: String,
    enum: ["normal", "oauth"],
    default: "normal",
  },
  profilePicture: {
    type: String,
    default: "assets/img/iconUser.png",
  },
  requestPasswordChange: {
    type: Boolean,
    default: false,
  },
});

// Se crea el modelo del usuario
const User = mongoose.model("User", userSchema);

module.exports = User;
