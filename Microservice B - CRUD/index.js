const express = require('express');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Create a new animal
app.post('/animals', async (req, res) => {
  console.log('Request body:', req.body);
  const { species, gender, age, name, picture, location, description } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO animals (species, gender, age, name, picture, location, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [species || '', gender || '', age || 0, name || '', picture || '', location || '', description || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create animal' });
  }
});

// Read all animals
app.get('/animals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animals');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});

// Read a single animal by ID
app.get('/animals/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const result = await pool.query('SELECT * FROM animals WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching animal:', err.message);
    res.status(500).json({ error: 'Failed to fetch animal' });
  }
});

// Update an animal
app.put('/animals/:id', async (req, res) => {
  const { id } = req.params;
  const { species, gender, age, name, picture, location, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE animals SET species = $1, gender = $2, age = $3, name = $4, picture = $5, location = $6, description = $7 WHERE id = $8 RETURNING *',
      [species || '', gender || '', age || 0, name || '', picture || '', location || '', description || '', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update animal' });
  }
});

// Delete an animal
app.delete('/animals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM animals WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.status(200).json({ message: 'Animal deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete animal' });
  }
});

app.listen(PORT, () => {
  console.log(`CRUD microservice running on port ${PORT}`);
});
