import { Link } from 'react-router-dom';

const features = [
  {
    title: 'AI Business Assistant',
    description: 'Get instant answers about business planning, market research, and startup advice.',
    path: '/chat',
  },
  {
    title: 'Business Map',
    description: 'Explore local demographics and business opportunities in your area.',
    path: '/map',
  },
  {
    title: 'Pitch Generator',
    description: 'Create professional pitch documents in minutes with our AI-powered tool.',
    path: '/pitch',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="text-4xl font-bold mb-4">
              Transform Your Business Ideas into Reality
            </h1>
            <p className="text-xl mb-8">
              Use AI-powered insights, local market analysis, and professional pitch documents to launch your business successfully.
            </p>
            <div className="flex justify-between" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Link to="/chat" className="btn btn-secondary">
                Get Started
              </Link>
              <Link to="/map" className="btn btn-primary">
                Explore Opportunities
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-16">
        <h2 className="text-xl font-bold text-center mb-12">
          Everything you need to start your business
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {features.map((feature) => (
            <Link 
              key={feature.title} 
              to={feature.path}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              style={{ textDecoration: 'none' }}
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container text-center">
          <h2 className="text-xl font-bold mb-4">Ready to start your business journey?</h2>
          <p className="mb-8">
            Get started today with our AI-powered tools and turn your business idea into reality.
          </p>
          <Link to="/chat" className="btn btn-secondary">
            Start Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 


