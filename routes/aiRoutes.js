
const express = require('express');
const router = express.Router();
const { summarizeText, wordCount, uppercaseText } = require('../controllers/aiController');

router.post('/summarize', summarizeText);
router.post('/uppercase', uppercaseText);
router.post('/wordcount', wordCount)
module.exports = router;