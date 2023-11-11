const { logger } = require("../helper");

const ORIGINS = {
  production: [
    "https://freetoolsapp.com",
    "https://productive-gpt-client.vercel.app",
    "https://aianalysis.freetoolsapp.com",
  ],
  development: [
    "https://development-alice.imssystems.tech",
    "https://productive-gpt-client.vercel.app",
    "https://aianalysis.freetoolsapp.com",
    "http://localhost:3000",
  ],
};
exports.cors = (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    const userAgent = req.headers["user-agent"];
    if (userAgent?.includes("Postman")) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      } else {
        return next();
      }
    }
  }
  /** handling properly for prod environment */
  const allowedOrigin = ORIGINS[process.env.NODE_ENV].find(
    (origin) => origin === req.headers.origin
  );
  logger.info("allowed origin: " + allowedOrigin);
  if (allowedOrigin)
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH",
  ]);
  res.setHeader("Access-Control-Allow-Headers", [
    "Content-Type",
    "Authorization",
    "x-auth-accesstoken",
    "x-auth-refreshtoken",
    "x-file-name",
    "x-register-token",
    "x-recovery-token",
  ]);
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
};
