const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { bookAppointment, getUserAppointments, cancelAppointment, updateAppointment} = require("../controllers/user.controller");
const { getProfessionalById } = require("../controllers/professional.controller");

router.post("/appointment",
  protect,
  authorize("user"),
  [
    check("professionalId", "Professional ID is required").not().isEmpty(),
    check("date", "Date is required").not().isEmpty(),
    check("slot", "Slot is required").not().isEmpty()
  ],
  bookAppointment
);
router.get("/appointment", protect, authorize("user"), getUserAppointments);
router.put("/cancel/:id", protect, authorize("user"), cancelAppointment);
router.get("/:id", protect, authorize("user"), getProfessionalById);
router.put("/update/:id", protect, authorize("user"), updateAppointment);

module.exports = router;