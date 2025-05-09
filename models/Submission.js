const mongoose = require('mongoose');

// Define the schema for beach cleanup submissions
const SubmissionSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    date: { type: Date, required: true },
    beach: { type: String, required: true },
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create the model
const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = Submission;
