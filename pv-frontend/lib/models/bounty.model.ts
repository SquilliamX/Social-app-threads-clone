import mongoose from "mongoose";

const bountySchema = new mongoose.Schema({
  text: {type: String, required: true},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bounty",
  }]
});

const Bounty = mongoose.models.Bounty || mongoose.model("Bounty", bountySchema);

export default Bounty;