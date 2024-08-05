const dotenv = require('dotenv');
dotenv.config();

const checkRecaptcha = async (req, res) => {
  const token = req.body.token;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
  const response = await fetch(url, {
    method: "POST"
  });
  const data = await response.json();
  return res.status(200).json(data);
}

module.exports = { checkRecaptcha };