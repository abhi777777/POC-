const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

function createExpressApp(apiRoot, routes) {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api", routes);

  return app;
}

module.exports = createExpressApp;
