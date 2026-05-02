const { model } = require('mongoose');
const OpenAI = require('openai');
const chrono = require('chrono-node');

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

const extractDateTime = (text) => {
  const parsedDate = chrono.parseDate(text);

  if (!parsedDate) return null;

  return parsedDate;
};

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
let bookingState = {
  step: null,
  date: null,
  time: null
};

const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;
    const lastMessage = messages[messages.length - 1].content;

    // 👉 Step 1: If already in booking flow

    if (bookingState.step === 'ask_date') {
      const parsed = chrono.parseDate(lastMessage);

      if (!parsed) {
        return res.json({
          reply: "I couldn't understand the date. Try like '3 May', 'tomorrow', or 'next Monday'."
        });
      }

      bookingState.date = parsed; // store Date object
      bookingState.step = 'ask_time';

      return res.json({
        reply: "Got it 👍 What time works for you?"
      });
    }

    if (bookingState.step === 'ask_time') {
      const parsed = chrono.parseDate(lastMessage);

      if (!parsed) {
        return res.json({
          reply: "I couldn't understand the time. Try like '5 PM' or '14:30'."
        });
      }

      // 👉 Merge date + time
      const finalDateTime = new Date(bookingState.date);
      finalDateTime.setHours(parsed.getHours());
      finalDateTime.setMinutes(parsed.getMinutes());

      // 👉 Store clean ISO format
      const isoString = finalDateTime.toISOString();

      bookingState.step = null;

      // reset state after saving
      bookingState.date = null;

      return res.json({
        reply: `✅ Your appointment is booked on ${finalDateTime.toDateString()} at ${finalDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
      });
    }

    // 👉 Step 2: Detect intent
    const intent = detectIntent(lastMessage);

    if (intent === 'booking') {
      bookingState.step = 'ask_date';

      return res.json({
        reply: "Sure! Please tell me the date for your appointment."
      });
    }

    // 👉 Step 3: Normal AI response
    const response = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: messages
    });

    return res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Something went wrong"
    });
  }
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

const detectIntent = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes('book') ||
    text.includes('appointment') ||
    text.includes('schedule')
  ) {
    return 'booking';
  }

  return 'general';
};

module.exports = { summarizeText, uppercaseText, wordCount, chatWithAI };