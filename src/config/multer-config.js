const multer = require("multer");
const path = require("path");

const MYMETYPES = ["image/jpeg", "image/png", "image/jpg"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/assets/uploads"));
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const username = req.query.username || req.body.username;
    const fileName = `${file.fieldname}-${username}${fileExtension}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (MYMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("El formato de archivo es incompatible"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1000000, // 1MB
  },
});

module.exports = upload;
