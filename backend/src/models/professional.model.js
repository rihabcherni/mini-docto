const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, default: 50, min: 0, max: 100 },
  availabilities: [{
    date: { type: Date, required: true },
    slots: [{ type: String }] //  ["09:00", "10:00"]
  }]
}, { timestamps: true });

module.exports = mongoose.model("Professional", professionalSchema);
