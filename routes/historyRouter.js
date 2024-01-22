const express = require("express");
const router = express.Router();

const {
  getAllHistory,
  getHistory,
  createHistory,
  updateHistory,
  deleteHistory,
} = require('../controllers/historyController');

router.get('/', getAllHistory);
router.get('/:Id', getHistory);
router.post('/', createHistory);
router.delete('/:Id', deleteHistory);
router.put('/:Id', updateHistory);

module.exports = router;
