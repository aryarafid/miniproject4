const express = require("express");
const router = express.Router();

const {
  getAllHistory,
  getHistory,
  createHistory,
  updateHistory,
  deleteHistory,
  getReportByMonth
} = require('../controllers/historyController');

router.get('/', getAllHistory);
router.get('/:Id', getHistory);
router.post('/', createHistory);
router.delete('/:Id', deleteHistory);
router.put('/:Id', updateHistory);
router.get('/month/:month', getReportByMonth);

module.exports = router;
