const validateEvent = (req, res, next) => {
  const { name, description, date, venue, capacity } = req.body;

  if (!name || !description || !date || !venue || capacity === undefined) {
    return res.status(400).json({
      success: false,
      message: "All event fields are required"
    });
  }

  if (!Number.isInteger(Number(capacity)) || Number(capacity) < 10) {
    return res.status(400).json({
      success: false,
      message: "Event capacity must be at least 10 students"
    });
  }

  if (Number.isNaN(new Date(date).getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid event date"
    });
  }

  next();
};

module.exports = validateEvent;
