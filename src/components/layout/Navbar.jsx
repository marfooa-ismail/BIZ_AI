import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 shadow-lg fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">BizNexus AI</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/')}`}
              >
                Home
              </Link>
              <Link
                to="/chat"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/chat')}`}
              >
                AI Assistant
              </Link>
              <Link
                to="/map"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/map')}`}
              >
                Business Map
              </Link>
              <Link
                to="/pitch"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/pitch')}`}
              >
                Create Pitch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 