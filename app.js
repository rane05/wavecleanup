const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session'); // Import session middleware

const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Database Connection (MongoDB)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Use session middleware to store user session data
app.use(session({
    secret:'123456',
    resave: false,
    saveUninitialized: true
}));

// Routes
const indexRoutes = require('./routes/indexRoutes');          // Assuming the index route file is in 'routes' folder
const campaignRoutes = require('./routes/campaignRoutes');    // Assuming 'campaignRoutes.js' is in 'routes' folder
const userRoutes = require('./routes/userRoutes');            // Assuming 'userRoutes.js' is in 'routes' folder
const beachCleanRoutes = require('./routes/beachCleanRoutes');
const statsRoutes = require('./routes/statsRoutes'); // Adjust path as needed
const organizeRoutes = require('./routes/organizeRoutes');


// Set up route middleware
app.use('/', indexRoutes);          // Default route
app.use('/campaigns', campaignRoutes); // Routes for campaign-related actions
app.use('/users', userRoutes);        // Routes for user-related actions
app.use('/beachClean', beachCleanRoutes);
app.use('/', statsRoutes);
app.use('/', organizeRoutes);

// Login and Register Routes
const authRoutes = require('./routes/authRoutes');            // Assuming 'authRoutes.js' is in 'routes' folder
app.use('/auth', authRoutes); // This includes routes for login and register functionality

// Home route
app.get('/', (req, res) => {
    res.render('home', { 
        user: req.session.user, // Pass the user to the view
        campaigns: [] // Or load campaigns data if available
    });
});

// Sample data to render
const statsData = [
    { beach: 'Santa Monica', percentage: 40 },
    { beach: 'Venice Beach', percentage: 30 },
    { beach: 'Malibu', percentage: 20 },
    { beach: 'Laguna Beach', percentage: 10 }
];

// Route to render stats page
app.get('/stats', (req, res) => {
    const statsData = [
        { title: 'Beach Cleanup 1', description: 'Cleaned 500 kg of trash', count: 500 },
        { title: 'Beach Cleanup 2', description: 'Cleaned 300 kg of trash', count: 300 }
        // add more data as needed
    ];
    res.render('stats', { data: statsData });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
