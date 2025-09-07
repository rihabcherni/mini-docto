const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional", required: true },
  date: { type: Date, required: true },
  slot: { type: String, required: true }, 
  status: { type: String, enum: ["booked", "canceled"], default: "booked" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
