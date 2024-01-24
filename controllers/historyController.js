const express = require("express");
const router = express.Router();
const pool = require("../config");
const moment = require("moment");

// moment().format();

const app = express();

// CRUD APIs

// Create
const createHistory = (
  nama_Tugas,
  prioritas,
  workStart,
  workEnd,
  description
) => {
  // const { nama_Tugas, prioritas, workStart, workEnd, description } =req.body;
  // const { nama_Tugas, prioritas, workStart, workEnd, description } = formData;

  const workDate = moment().format("YYYY-MM-DD");

  console.log(nama_Tugas, prioritas, workStart, workEnd, description, workDate);

  // cek selisih jam agar tidak 24jam
  const format = "HH:mm";
  const startWorkHour = moment(workStart, format);
  const endWorkHour = moment(workEnd, format);
  const differenceInHrs = endWorkHour.diff(startWorkHour, "hours");

  // return res.json(moment().format("YYYY-MM-DD"));

  // // if work date != moment() -> return res fail
  // if (workDate != moment().format("YYYY-MM-DD")) {
  //   return res.status(500).json("Hanya bisa memasukkan di tanggal yang sama");
  // }

  // pool.query(
  //   "INSERT INTO history (nama_Tugas, prioritas, workStart, workEnd, description, workDate) VALUES (?, ?, ?, ?, ?, ?)",
  //   [nama_Tugas, prioritas, workStart, workEnd, description, workDate],
  //   (error, results) => {
  //     if (error) {
  //       res.status(500).json({ error });
  //     } else {
  //       res.status(201).json({ id: results.insertId });
  //     }
  //   }
  // );
};

// Read (all)
const getAllHistory = (req, res) => {
  return data = pool.query("SELECT * FROM history", (err, results) => {
    if (err) throw err;
  });
};

// router.get('/all', (req, res) => {
//   // Run a database query
//   pool.query('SELECT * FROM history', (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).send('Internal Server Error');
//       return;
//     }

//     // Pass the query result to the rendering process
//     res.render('history2', { username, results: results });
//   });
// });

// Read (one)
const getHistory = (req, res) => {
  const { Id } = req.params;
  pool.query("SELECT * FROM history WHERE Id = ?", [Id], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json(results[0]);
    }
  });
};

// Update
const updateHistory = (req, res) => {
  const { Id } = req.params;
  const { nama_Tugas, prioritas, workStart, workEnd, description, workDate } =
    req.body;

  const format = "HH:mm";
  const startWorkHour = moment(workStart, format);
  const endWorkHour = moment(workEnd, format);
  const differenceInHrs = endWorkHour.diff(startWorkHour, "hours");

  // return res.json(moment().format("YYYY-MM-DD"));

  // if work date != moment() -> return res fail
  if (workDate != moment().format("YYYY-MM-DD")) {
    return res.status(500).json("Hanya bisa memasukkan di tanggal yang sama");
  }

  pool.query(
    "UPDATE history SET nama_Tugas = ?, prioritas =?, workStart = ?, workEnd = ?, description = ?, workDate = ? WHERE Id = ?",
    [nama_Tugas, prioritas, workStart, workEnd, description, workDate, Id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(200).json({ message: "Record updated successfully" });
      }
    }
  );
};

// Delete
const deleteHistory = (req, res) => {
  const { Id } = req.params;
  pool.query("DELETE FROM history WHERE Id = ?", [Id], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json({ message: "Record deleted successfully" });
    }
  });
};

// get report by bulanan
const getReportByMonth = (req, res) => {
  const { month } = req.params;
  pool.query(
    "SELECT * FROM history WHERE month(workDate) = ?",
    [month],
    (error, results) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(200).json(results);
      }
    }
  );
};

module.exports = {
  getAllHistory,
  getHistory,
  createHistory,
  deleteHistory,
  updateHistory,
  getReportByMonth,
};
