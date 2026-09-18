const mongoose = require("mongoose");
const Event = require("../models/Event");

const checkCapacity = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID"
      });
    }

    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (event.registeredStudents.length >= event.capacity) {
      return res.status(409).json({
        success: false,
        message: "Registration failed. Event has reached maximum capacity."
      });
    }

    req.event = event;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = checkCapacity;
