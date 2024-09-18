const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Route to get place details
router.get('/place-details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const response = await axios.get(`https://places.googleapis.com/v1/places/${placeId}`, {
      params: {
        fields: 'addressComponents',
        key: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching place details:', error);
    res.status(500).send('Error fetching place details');
  }
});

router.get('/config', (req, res) => {
  res.json({ apiKey: API_KEY });
});

module.exports = router;
