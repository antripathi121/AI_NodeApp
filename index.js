require('dotenv').config();
const express = require('express');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(express.json());

app.use('/api', aiRoutes);

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
