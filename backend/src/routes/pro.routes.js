const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const {
  addAvailability,
  getAppointments,
  listProfessionals,
  getMyAvailabilities,
  deleteAvailability,
  updateAvailability,
} = require("../controllers/professional.controller");

router.get("/", protect, listProfessionals);
router.post("/availability", protect,
  authorize("pro"),
  [
    check("date", "Date is required").not().isEmpty(),
    check("slots", "Slots must be an array").isArray({ min: 1 }),
  ],
  addAvailability
);
router.get("/availability", protect, authorize("pro"), getMyAvailabilities);
router.delete("/availability/:id", protect, authorize("pro"), deleteAvailability);
router.get("/appointments", protect, authorize("pro"), getAppointments);
router.put(
  "/availability/:id",
  protect,
  authorize("pro"),
  [
    check("date", "Date is required").not().isEmpty(),
    check("slots", "Slots must be an array").isArray({ min: 1 }),
  ],
  updateAvailability
);

module.exports = router;
