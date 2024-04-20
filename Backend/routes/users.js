const { Router } = require("express");
const { check } = require("express-validator");
const users = require("../controllers/users");
const fileUpload = require("../middleware/file-upload");

const router = Router();

router.get("/", users.getUsers);
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  users.signup
);
router.post("/login", users.login);

module.exports = router;
