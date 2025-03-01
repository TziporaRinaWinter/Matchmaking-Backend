const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
} = require("./proposalController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.fields([{ name: "pdf" }, { name: "image" }]),
  createProposal
);
router.get("/", getAllProposals);
router.get("/:id", getProposalById);
router.put(
  "/:id",
  upload.fields([{ name: "pdf" }, { name: "image" }]),
  updateProposal
);
router.delete("/:id", deleteProposal);

module.exports = router;
