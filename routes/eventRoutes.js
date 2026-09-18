const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const validateEvent = require("../middleware/validateEvent");

const router = express.Router();

router.post("/", validateEvent, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to create event",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate(
      "registeredStudents",
      "name email department"
    );
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch events",
      error: error.message
    });
  }
});

router.get("/:id/seats", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const registeredStudents = event.registeredStudents.length;
    res.status(200).json({
      success: true,
      event: event.name,
      capacity: event.capacity,
      registeredStudents,
      availableSeats: event.capacity - registeredStudents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch available seats",
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id).populate(
      "registeredStudents",
      "name email department"
    );
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch event" });
  }
});

router.put("/:id", validateEvent, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to update event",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to delete event" });
  }
});

module.exports = router;
