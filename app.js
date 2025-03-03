const express = require("express");
const proposalRoutes = require("./proposalRoutes.js");
const { initGridFS } = require("./proposalController.js");
const db = require("./db.js");
const app = express();

db.connect()
  .then((conn) => {
    conn.once("open", () => {
      initGridFS(conn);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

app.use(express.json());
app.use("/proposals", proposalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
