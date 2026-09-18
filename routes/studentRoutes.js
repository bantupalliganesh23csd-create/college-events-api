const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/Student");
const Event = require("../models/Event");
const checkCapacity = require("../middleware/checkCapacity");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, department } = req.body;
    if (!name || !email || !department) {
      return res.status(400).json({
        success: false,
        message: "Name, email and department are required"
      });
    }

    const student = await Student.create({ name, email, department });
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to create student",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate(
      "registeredEvents",
      "name date venue"
    );
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch students",
      error: error.message
    });
  }
});

router.post("/:studentId/register/:eventId", checkCapacity, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const event = req.event;
    if (student.registeredEvents.some((id) => id.equals(event._id))) {
      return res.status(409).json({
        success: false,
        message: "Student is already registered for this event"
      });
    }

    event.registeredStudents.push(student._id);
    student.registeredEvents.push(event._id);
    await Promise.all([event.save(), student.save()]);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        student: student.name,
        event: event.name,
        availableSeats: event.capacity - event.registeredStudents.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
});

router.delete("/:studentId/register/:eventId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.studentId) || !mongoose.isValidObjectId(req.params.eventId)) {
      return res.status(400).json({ success: false, message: "Invalid student or event ID" });
    }

    const [student, event] = await Promise.all([
      Student.findById(req.params.studentId),
      Event.findById(req.params.eventId)
    ]);
    if (!student || !event) {
      return res.status(404).json({
        success: false,
        message: "Student or event not found"
      });
    }

    student.registeredEvents = student.registeredEvents.filter(
      (id) => !id.equals(event._id)
    );
    event.registeredStudents = event.registeredStudents.filter(
      (id) => !id.equals(student._id)
    );
    await Promise.all([student.save(), event.save()]);

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to cancel registration",
      error: error.message
    });
  }
});

module.exports = router;
