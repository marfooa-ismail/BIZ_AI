import { useState, useEffect } from 'react';

const EnvironmentalMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businesses, setBusinesses] = useState([
    {
      id: 1,
      name: "Tech Innovation Hub",
      type: "Technology",
      address: "123 Innovation Street",
      rating: 4.5,
      distance: "0.5 miles"
    },
    {
      id: 2,
      name: "Green Earth Cafe",
      type: "Food & Beverage",
      address: "456 Eco Avenue",
      rating: 4.8,
      distance: "0.8 miles"
    },
    {
      id: 3,
      name: "Digital Marketing Solutions",
      type: "Marketing",
      address: "789 Digital Drive",
      rating: 4.2,
      distance: "1.2 miles"
    }
  ]);

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          setError('Unable to retrieve your location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Business Environment Map</h2>
            <p className="mt-1 text-gray-600">
              Explore similar businesses in your area
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left sidebar - Business listings */}
            <div className="border-r border-gray-200">
              <div className="p-4">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search for businesses..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-4">
                  {businesses.map((business) => (
                    <div key={business.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-medium text-gray-900">{business.name}</h3>
                      <p className="text-sm text-gray-500">{business.type}</p>
                      <p className="text-sm text-gray-500">{business.address}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm text-gray-600">{business.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">{business.distance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Map */}
            <div className="lg:col-span-2">
              <div className="h-[600px] bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4">
                      <svg className="h-12 w-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-4">Map functionality coming soon!</p>
                    <p className="text-sm text-gray-400">
                      Your location: {userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Filter Results
                </button>
                <select className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700">
                  <option>Sort by Distance</option>
                  <option>Sort by Rating</option>
                  <option>Sort by Name</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Analyze Area
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Market Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Competition Level</h4>
                <p className="text-2xl font-bold text-blue-600 mt-2">Moderate</p>
                <p className="text-sm text-gray-500 mt-1">Based on 15 similar businesses</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Market Potential</h4>
                <p className="text-2xl font-bold text-green-600 mt-2">High</p>
                <p className="text-sm text-gray-500 mt-1">Growing market trend</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Recommended Action</h4>
                <p className="text-2xl font-bold text-purple-600 mt-2">Expand</p>
                <p className="text-sm text-gray-500 mt-1">Favorable conditions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalMap; 


