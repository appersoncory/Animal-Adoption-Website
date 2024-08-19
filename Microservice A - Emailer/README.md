# Animal Adoption Email Notification Microservice

This microservice sends email notifications when an adoption application is submitted.

## Installation
Download files to folder
Install npm to install the necessary dependencies.

```bash
npm install
```
Create a .env file were you can add 
```.env
EMAIL_USER= #YourEmail
EMAIL_PASS= #YourAppPassword
PORT= #LocalPort
```
Run microservice by traveling to main folder
```bash
node server.js
```
## Prerequisites

Please travel to the .env file and add your email and app password for the gmail you will be using to send the emails out
In order to create an app password travel to [link](https://myaccount.google.com/u/2/?hl=en&utm_source=OGB&utm_medium=act) to generate the app password by typing in App Password in seearch bar.

## Usage request
To programmatically send an adoption application, send an HTTP POST request to the following endpoint:
```https
POST http://localhost:3000/send-notification
```
You can also use Python as well
```python
import requests
response = requests.post('http://localhost:3000/send-notification', json={
    "animal name": "name",
    "applicant name": "name",
    "email address": "address sending to",
    "phone number": "number",
    "has other animals": True,
    "has children": False
})
```
## POST format request
The format of post requests from the microserice is in JSON format with the required body like
example:
```js
const {
    'animal name': animalName,
    'applicant name': applicantName,
    'email address': email,
    'phone number': phone,
    'has other animals': hasOtherAnimals,
    'has children': hasChildren,
  } = req.body;
```

## Receive Data
Should receive a Notification sent or Error sending messages as well as the data being sent to the gmail account. On information back you should recieve 
```
Application submitted successfully
```
or 

````
Failed to submit application:
${errorText}
````

## Usage call
Using Node.js
```js
try {
                const response = await fetch('http://localhost:3000/send-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Application submitted successfully!');
                } else {
                    const errorText = await response.text();
                    console.error('Server responded with:', errorText);
                    alert(`Failed to submit application: ${errorText}`);
                }
            }
```

# UML Diagram
![image](https://github.com/user-attachments/assets/d68d2b0d-d184-4112-978b-01d248531b2f)
