const Professional = require("../models/professional.model");
const Appointment = require("../models/appointment.model");


exports.getAppointments = async (req, res) => {
  try {
    const professional = await Professional.findOne({ user: req.user._id });
    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }

    const appointments = await Appointment.find({ professional: professional._id })
      .populate("patient", "name email")
      .populate("professional", "user score");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.listProfessionals = async (req, res) => {
  try {
    const pros = await Professional.find().populate("user", "name email");

    const formatted = await Promise.all(
      pros.map(async (p) => {
        const appointmentsCount = await Appointment.countDocuments({
          professional: p._id,
          status: "booked",
        });

        const score = calculateScore(p.availabilities, appointmentsCount);

        return {
          _id: p._id,
          name: p.user.name,
          email: p.user.email,
          score,
          availabilities: p.availabilities,
          appointmentsCount,
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfessionalById = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id)
      .populate("user", "name email");
    if (!professional) return res.status(404).json({ message: "Professional not found" });
    const appointments = await Appointment.find({
      professional: professional._id,
      date: { $gte: new Date() },
      status: "booked"
    });

    const bookedSlots = appointments.map(a => ({
      date: a.date.toISOString(),
      slot: a.slot
    }));

    const availabilities = professional.availabilities.map(a => ({
      date: a.date,
      slots: a.slots.filter(
        slot => !bookedSlots.some(b => b.date === a.date.toISOString() && b.slot === slot)
      )
    }));

    res.json({
      _id: professional._id,
      user: professional.user,
      score: professional.score,
      availabilities
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAvailabilities = async (req, res) => {
  try {
    const professional = await Professional.findOne({ user: req.user._id });
    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }

    res.json(professional.availabilities || []);
  } catch (err) {
    console.error("Erreur getMyAvailabilities:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.deleteAvailability = async (req, res) => {
  try {
    const professional = await Professional.findOne({ user: req.user._id });
    if (!professional) return res.status(404).json({ message: "Professional not found" });

    professional.availabilities = professional.availabilities.filter(
      (a) => a._id.toString() !== req.params.id
    );

    professional.score = calculateScore(professional.availabilities);

    await professional.save();
    res.json({ message: "Disponibilité supprimée", score: professional.score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateAvailability = async (req, res) => {
  const { date, slots } = req.body;
  try {
    const professional = await Professional.findOne({ user: req.user._id });
    if (!professional) return res.status(404).json({ message: "Professional not found" });

    const availability = professional.availabilities.id(req.params.id);
    if (!availability) return res.status(404).json({ message: "Disponibilité non trouvée" });

    availability.date = date;
    availability.slots = slots;

    professional.score = calculateScore(professional.availabilities);
    await professional.save();

    res.json({ message: "Disponibilité modifiée", availability, score: professional.score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const calculateScore = (availabilities, appointmentsCount = 0) => {
  if (!availabilities || availabilities.length === 0) return 50; 
  const totalSlots = availabilities.reduce((sum, a) => sum + (a.slots?.length || 0), 0);

  let score = 50 + totalSlots * 3 + appointmentsCount * 2;

  return Math.min(100, score);
};

exports.addAvailability = async (req, res) => {
  const { date, slots } = req.body;
  try {
    const professional = await Professional.findOne({ user: req.user._id });
    if (!professional) return res.status(404).json({ message: "Professional not found" });

    const existing = professional.availabilities.find(a => 
      new Date(a.date).toDateString() === new Date(date).toDateString()
    );

    if (existing) {
      existing.slots = Array.from(new Set([...existing.slots, ...slots]));
    } else {
      professional.availabilities.push({ date, slots });
    }
    professional.score = calculateScore(professional.availabilities);

    await professional.save();
    res.json(professional);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
