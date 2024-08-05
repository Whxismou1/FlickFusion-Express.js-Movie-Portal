/**
 * @file Archivo de controladores de pagos
 * @name payments.controller.js
 * @description Este archivo contiene los controladores de pagos.
 */

// Se importa el módulo Stripe, dotenv y la api de stripe
const Stripe = require("stripe");
const env = require("dotenv");
env.config();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY);

/**
 * Metodo encargado de crear una sesión de pago
 * @param {*} req
 * @param {*} res
 */
const createSession = async (req, res) => {
  const token = req.cookies.jwt_token;

  const films = Array.isArray(req.body) ? req.body : [req.body];
  const lineItems = films.map((film) => ({
    price_data: {
      product_data: {
        name: film.title,
        description: film.original_language,
      },
      currency: "usd",
      unit_amount: 700,
    },
    quantity: 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.PROD_URL}/payments/success?token=${token}`,
      cancel_url: `${process.env.PROD_URL}/payments/cancel?token=${token}`,
    });

    res.json(session);
  } catch (error) {
    console.error("Error creando sesión de compra: ", error);
    res.status(500).json({ message: "Algo ha ido mal:", error: error.message });
  }
};

module.exports = {
  createSession,
};
