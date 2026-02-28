const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

app.set("trust proxy", 1);

/* ---------- ENV VALIDATION ---------- */
if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL not defined in env");
}

/* ---------- SECURITY MIDDLEWARE ---------- */
app.use(helmet());

/* ---------- CORS ---------- */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* ---------- LOGGING ---------- */
app.use(morgan("dev"));

/* ---------- BODY PARSER ---------- */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/* ---------- COOKIES ---------- */
app.use(cookieParser());

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
// CHANGE: Mount directly to /api so the routes file handles the rest
app.use("/api", musicRoutes); 

/* ---------- 404 HANDLER ---------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------- GLOBAL ERROR HANDLER ---------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;