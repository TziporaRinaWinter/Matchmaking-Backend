const Proposal = require("./Proposal");
const Grid = require("gridfs-stream");
const fs = require("fs");
const mongoose = require("mongoose");

let gfs;

const initGridFS = (conn) => {
  gfs = Grid(conn.db, mongoose.mongo);
};

// create new proposal
const createProposal = async (req, res) => {
  const { name, yeshiva, shadchan, details, notes, id } = req.body;
  console.log("Creating proposal:", name, yeshiva, shadchan);

  const newProposal = new Proposal({
    name,
    yeshiva,
    shadchan,
    details,
    notes,
    id,
  });

  try {
    const savedProposal = await newProposal.save();

    if (req.files["pdf"]) {
      const writestream = gfs.createWriteStream({
        filename: req.files["pdf"][0].originalname,
        content_type: req.files["pdf"][0].mimetype,
        proposalId: savedProposal._id,
      });
      fs.createReadStream(req.files["pdf"][0].path).pipe(writestream);
    }

    if (req.files["image"]) {
      const writestream = gfs.createWriteStream({
        filename: req.files["image"][0].originalname,
        content_type: req.files["image"][0].mimetype,
        proposalId: savedProposal._id,
      });
      fs.createReadStream(req.files["image"][0].path).pipe(writestream);
    }

    res.send({
      message: "Proposal saved successfully",
      id: savedProposal._id,
    });
  } catch (err) {
    console.error("Error saving proposal:", err);
    res.status(500).send("Error saving proposal");
  }
};

// get all proposals
const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find();
    res.send(proposals);
  } catch (err) {
    console.error("Error retrieving proposals:", err);
    res.status(500).send("Error retrieving proposals");
  }
};

// get proposal by ID
const getProposalById = async (req, res) => {
  const { id } = req.params;
  try {
    const proposal = await Proposal.findById(id);
    console.log("===================", proposal);
    if (!proposal) {
      return res.status(404).send("Proposal not found");
    }
    console.log("before files");
    const files = await gfs.files.find({ proposalId: proposal._id }).toArray();
    console.log("after files");
    res.send({ ...proposal.toObject(), files });
  } catch (err) {
    console.error("Error retrieving proposal:", err);
    res.status(500).send("Error retrieving proposal");
  }
};

// update proposal
const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params._id);
    if (!proposal) {
      return res.status(404).send("Proposal not found");
    }
    console.log("++++++++++++++++", proposal);
    proposal.name = req.body.name || proposal.name;
    proposal.yeshiva = req.body.yeshiva || proposal.yeshiva;
    proposal.shadchan = req.body.shadchan || proposal.shadchan;
    proposal.details = req.body.details || proposal.details;
    proposal.notes = req.body.notes || proposal.notes;

    await proposal.save();
    console.log("before files");
    console.log(req.files);

    if (req.files["pdf"]) {
      const writestream = gfs.createWriteStream({
        filename: req.files["pdf"][0].originalname,
        content_type: req.files["pdf"][0].mimetype,
        proposalId: proposal._id,
      });
      fs.createReadStream(req.files["pdf"][0].path).pipe(writestream);
    }

    if (req.files["image"]) {
      const writestream = gfs.createWriteStream({
        filename: req.files["image"][0].originalname,
        content_type: req.files["image"][0].mimetype,
        proposalId: proposal._id,
      });
      fs.createReadStream(req.files["image"][0].path).pipe(writestream);
    }

    res.send({ message: "Proposal updated successfully" });
  } catch (err) {
    console.error("Error updating proposal:", err);
    res.status(500).send("Error updating proposal");
  }
};

// delete proposal
const deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndDelete(req.params._id);
    if (!proposal) {
      return res.status(404).send("Proposal not found");
    }

    await gfs.files.deleteMany({ proposalId: proposal._id });

    res.send({ message: "Proposal deleted successfully" });
  } catch (err) {
    console.error("Error deleting proposal:", err);
    res.status(500).send("Error deleting proposal");
  }
};

module.exports = {
  initGridFS,
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
};
