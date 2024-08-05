const express = require('express');

const recaptchaRouter = express.Router();
const recaptchaController = require('../controllers/recaptcha.controller');

recaptchaRouter.post("/check", recaptchaController.checkRecaptcha);


module.exports = recaptchaRouter;