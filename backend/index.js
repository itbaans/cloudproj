const express = require("express");
const cors = require("cors");
// require('dotenv').config();
const logger = require('./utils/logger');

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");
const profileRoutes = require("./routes/profile");

const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // your frontend dev port
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/note", noteRoutes);
app.use("/user", profileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Backend server running on http://localhost:${PORT}`);
});
