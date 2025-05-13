const express = require("express");
const router = express.Router();
const controller = require("./controller");
// routes routing to either register or login
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/verify", controller.verify);
router.post("/logout", controller.logout);
router.get("/profile", controller.profile);
router.get("/getStats", controller.getStats);
module.exports = router;
