const express = require("express");
const wordRoutes = require("./routes/words");
const authRoutes = require("./routes/auth");
const userWordRoutes = require("./routes/userWords");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/words", wordRoutes);
app.use("/auth", authRoutes);
app.use("/userwords", userWordRoutes);

module.exports = app;

