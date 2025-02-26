const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
  name: String,
  yeshiva: String,
  shadchan: String,
  details: String,
  notes: String,
  id: String,
});

const Proposal = mongoose.model("Proposal", ProposalSchema);

module.exports = Proposal;
