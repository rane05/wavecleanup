const express = require('express');
const router = express.Router();

// Mock function to fetch stats data (replace this with your database or API logic)
async function getStats() {
    return [
        { title: 'Beach Cleanup 1', description: 'Cleaned 500 kg of trash', count: 500 },
        { title: 'Beach Cleanup 2', description: 'Cleaned 300 kg of trash', count: 300 }
    ];
}

// Stats route
router.get('/stats', async (req, res) => {
    try {
        const statsData = await getStats();
        res.render('stats', { data: statsData });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
