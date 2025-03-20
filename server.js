import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

const YELP_API_KEY = process.env.VITE_YELP_API_KEY;

// Yelp Business Search endpoint
app.get('/api/businesses/search', async (req, res) => {
  try {
    const { term, latitude, longitude, radius, limit } = req.query;
    
    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        'Authorization': `Bearer ${YELP_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        term,
        latitude,
        longitude,
        radius: radius || 5000,
        limit: limit || 50
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from Yelp API:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch business data',
      details: error.response?.data || error.message
    });
  }
});

// Download Pitch endpoint
app.post('/api/download-pitch', async (req, res) => {
  try {
    const { pitchContent, businessName } = req.body;
    
    if (!pitchContent || !businessName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${businessName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_pitch.txt"`);

    // Send the pitch content
    res.send(pitchContent);
  } catch (error) {
    console.error('Error generating pitch download:', error);
    res.status(500).json({
      error: 'Failed to generate pitch download',
      details: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 