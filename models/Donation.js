const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now } // Add date with a default value
});

module.exports = mongoose.model('Donation', donationSchema);
