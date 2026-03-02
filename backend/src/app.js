const express = require("express");
const { app, server } = require("./services/socket");
require("dotenv").config();

const connectDB = require("./database/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

connectDB();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ CORS: dev = localhost, production = allow deployed origin
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
    credentials: true,
  }),
);

const ROOT_DIR = path.resolve();

// Routes
const authRoute = require("./routes/authRoute");
const messageRoute = require("./routes/messageRoute");

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(ROOT_DIR, "../frontend/dist");

  app.use(express.static(distPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
