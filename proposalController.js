const Proposal = require("../models/Proposal");
const Grid = require("gridfs-stream");
const fs = require("fs");
const mongoose = require("mongoose");

let gfs;

const initGridFS = (conn) => {
  gfs = Grid(conn.db, mongoose.mongo);
};

const createProposal = async (req, res) => {
  const { name, yeshiva, shadchan, details, notes, id } = req.body;

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
    res.status(500).send("Error saving proposal");
  }
};

const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find();
    res.send(proposals);
  } catch (err) {
    res.status(500).send("Error retrieving proposals");
  }
};

const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).send("Proposal not found");
    }
    res.send(proposal);
  } catch (err) {
    res.status(500).send("Error retrieving proposal");
  }
};

const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).send("Proposal not found");
    }

    proposal.name = req.body.name || proposal.name;
    proposal.yeshiva = req.body.yeshiva || proposal.yeshiva;
    proposal.shadchan = req.body.shadchan || proposal.shadchan;
    proposal.details = req.body.details || proposal.details;
    proposal.notes = req.body.notes || proposal.notes;

    await proposal.save();

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
    res.status(500).send("Error updating proposal");
  }
};

const deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndDelete(req.params.id);
    if (!proposal) {
      return res.status(404).send("Proposal not found");
    }

    await gfs.files.deleteMany({ proposalId: proposal._id });

    res.send({ message: "Proposal deleted successfully" });
  } catch (err) {
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
