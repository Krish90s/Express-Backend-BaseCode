const express = require("express");
const router = express.Router();

const { sendotp, verifyotp } = require("../controllers/auth");

router.route("/sendotp").post(sendotp);

router.route("/verifyotp").post(verifyotp);

module.exports = router;
