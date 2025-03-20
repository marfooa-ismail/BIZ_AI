import { useState } from 'react';

const BusinessPitchForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    location: '',
    businessIdea: '',
    targetMarket: '',
    projectedRevenue: '',
    businessModel: '',
    competitiveAdvantage: '',
    fundingNeeded: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add the logic to generate the pitch document
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg px-8 py-10">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Business Pitch Generator
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="City, State/Province, Country"
                />
              </div>

              <div>
                <label htmlFor="projectedRevenue" className="block text-sm font-medium text-gray-700">
                  Projected Annual Revenue
                </label>
                <input
                  type="text"
                  name="projectedRevenue"
                  id="projectedRevenue"
                  value={formData.projectedRevenue}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="e.g., $100,000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="businessIdea" className="block text-sm font-medium text-gray-700">
                Business Idea
              </label>
              <textarea
                name="businessIdea"
                id="businessIdea"
                value={formData.businessIdea}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Describe your business idea in detail"
              />
            </div>

            <div>
              <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700">
                Target Market
              </label>
              <textarea
                name="targetMarket"
                id="targetMarket"
                value={formData.targetMarket}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Describe your target market and customer segments"
              />
            </div>

            <div>
              <label htmlFor="businessModel" className="block text-sm font-medium text-gray-700">
                Business Model
              </label>
              <textarea
                name="businessModel"
                id="businessModel"
                value={formData.businessModel}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Explain how your business will make money"
              />
            </div>

            <div>
              <label htmlFor="competitiveAdvantage" className="block text-sm font-medium text-gray-700">
                Competitive Advantage
              </label>
              <textarea
                name="competitiveAdvantage"
                id="competitiveAdvantage"
                value={formData.competitiveAdvantage}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="What makes your business unique from competitors?"
              />
            </div>

            <div>
              <label htmlFor="fundingNeeded" className="block text-sm font-medium text-gray-700">
                Funding Required
              </label>
              <input
                type="text"
                name="fundingNeeded"
                id="fundingNeeded"
                value={formData.fundingNeeded}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="e.g., $50,000"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Generate Pitch Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessPitchForm; 
//