const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation'); // Import the Donation model

// GET route to fetch recent donations
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 }).limit(10); // Fetch recent 10 donations
        res.render('donate', { donations });
    } catch (error) {
        console.error("Error fetching donations:", error);
        res.render('donate', { donations: [] }); // Return empty donations in case of error
    }
});

// POST route to create a new donation
router.post('/', async (req, res) => {
    try {
        const { name, amount } = req.body;
        if (!name || !amount) {
            return res.redirect('/donate'); // Redirect if required fields are missing
        }
        
        const donation = new Donation({
            name,
            amount,
            date: new Date() // Adding the current date of donation
        });
        
        // Save the donation to the database
        await donation.save();
        
        res.redirect('/donate'); // Redirect to the donations page after saving
    } catch (error) {
        console.error("Donation error:", error);
        res.redirect('/donate'); // Redirect in case of error
    }
});

module.exports = router;
