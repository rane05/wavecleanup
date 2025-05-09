const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Render the form
router.get('/', (req, res) => {
    res.render('beachClean');
});

// Handle form submission
router.post('/submit', async (req, res) => {
    try {
        const { firstName, lastName, email, contact, date, beach, city } = req.body;
        const user = new User({ firstName, lastName, email, contact, date, beach, city });
        await user.save();
        res.redirect('/beachClean/stats');
    } catch (error) {
        console.error("Error saving user data:", error);
        res.status(500).send("Server error");
    }
});

// Render campaign stats
router.get('/stats', async (req, res) => {
    try {
        const data = await User.aggregate([
            { $group: { _id: "$beach", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        res.render('stats', { data });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
