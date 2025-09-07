const Appointment = require("../models/appointment.model");
const Professional = require("../models/professional.model");

exports.bookAppointment = async (req, res) => {
  const { professionalId, date, slot } = req.body;

  try {
    // Vérifier que le créneau n'est pas déjà réservé
    const existing = await Appointment.findOne({
      professional: professionalId,
      date,
      slot,
      status: "booked"
    });

    if (existing) {
      return res.status(400).json({ message: "Ce créneau est déjà réservé." });
    }
    const appointment = await Appointment.create({
      patient: req.user._id,
      professional: professionalId,
      date,
      slot,
      status: "booked"
    });
    await Professional.updateOne(
      { _id: professionalId },
      { $pull: { "availabilities.$[d].slots": slot } },
      { arrayFilters: [{ "d.date": new Date(date) }] }
    );

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({
        path: "professional",
        populate: { path: "user", select: "name" } 
      })
      .populate("patient", "name email");
    const formattedAppointments = appointments.map(app => ({
      _id: app._id,
      professional: {
        user: {
          name: app.professional?.user?.name ?? "Pro"
        },
        score: app.professional?.score ?? 50
      },
      patient: {
        name: app.patient?.name,
        email: app.patient?.email
      },
      date: app.date,
      slot: app.slot,
      status: app.status
    }));

    res.json(formattedAppointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Not found" });
    if (appointment.patient.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    appointment.status = "canceled";
    await appointment.save();
    res.json({ message: "Appointment canceled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { date, slot } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate("professional");

    if (!appointment) return res.status(404).json({ message: "Not found" });
    if (appointment.patient.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    const existing = await Appointment.findOne({
      professional: appointment.professional._id,
      date,
      slot,
      status: "booked"
    });
    if (existing) return res.status(400).json({ message: "Ce créneau est déjà réservé." });

    await Professional.updateOne(
      { _id: appointment.professional._id },
      { $pull: { "availabilities.$[d].slots": slot } },
      { arrayFilters: [{ "d.date": new Date(date) }] }
    );
    await Professional.updateOne(
      { _id: appointment.professional._id },
      { $push: { "availabilities.$[d].slots": appointment.slot } },
      { arrayFilters: [{ "d.date": new Date(appointment.date) }] }
    );

    appointment.date = date;
    appointment.slot = slot;
    await appointment.save();

    res.json({ message: "Appointment updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
