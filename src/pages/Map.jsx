import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

// Fix for default marker icon in Leaflet
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Business Locations
const BUSINESS_LOCATIONS = {
  retail: [
    { id: 1, name: 'Shopping Mall District', lat: 40.7128, lng: -74.0060, description: 'High foot traffic shopping area', score: 95 },
    { id: 2, name: 'Downtown Shopping District', lat: 40.7580, lng: -73.9855, description: 'Prime retail location', score: 90 }
  ],
  restaurants: [
    { id: 3, name: 'Food Street', lat: 40.7306, lng: -73.9352, description: 'High food demand area', score: 92 },
    { id: 4, name: 'Downtown Food Court', lat: 40.7359, lng: -73.9911, description: 'Ideal for fast-food businesses', score: 88 }
  ],
  offices: [
    { id: 5, name: 'Business Hub', lat: 40.7488, lng: -73.9680, description: 'Great location for startups', score: 89 },
    { id: 6, name: 'Tech Park', lat: 40.7433, lng: -73.9821, description: 'Ideal for IT companies', score: 87 }
  ],
  warehouses: [
    { id: 7, name: 'Industrial Zone', lat: 40.7520, lng: -73.9772, description: 'Good for storage businesses', score: 85 },
    { id: 8, name: 'Logistics Park', lat: 40.7678, lng: -73.9610, description: 'Strategic location for logistics', score: 90 }
  ],
};

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedType, setSelectedType] = useState('retail');
  const [locations, setLocations] = useState(BUSINESS_LOCATIONS.retail);
  const [loading, setLoading] = useState(true);
  const [businessIdeas, setBusinessIdeas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation([lat, lon]);
          fetchBusinessIdeas(lat, lon);
          setLoading(false);
        },
        () => {
          setUserLocation([40.7128, -74.0060]); // Default to NYC
          setLoading(false);
        }
      );
    }
  }, []);

  const fetchBusinessIdeas = async (lat, lon) => {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert in suggesting business ideas based on location data." },
          { role: "user", content: `Suggest business ideas for a location with coordinates (${lat}, ${lon}).` }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1,
      });

      const modelResponse = completion.choices[0]?.message?.content || "No business ideas found.";
      setBusinessIdeas([modelResponse]);
    } catch (error) {
      console.error('Error fetching business ideas:', error);
      setError("Error fetching business ideas.");
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setLocations(BUSINESS_LOCATIONS[type]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
          
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-blue-600 text-white">
            <h1 className="text-xl font-semibold">Business Location Finder</h1>
            <p className="text-sm text-blue-100">Find the perfect location for your business</p>
            <div className="mt-4 flex gap-4">
              {Object.keys(BUSINESS_LOCATIONS).map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-4 py-2 rounded-md ${selectedType === type ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div style={{ height: '600px', width: '100%' }}>
            <MapContainer
              center={userLocation || [40.7128, -74.0060]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {locations.map(location => (
                <Marker key={location.id} position={[location.lat, location.lng]} icon={icon}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-medium text-lg mb-1">{location.name}</h3>
                      <p className="text-sm mb-2">{location.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-medium text-blue-600">{location.score}%</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Business Ideas Section */}
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-700">Suggested Business Ideas</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="list-disc pl-5 mt-2">
              {businessIdeas.length > 0 ? (
                businessIdeas.map((idea, index) => <li key={index} className="text-gray-600">{idea}</li>)
              ) : (
                <p className="text-gray-500">No suggestions available.</p>
              )}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Map;


