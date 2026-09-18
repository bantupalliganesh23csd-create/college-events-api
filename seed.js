const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event");
const Student = require("./models/Student");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Event.deleteMany({});
    await Student.deleteMany({});

    const events = await Event.insertMany([
      {
        name: "Hackathon 2026",
        description: "24-hour coding and innovation competition",
        date: new Date("2026-10-10"),
        venue: "Computer Science Lab",
        capacity: 20
      },
      {
        name: "Web Development Workshop",
        description: "Workshop on modern web development",
        date: new Date("2026-10-12"),
        venue: "Seminar Hall A",
        capacity: 30
      },
      {
        name: "AI and Machine Learning",
        description: "Introduction to artificial intelligence and ML",
        date: new Date("2026-10-15"),
        venue: "AI Lab",
        capacity: 25
      },
      {
        name: "Cyber Security Challenge",
        description: "Technical cybersecurity competition",
        date: new Date("2026-10-18"),
        venue: "Computer Lab 2",
        capacity: 20
      },
      {
        name: "Robotics Workshop",
        description: "Hands-on robotics and automation workshop",
        date: new Date("2026-10-20"),
        venue: "Robotics Lab",
        capacity: 15
      }
    ]);

    const students = await Student.insertMany([
      {
        name: "Rahul Kumar",
        email: "rahul@example.com",
        department: "Computer Science"
      },
      {
        name: "Priya Sharma",
        email: "priya@example.com",
        department: "Information Technology"
      },
      {
        name: "Arjun Reddy",
        email: "arjun@example.com",
        department: "Electronics"
      }
    ]);

    events[0].registeredStudents.push(students[0]._id);
    events[1].registeredStudents.push(students[0]._id);
    students[0].registeredEvents.push(events[0]._id, events[1]._id);

    await Promise.all([events[0].save(), events[1].save(), students[0].save()]);

    console.log("Database seeded successfully");
    console.log("5 events created");
    console.log("Rahul registered for 2 events");
  } catch (error) {
    console.error("Database seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
