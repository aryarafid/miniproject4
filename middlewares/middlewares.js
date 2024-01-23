const express = require("express");
const bodyParser = require("body-parser");
const historyRouter = require("../routes/historyRouter");
const path = require("path");
const session = require("express-session");

const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;
  // Hardcoded credentials check
  if (username === "admin" && password === "admin") {
    // Authentication successful
    req.session.user = { username };
    next();
  } else {
    // Authentication failed
    req.session.authError = "belum login keknya";
    res.redirect("/login");
    // res.render('login', { error: 'Invalid username or password' });
  }
};

const checkAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = {authenticateUser, checkAuth}
