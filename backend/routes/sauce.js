// CHECK same as backup
// TODO add routes for like in ctrlr
// TODO add routes for dislike çin ctrlr

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrlr = require("../controllers/sauce");

router.get("/", auth, sauceCtrlr.getAllSauces);
router.post("/", auth, multer, sauceCtrlr.createSauce);
router.get("/:id", auth, sauceCtrlr.getOneSauce);
router.put("/:id", auth, multer, sauceCtrlr.modifySauce);
router.delete("/:id", auth, sauceCtrlr.deleteSauce);
// router.put("/:id", auth, multer, sauceCtrlr.likeSauce);
// router.put("/:id", auth, multer, sauceCtrlr.dislikeSauce);

module.exports = router;
