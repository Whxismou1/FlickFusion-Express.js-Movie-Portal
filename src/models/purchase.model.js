/**
 * @file Archivo de modelo de compra
 * @name purchase.model.js
 * @description Este archivo contiene el modelo de la compra.
 */

// Se importa mongoose
const mongoose = require("mongoose");

// Se crea el esquema de la compra
const purchaseSchema = new mongoose.Schema({
  // Nombre de usuario que realizó la compra
  username: { type: String, required: true },
  // ID de la película comprada
  filmId: { type: Number, required: true, unique: true },
  // Título de la película comprada
  filmTitle: { type: String, required: true, unique: true },
  // Cantidad de películas compradas
  quantity: { type: Number, default: 1 },
  // Precio de la película
  price: { type: Number, required: true, default: 7 },
  // URL de la imagen de la película
  poster_path: { type: String, required: true },
  // Fecha de compra
  purchaseDate: { type: Date, default: Date.now },
});

// Se crea el modelo de la compra
const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
