const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission'); // Adjust path if necessary

// Route to render the organize page
router.get('/organize', (req, res) => {
    res.render('organize');
});

// Route to handle form submission
router.post('/submit', async (req, res) => {
    try {
        const { firstName, lastName, email, contact, date, beach, location } = req.body;

        // Save the submission to the database
        const newSubmission = new Submission({
            firstName,
            lastName,
            email,
            contact,
            date,
            beach,
            location
        });
        await newSubmission.save();

        console.log('Submission saved:', newSubmission);

        // Redirect or render a confirmation page
        res.send(`<h1>Thank you, ${firstName}! Your beach cleanup campaign has been registered.</h1>`);
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).send('Server error');
    }
});

// Route to fetch leaderboard data
router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboardData = await Submission.aggregate([
            { $group: { _id: '$beach', count: { $sum: 1 } } },
            { $sort: { count: -1 } } // Sort by count descending
        ]);

        res.render('leaderboard', { leaderboard: leaderboardData });
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
