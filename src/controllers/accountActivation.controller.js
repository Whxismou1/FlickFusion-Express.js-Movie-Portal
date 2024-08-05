/**
 * @file Archivo de controladores de activación de cuenta
 * @name accountActivation.controller.js
 *  @description Este archivo contiene el controlador de activación de cuenta.
 */

// Se importa el modelo de usuario
const userDb = require("../models/user.model");

/**
 * Metodo encargado de activar la cuenta del usuario
 * @param {*} req
 * @param {*} res
 * @returns
 */
const activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await userDb.findOne({
      activationToken: token,
    });

    if (!user) {
      res.render("accountNotActivated");
      return;
    }

    user.accountActivated = true;
    user.activationToken = undefined;
    await user.save();
    res.render("accountActivated", { username: user.username });
    return;
  } catch (error) {
    console.log("Algo ha ido mal activando la cuenta: ", error);
    res.status(500).send("Error acivando la cuenta");
  }
};

module.exports = { activateAccount };
