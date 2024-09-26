const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/weather', async (req, res) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: 'Mondorf',
                units: 'metric',
                appid: process.env.OPENWEATHER_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données météo.' });
    }
});

module.exports = router;
