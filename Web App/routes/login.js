const express = require('express');
const axios = require('axios');
const router = express.Router();

// Render login page
router.get('/', (req, res) => {
  res.render('login', { error: null });
});

// Handle login submission
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Send login request to the auth microservice
    const response = await axios.post('http://localhost:6000/auth/login', {
      username,
      password,
    });

    // Store the JWT token in a cookie
    res.cookie('token', response.data.token, { httpOnly: true });

    // Redirect to the dashboard or home page
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    res.render('login', { error: 'Invalid username or password' });
  }
});

module.exports = router;
