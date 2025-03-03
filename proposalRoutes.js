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
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};

router.post(
  "/proposals",
  upload.fields([{ name: "pdf" }, { name: "image" }]),
  createProposal
);
router.get("/proposals", getAllProposals);
router.get("/proposals/:id", getProposalById);
router.put(
  "/proposals/:id",
  upload.fields([{ name: "pdf" }, { name: "image" }]),
  updateProposal
);
router.delete("/proposals/:id", deleteProposal);

router.use(handleError);

module.exports = router;
