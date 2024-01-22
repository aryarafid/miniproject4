const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Set up MySQL connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "attendance",
});

// CRUD APIs

// Create
app.post("/history", (req, res) => {
  const { nama_Tugas, workStart, workEnd, description, workDate } = req.body;
  pool.query(
    "INSERT INTO history (nama_Tugas, workStart, workEnd, description, workDate) VALUES (?, ?, ?, ?, ?)",
    [nama_Tugas, workStart, workEnd, description, workDate],
    (error, results) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(201).json({ id: results.insertId });
      }
    }
  );
});

// Read (all)
app.get("/history", (req, res) => {
  pool.query("SELECT * FROM history", (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json(results);
    }
  });
});

// Read (one)
app.get("/history/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM history WHERE ID = ?", [id], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// UpworkDate
app.put("/history/:id", (req, res) => {
  const { id } = req.params;
  const { nama_Tugas, workStart, workEnd, description, workDate } = req.body;
  pool.query(
    "UPworkDate history SET nama_Tugas = ?, workStart = ?, workEnd = ?, description = ?, workDate = ? WHERE ID = ?",
    [nama_Tugas, workStart, workEnd, description, workDate, id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(200).json({ message: "Record upworkDated successfully" });
      }
    }
  );
});

// Delete
app.delete("/history/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM history WHERE ID = ?", [id], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json({ message: "Record deleted successfully" });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
