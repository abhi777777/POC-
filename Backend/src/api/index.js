const express = require("express");
const router = express.Router();

const userRouter = require("./user/index");
const policyRouter = require("./policy/index");
const TicketRouter = require("./Ticket/index");

router.use("/users", userRouter);
router.use("/policy", policyRouter);
router.use("/Ticket", TicketRouter);

module.exports = router;
