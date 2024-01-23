const express = require("express");
const router = express.Router();

const {
  login, logout
} = require('../controllers/authController');

router.get('/', getAllHistory);
router.get('/:Id', getHistory);

module.exports = router;
