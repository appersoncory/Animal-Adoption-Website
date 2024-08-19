# Animal Rescue Adoption Platform

![Screenshot 2024-08-19 114033](https://github.com/user-attachments/assets/270c51b0-2ee5-43b7-b6d1-72fcf66b47e6)


## Overview

This project is a web-based application designed for an animal rescue organization. The platform allows users to view available animals, search for specific types of animals, and apply for adoption. The platform is built using Node.js, Express, PostgreSQL, and Jade (Pug) as the templating engine. 
It uses microservices for CRUD operations, email notifications, user login and authentication, and distance calculations.

## Features

- **View Animals:** Browse a list of animals available for adoption.
- **Search Animals:** Filter animals by species, gender, age, and location.
- **Animal Details:** View detailed information about each animal, including pictures, descriptions, and location.
![Screenshot 2024-08-19 114111](https://github.com/user-attachments/assets/7bf64b61-4f3e-4bbf-a790-53f1b62af747)
- **Adoption Application:** Apply to adopt an animal by filling out a form with personal details.
- **Employee Authentication:** Employees can log in to manage the animals, including adding, editing, and deleting animals.
- **Microservices:** 
  - A CRUD microservice handles the creation, retrieval, updating, and deletion of animal records.
  - An email microservice sends notifications when someone applies for adoption.
  - A login microservice for user login and authentication
  - A ZIP code distance calcuator microservice for showing users distances to adoptable animals

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** Jade (Pug), CSS
- **Database:** PostgreSQL
- **Microservices:** Express.js, Nodemailer
- **Authentication:** JWT, Express-session
