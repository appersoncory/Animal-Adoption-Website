const express = require('express');
const axios = require('axios');

const router = express.Router();

// Route to render the adoption form
router.get('/', (req, res) => {
  const { animalName } = req.query;
  res.render('adoption_form', { animalName, showSuccessPopup: false });
});

// Route to handle form submission
router.post('/', async (req, res) => {
  const { animalName, name, email, phone, pets, children } = req.body;

  try {
    // Send a POST request to the email microservice on port 7000
    const response = await axios.post('http://localhost:7000/send-notification', {
      'animal name': animalName,
      'applicant name': name,
      'email address': email,
      'phone number': phone,
      'has other animals': pets === 'Yes',
      'has children': children === 'Yes',
    });

    console.log('Email microservice response:', response.data);

    // Render the form with the success flag set to true
    res.render('adoption_form', { animalName, showSuccessPopup: true });
  } catch (error) {
    console.error('Error sending email notification:', error.message);
    res.status(500).send('An error occurred while submitting the adoption application.');
  }
});

module.exports = router;
