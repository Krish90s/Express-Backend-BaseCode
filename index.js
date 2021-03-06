require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");
var cors = require("cors");
const errorHandler = require("./middleware/error");
// Connect DB

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/private", require("./routes/private"));

// Error handle should be the last middleware

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error : ${err}`);
  server.close(() => process.exit(1));
});
