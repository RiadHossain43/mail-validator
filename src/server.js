require("dotenv").config();
const express = require("express");
const { connectDataBase } = require("./.config/databaseManager");
const { cors } = require("./common/middleware/cors");
const app = express();
const { errorHandler } = require("./common/middleware/errorHandler");
const { logRequest } = require("./common/middleware/logRequest");
const {
  actionOnUnhandled,
} = require("./common/helper/error/unhandledRejections");
const { formatResponse } = require("./common/middleware/formatResponse");
const { secureQuery } = require("./common/middleware/sequreQuery");
const cookieParser = require("cookie-parser");
const upload = require("express-fileupload");
const userDeserialization = require("./common/middleware/userDeserialization");
const { logger } = require("./common/helper");
// Connect Database
connectDataBase();
// webhooks
app.use("/webhooks/stripe", require("./payments/routes/webhooks"));
// Init Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.get("/", (req, res) =>
  res.status(200).json({ message: "Active", details: {} })
);
app.use(logRequest);
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(upload());
app.use(cors);
app.use(secureQuery);
app.use(formatResponse);

// Init Schedules

// Define Routes
app.use("/api/v1/lab", require("./ai/routes/lab"));
app.use("/api/v1/accounts", require("./accounts/routes"));
app.use(userDeserialization);
app.use("/api/v1/email-manager", require("./emailvalidations/routes"));
app.use("/api/v1/chatheads", require("./chatheads/routes"));
app.use("/api/v1/chats", require("./chats/routes"));
app.use("/api/v1/conversation", require("./ai/routes"));
app.use("/api/v1/payments", require("./payments/routes"));
app.use("/api/v1/users", require("./users/routes"));
app.use("/api/v1/file-manager", require("./fileManager/routes"));

app.use(errorHandler);
function startServer() {
  const PORT = process.env.PORT || 8002;
  const httpserver = app.listen(PORT, () =>
    logger.info(`Server started on port ${PORT}`)
  );
  require("./socket").handleSocket(httpserver);
  actionOnUnhandled();
}
startServer();
