/**
 * @file Archivo de configuración de passport
 * @name passport-setup.js
 * @description Este archivo contiene la configuración de passport para la autenticación con Google.
 */

// Se importan los módulos passport y passport-google-oauth20, el modelo de usuario y dotenv
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userDB = require("../models/user.model");
const dotenv = require("dotenv");

dotenv.config();

// Configuración de la estrategia de autenticación con Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_GOOGLE_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userDB.findOne({ googleId: profile.id });

        if (!user) {
          //Creamos el usuario en la base de datos
          user = new userDB({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            //password null porque se logea por oauth
            password: null,
            registrationMethod: "oauth",
            accountActivated: true,
          });

          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Serializar el usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar el usuario desde la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userDB.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = passport;
