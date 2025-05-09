const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');  // Import the User model

const router = express.Router();

// Register route (GET)
router.get('/register', (req, res) => {
    res.render('register', { message: req.session.message || null });
    delete req.session.message;  // Clear the message after rendering
});

// Register route (POST)
router.post('/register', async (req, res) => {
    console.log(req.body); // Log the request body to check incoming data

    const { username, firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password || !username) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.session.message = 'Username already taken. Please choose a different one.';
            return res.redirect('/auth/register');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        // Create a new user
        const newUser = new User({username, firstName, lastName, email, password: hashedPassword });
        console.log(newUser);
        await newUser.save();

        req.session.message = 'Registration successful! Please log in.';
        res.redirect('/auth/login'); // Redirect to login page
    } catch (error) {
        console.error('Registration Error:', error);
        req.session.message = 'An error occurred. Please try again.';
        res.redirect('/auth/register');
    }
});

// Login route (GET)
router.get('/login', (req, res) => {
    res.render('login', { message: req.session.message || null });
    delete req.session.message;
});

// Login route (POST)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            req.session.message = 'User not found. Please check your username.';
            return res.redirect('/auth/login');
        }

        // Compare the password with the stored hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.session.message = 'Invalid password. Please try again.';
            return res.redirect('/auth/login');
        }

        // If login is successful
        req.session.user = user; // Save user data to session
        req.session.message = 'Login successful!';
        res.redirect('/'); // Redirect to home page
    } catch (error) {
        req.session.message = 'An error occurred during login. Please try again.';
        res.redirect('/auth/login');
    }
});

// Logout route (GET)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/'); // Redirect to home page in case of error
        }
        res.redirect('/'); // Redirect to home page after successful logout
    });
});

module.exports = router;
