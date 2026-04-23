
const express = require('express');
const router = express.Router();
const { summarizeText, wordCount, uppercaseText, chatWithAI } = require('../controllers/aiController');

router.post('/summarize', summarizeText);
router.post('/uppercase', uppercaseText);
router.post('/wordcount', wordCount);
router.post('/chat', chatWithAI)
module.exports = router;