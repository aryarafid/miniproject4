const express = require("express");
const router = express.Router();
const pool = require("../config");
const moment = require("moment");

const app = express();

// CRUD APIs

// Create
const login = (req, res) => {
  const { nama_Tugas, prioritas, workStart, workEnd, description, workDate } =
    req.body;

};

// Read (all)
const logout = (req, res) => {
  
};

module.exports = {
  login, logout
};
