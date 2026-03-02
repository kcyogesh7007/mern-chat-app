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
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
const ROOT_DIR = path.resolve();

const authRoute = require("./routes/authRoute");
const messageRoute = require("./routes/messageRoute");

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(ROOT_DIR, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(ROOT_DIR, "../frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
