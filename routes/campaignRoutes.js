const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");

// Home Page
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find(); // Fetch all campaigns
    res.render("index", { campaigns });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error, could not fetch campaigns.");
  }
});

// Campaign Page
router.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await Campaign.find(); // Fetch all campaigns
    res.render("campaigns", { campaigns });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error, could not fetch campaigns.");
  }
});

// Register for a campaign
router.post("/campaigns/register/:id", async (req, res) => {
  try {
    // Ensure the user is logged in
    if (!req.session.userId) {
      return res.redirect("/login"); // Redirect to login if user is not logged in
    }

    // Find the campaign by ID
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).send("Campaign not found.");
    }

    // Add the user to the campaign's participants
    campaign.participants.push(req.session.userId);

    // Save the campaign with the new participant
    await campaign.save();

    // Redirect to the dashboard after registration
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering for the campaign.");
  }
});

module.exports = router;
