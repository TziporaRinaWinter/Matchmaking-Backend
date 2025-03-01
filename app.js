const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const proposalRoutes = require("./proposalRoutes");
const { initGridFS } = require("./proposalController");
const app = express();

const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;
conn.once("open", () => {
  initGridFS(conn);
});

app.use(express.json());
app.use("/proposals", proposalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
