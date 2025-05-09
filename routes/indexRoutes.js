const express = require('express');
const router = express.Router();

// Assuming you have a model for campaigns, such as Campaign
const Campaign = require('../models/Campaign'); // Adjust the path if necessary

/**
 * Route: GET /
 * Description: Render the homepage and pass campaigns and user data to the view.
 */
router.get('/', async (req, res) => {
    try {
        // Fetch all campaigns from MongoDB
        const campaigns = await Campaign.find({});

        // Render the home view with campaigns and user session data
        res.render('home', {
            campaigns,
            user: req.session.user || null // Pass user data if session exists
        });
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).send("Server error");
    }
});

/**
 * Route: GET /campaign/:id
 * Description: Render details of a specific campaign by ID.
 */
router.get('/campaign/:id', async (req, res) => {
    try {
        // Find a campaign by its ID
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).send("Campaign not found");
        }

        res.render('campaignDetails', {
            campaign,
            user: req.session.user || null
        });
    } catch (error) {
        console.error("Error fetching campaign details:", error);
        res.status(500).send("Server error");
    }
});

/**
 * Route: POST /campaign
 * Description: Add a new campaign to the database.
 */
router.post('/campaign', async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        // Validate input data
        if (!title || !description || !date || !location) {
            return res.status(400).send("All fields are required");
        }

        // Create a new campaign
        const newCampaign = new Campaign({
            title,
            description,
            date,
            location
        });

        await newCampaign.save();
        res.redirect('/'); // Redirect to home after saving the campaign
    } catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
