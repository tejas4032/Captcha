const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const statusRouter = require('./routes/status'); // Correct path to your routes

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/aadhaar', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use the status router for /api/status
app.use('/api/status', statusRouter);

// New Route for Verification
app.post('/verify', (req, res) => {
  const data = req.body;

  function verifyBehavior(data) {
    const mouseMovements = data.mouseMovements;
    const typingData = data.typingData;

    console.log('Received Mouse Movements:', mouseMovements);
    console.log('Received Typing Data:', typingData);

    if (mouseMovements.length < 10) {
      console.log('Not enough mouse movements');
      return false;
    }

    const typingIntervals = typingData
      .slice(1)
      .map((item, index) => item.time - typingData[index].time);

    const averageTypingSpeed = typingIntervals.length
      ? typingIntervals.reduce((sum, interval) => sum + interval, 0) / typingIntervals.length
      : Infinity;

    console.log('Typing Intervals:', typingIntervals);
    console.log('Average Typing Speed:', averageTypingSpeed);

    if (averageTypingSpeed < 50 || averageTypingSpeed > 1000) {
      console.log('Typing speed out of range');
      return false;
    }

    return true;
  }

  const verified = verifyBehavior(data);
  console.log('Verification Result:', verified);
  res.json({ verified });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
