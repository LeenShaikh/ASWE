
const express = require('express');
const axios = require('axios');
const router = express.Router();
const apiKey = require('../config').openWeatherMapApiKey;

const defaultLatitude = 31.9522; 
const defaultLongitude = 35.2332; 

router.get('/current', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat || defaultLatitude}&lon=${lon || defaultLongitude}&appid=${apiKey}&units=metric`;
        
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching current weather:', error);
        res.status(500).json({ error: 'Error fetching current weather' });
    }
});

module.exports = router;
