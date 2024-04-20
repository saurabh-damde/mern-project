const multer = require("multer");
const { v1 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/png": "png",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  limits: 1000000,
  storage: multer.diskStorage({
    destination: (req, file, call) => {
      call(null, "uploads/images");
    },
    filename: (req, file, call) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      call(null, v1() + "." + ext);
    },
  }),
  fileFilter: (req, file, call) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid MIME type!");
    call(error, isValid);
  },
});

module.exports = fileUpload;
