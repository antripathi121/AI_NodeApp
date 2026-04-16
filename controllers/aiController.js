const { model } = require('mongoose');
const OpenAI = require('openai');

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

const summarizeText = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: "Answer the question in short." },
        { role: "user", content: text }
      ]
    });
  res.json({
    // summary: text.substring(0, 50) + '...Verified'
    Ans: response.choices[0].message.content
  });
};

const uppercaseText = (req, res) => {
  const { text } = req.body;
  res.json({ result: text.toUpperCase() });
};

const wordCount = (req, res) => {
  const { text } = req.body;
  const count = text.split(' ').length;
  res.json({ count });
};

module.exports = { summarizeText, uppercaseText, wordCount };