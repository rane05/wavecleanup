const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // Ensure that username is unique in the database
    },
    firstName: {
        type: String,
        required: true // Make firstName required if needed
    },
    lastName: {
        type: String,
        required: true // Make lastName required if needed
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure that email is unique in the database
    },
    password: {
        type: String,
        required: true // Ensure that password is required
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        // Only hash the password if it was modified (or if it's new)
        this.password = await bcrypt.hash(this.password, 10);
    }
    next(); // Proceed to save the document
});

// Method to compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Method to sanitize user data before sending to the client
userSchema.methods.getPublicProfile = function () {
    const { password, ...sanitizedData } = this.toObject();
    return sanitizedData;
};

module.exports = mongoose.model('User', userSchema);
