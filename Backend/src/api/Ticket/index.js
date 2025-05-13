const express = require("express");
const router = express.Router();
const controller = require("./controller");
const upload = require("../../services/multer");

// Middleware to authenticate users
router.use(controller.authenticate);
router.post("/raiseticket", upload.single("proofPdf"),controller.raiseticket);
router.post("/verify", controller.verifyTicket);

module.exports = router;
