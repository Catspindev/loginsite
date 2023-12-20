const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Endpoint to handle user registration
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const userLink = req.body.userLink; // Added userLink to the registration form

    // Read existing user data from the file
    fs.readFile('login.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.send('Error reading login data.');
        }

        // Check if the username already exists
        const lines = data.split('\n');
        for (const line of lines) {
            const existingUsername = line.split(':')[0];
            if (username === existingUsername) {
                return res.send('Username already exists. Please choose a different one.');
            }
        }

        // If the username is unique, append the new user to the file with a link
        const newUserLine = `${username}:${password}:${userLink}\n`;
        fs.appendFile('login.txt', newUserLine, (err) => {
            if (err) {
                console.error(err);
                return res.send('Error adding new user.');
            }

            res.send('User registration successful!');
        });
    });
});

// Endpoint to serve private pages based on user address
app.get('/private/:username', (req, res) => {
    const username = req.params.username;

    // Implement logic to check authentication and serve private content
    // For now, just send a basic response along with the user's link
    fs.readFile('login.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.send('Error reading login data.');
        }

        const lines = data.split('\n');
        for (const line of lines) {
            const [storedUsername, storedPassword, userLink] = line.split(':');
            
            if (username === storedUsername) {
                // Authentication successful
                return res.send(`Welcome to the private page, ${username}! Your link: ${userLink}`);
            }
        }

        // Authentication failed
        res.send('Invalid username or password.');
    });
});

app.post('/login', (req, res) => {
    // Existing login logic remains unchanged
    // ...
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
