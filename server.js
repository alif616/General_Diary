<<<<<<< HEAD
// server.js
import express from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ✅ Registration
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, fatherName, motherName, nid, phone, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (first_name, last_name, father_name, mother_name, nid, phone, email, password) VALUES (?,?,?,?,?,?,?,?)",
    [firstName, lastName, fatherName, motherName, nid, phone, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Registration successful!" });
    }
  );
});

// ✅ Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful!", user });
  });
});

// ✅ Submit General Diary
app.post("/api/gd", (req, res) => {
  const { userId, incidentType, incidentDate, incidentLocation, policeStation, incidentDetails, witness } = req.body;

  db.query(
    "INSERT INTO general_diaries (user_id, incident_type, incident_date, incident_location, police_station, incident_details, witness) VALUES (?,?,?,?,?,?,?)",
    [userId, incidentType, incidentDate, incidentLocation, policeStation, incidentDetails, witness],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "GD Submitted Successfully!", gdId: result.insertId });
    }
  );
});

// ✅ Contact Form
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  db.query(
    "INSERT INTO contacts (name, email, message) VALUES (?,?,?)",
    [name, email, message],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Message sent successfully!" });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======

>>>>>>>
