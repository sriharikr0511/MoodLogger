const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let moods = [];

app.get('/moods', (req, res) => res.json(moods));

app.post('/mood', (req, res) => {
  const { mood } = req.body;
  if (!mood) return res.status(400).json({ error: 'Mood required' });
  moods.push({ mood, time: new Date().toISOString() });
  res.json({ message: 'Mood saved!' });
});

app.listen(5000, () => console.log('Backend running on port 5000'));