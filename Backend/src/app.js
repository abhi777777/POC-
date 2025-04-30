const expressService = require("./services/express");
const apiRouter = require("./api");
const config = require("./config");

const app = expressService("/api", apiRouter);
module.exports = app;
