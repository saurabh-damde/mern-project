const { Router } = require("express");
const { check } = require("express-validator");
const places = require("../controllers/places");
const fileUpload = require("../middleware/file-upload");
const authCheck = require("../middleware/auth-check");

const router = Router();

router.get("/:id", places.getPlaceById);
router.get("/user/:id", places.getPlacesByUserId);
router.use(authCheck);
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 10 }),
    check("address").not().isEmpty(),
  ],
  places.createPlace
);
router.patch(
  "/:id",
  [check("title").not().isEmpty(), check("description").isLength({ min: 10 })],
  places.updatePlace
);
router.delete("/:id", places.deletePlace);

module.exports = router;
