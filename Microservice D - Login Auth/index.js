const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use the auth routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
