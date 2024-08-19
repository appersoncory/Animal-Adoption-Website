// index.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Utility function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
}

// Function to get coordinates for a given ZIP code
async function getCoordinates(zip) {
  const apiKey = process.env.OPENCAGE_API_KEY;
  try {
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
      params: { q: zip, key: apiKey }
    });

    // Filter results to include only those in the US
    const usResults = response.data.results.filter(result =>
      result.components.country_code === 'us'
    );

    if (usResults.length === 0) {
      throw new Error('No US results found for ZIP code');
    }

    // Use the first US result
    const { lat, lng } = usResults[0].geometry;
    return { lat, lng };
  } catch (error) {
    console.error(`Error fetching coordinates for ZIP ${zip}:`, error.message);
    throw new Error('Failed to fetch coordinates');
  }
}

// Endpoint to calculate distance between two ZIP codes
app.get('/distance', async (req, res) => {
  const { zip1, zip2 } = req.query;

  try {
    const coords1 = await getCoordinates(zip1);
    const coords2 = await getCoordinates(zip2);

    const distance = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng);
    res.json({ distance: `${distance.toFixed(2)} miles` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
});

app.listen(PORT, () => {
  console.log(`Distance microservice running on port ${PORT}`);
});
