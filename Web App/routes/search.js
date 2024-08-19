const express = require('express');
const pool = require('../db');

const router = express.Router();

// Render the search page with default filters
router.get('/', (req, res) => {
  const filters = {
    species: '',
    gender: '',
    minAge: '',
    maxAge: '',
    zip: '',
    maxDistance: ''
  };

  res.render('search', { filters });
});

// Redirect search query to animal listing with filters
router.get('/results', (req, res) => {
  const { species, gender, minAge, maxAge, zip, maxDistance } = req.query;
  const queryParams = new URLSearchParams({ species, gender, minAge, maxAge, zip, maxDistance });
  res.redirect(`/animals?${queryParams.toString()}`);
});

module.exports = router;
