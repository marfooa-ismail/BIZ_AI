import { GROQ_API_KEY } from '../config';

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export const findNearbyRestaurants = async (location, radius = 5000) => {
  try {
    const systemMessage = {
      role: 'system',
      content: `You are a restaurant finder assistant using the Llama 3.2 model. Your task is to analyze the user's location and provide a list of nearby restaurants with their details.
      Format the response as a JSON array with the following structure for each restaurant:
      {
        "name": "Restaurant Name",
        "address": "Full Address",
        "latitude": "Latitude coordinate",
        "longitude": "Longitude coordinate",
        "distance": "Distance in meters",
        "rating": "Rating out of 5",
        "cuisine": "Type of cuisine",
        "price_range": "Price range ($, $$, $$$)",
        "opening_hours": "Opening hours",
        "contact": "Phone number if available"
      }
      
      Important: 
      - Include only restaurants within ${radius} meters of the provided location
      - Sort by distance (nearest first)
      - Include at least 5 restaurants if available
      - Ensure all addresses are complete and accurate
      - Include real ratings and price ranges if available
      - Calculate accurate distances from the provided coordinates
      - Generate realistic coordinates for each restaurant`
    };

    const userMessage = {
      role: 'user',
      content: `Find restaurants near this location: ${location.latitude}, ${location.longitude}`
    };

    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2-70b-4096',
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error finding restaurants:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { location, radius } = req.body;
    const restaurants = await findNearbyRestaurants(location, radius);
    
    return res.status(200).json({ 
      restaurants,
      timestamp: new Date().toISOString(),
      model: 'llama2-70b-4096'
    });
  } catch (error) {
    console.error('Error in find-restaurants handler:', error);
    return res.status(500).json({ error: 'Failed to find restaurants' });
  }
} 