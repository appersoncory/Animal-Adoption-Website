const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Add gmail email and app password to .env file

const app = express();
const port = process.env.PORT || 7000;
app.use(cors());
app.use(express.json());

app.post('/send-notification', async (req, res) => {
  console.log('Received Data:', req.body); 

  const {
    'animal name': animalName,
    'applicant name': applicantName,
    'email address': email,
    'phone number': phone,
    'has other animals': hasOtherAnimals,
    'has children': hasChildren,
  } = req.body;

  if (!animalName || !applicantName || !email || !phone) {
    console.error('Validation failed:', req.body);
    return res.status(400).send('Missing required fields: animal name, applicant name, email, or phone number');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    //Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Adoption Application Received',
      text: `
        A new animal adoption form has been submitted.

        Here are the details that were submitted:
        - Animal Name: ${animalName}
        - Applicant Name: ${applicantName}
        - Applicant Email: ${email}
        - Applicant Phone: ${phone}
        - Applicant Has Other Animals: ${hasOtherAnimals ? 'Yes' : 'No'}
        - Applicant Has Children: ${hasChildren ? 'Yes' : 'No'}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send(`Error sending notification: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
