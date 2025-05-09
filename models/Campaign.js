// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Optional: If campaigns have images
    link: { type: String, required: true } // Optional: If campaigns have external links
});

module.exports = mongoose.model('Campaign', campaignSchema);
