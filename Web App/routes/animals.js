const express = require('express');
const multer = require('multer');
const axios = require('axios');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Base URLs for microservices
const CRUD_SERVICE_URL = 'http://localhost:4000';
const DISTANCE_SERVICE_URL = 'http://localhost:5000';

// Animals listing with filters
router.get('/', async (req, res) => {
  const { species, gender, minAge, maxAge, zip, maxDistance } = req.query;

  try {
    const response = await axios.get(`${CRUD_SERVICE_URL}/animals`);
    let animals = response.data;

    console.log("Query Parameters:", req.query);
    console.log("Fetched Animals:", animals);

    // Apply species filter
    if (species && species.trim() !== '') {
      animals = animals.filter(animal => animal.species && animal.species.toLowerCase() === species.toLowerCase());
    }

    // Apply gender filter
    if (gender && gender.trim() !== '') {
      animals = animals.filter(animal => animal.gender && animal.gender.toLowerCase() === gender.toLowerCase());
    }

    // Apply age filters
    if (minAge) {
      animals = animals.filter(animal => animal.age >= parseInt(minAge, 10));
    }
    if (maxAge) {
      animals = animals.filter(animal => animal.age <= parseInt(maxAge, 10));
    }

    // Distance calculation if zip and maxDistance are provided
    if (zip && maxDistance) {
      const distancePromises = animals.map(async (animal) => {
        try {
          const distanceResponse = await axios.get(`${DISTANCE_SERVICE_URL}/distance`, {
            params: { zip1: zip, zip2: animal.location },
          });
          animal.distance = parseFloat(distanceResponse.data.distance);
          return animal.distance <= parseFloat(maxDistance, 10);
        } catch (error) {
          console.error('Error calculating distance:', error.message);
          return false; // Exclude animals if distance calculation fails
        }
      });

      const withinDistance = await Promise.all(distancePromises);
      animals = animals.filter((_, index) => withinDistance[index]);
    }

    res.render('animals', { animals, filters: { species, gender, minAge, maxAge, zip, maxDistance } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching animals');
  }
});

// Apply the middleware to protect the /new route
router.get('/new', authenticateToken, (req, res) => {
  res.render('new_animal');
});

// View animal details
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${CRUD_SERVICE_URL}/animals/${id}`);
    const animal = response.data;

    res.render('animal_details', { animal });
  } catch (err) {
    console.error('Error fetching animal details:', err.message);
    res.status(500).send('Error fetching animal details');
  }
});

// Create new animal
router.post('/', authenticateToken, upload.single('picture'), async (req, res) => {
  const { species, gender, age, name, location, description } = req.body;
  const picture = req.file ? `/uploads/${req.file.filename}` : null;

  // Debugging: Log what is being received from the form
  console.log('Received form data:', {
    species, gender, age, name, location, description, picture,
  });

  try {
    await axios.post(`${CRUD_SERVICE_URL}/animals`, {
      species: species || '',
      gender: gender || '',
      age: parseInt(age, 10) || 0,
      name: name || '',
      picture: picture || '',
      location: location || '',
      description: description || '',
    });

    res.redirect('/animals');
  } catch (err) {
    console.error('Error adding animal:', err.message);
    res.status(500).send('Error adding animal');
  }
});


// Update animal form
router.get('/:id/edit', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${CRUD_SERVICE_URL}/animals/${req.params.id}`);
    res.render('edit_animal', { animal: response.data });
  } catch (err) {
    console.error('Error fetching animal:', err.message);
    res.status(500).send('Error fetching animal');
  }
});

// Update animal
router.post('/:id', authenticateToken, upload.single('picture'), async (req, res) => {
  const { species, gender, age, name, location, description } = req.body;
  const picture = req.file ? `/uploads/${req.file.filename}` : req.body.existingPicture;

  try {
    await axios.put(`${CRUD_SERVICE_URL}/animals/${req.params.id}`, {
      species: species || '',
      gender: gender || '',
      age: parseInt(age, 10) || 0,
      name: name || '',
      picture: picture || '',
      location: location || '',
      description: description || ''
    });
    res.redirect('/animals');
  } catch (err) {
    console.error('Error updating animal:', err.message);
    res.status(500).send('Error updating animal');
  }
});

// Delete animal
router.post('/:id/delete', authenticateToken, async (req, res) => {
  try {
    await axios.delete(`${CRUD_SERVICE_URL}/animals/${req.params.id}`);
    res.redirect('/animals');
  } catch (err) {
    console.error('Error deleting animal:', err.message);
    res.status(500).send('Error deleting animal');
  }
});

module.exports = router;
