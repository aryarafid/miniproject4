const express = require("express");
const router = express.Router();
const pool = require("../config")

const app = express();

// CRUD APIs

// Create
const createHistory = ((req, res) => {
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
const getAllHistory = ((req, res) => {
  pool.query("SELECT * FROM history", (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json(results);
    }
  });
});

// Read (one)
const getHistory = ((req, res) => {
  const { Id } = req.params;
  pool.query("SELECT * FROM history WHERE Id = ?", [Id], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// UpworkDate
const updateHistory = ((req, res) => {
  const { Id } = req.params;
  const { nama_Tugas, workStart, workEnd, description, workDate } = req.body;
  pool.query(
    "UPDATE history SET nama_Tugas = ?, workStart = ?, workEnd = ?, description = ?, workDate = ? WHERE Id = ?",
    [nama_Tugas, workStart, workEnd, description, workDate, Id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(200).json({ message: "Record updated successfully" });
      }
    }
  );
});

// Delete
const deleteHistory = ((req, res) => {
  const { Id } = req.params;
  pool.query("DELETE FROM history WHERE Id = ?", [Id], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json({ message: "Record deleted successfully" });
    }
  });
});

module.exports = {getAllHistory, getHistory, createHistory, deleteHistory, updateHistory};
