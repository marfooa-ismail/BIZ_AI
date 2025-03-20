


import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", path: "/" },
  { name: "Chat", path: "/chat" },
  { name: "Map", path: "/map" },
  { name: "Pitch Generator", path: "/pitch" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCurrentPath = (path) => location.pathname === path;

  const mobileMenuVariants = {
    open: { x: 0 },
    closed: { x: "100%" },
  };

  return (
    <nav className="bg-blue-600 shadow-md fixed w-full top-0 z-50 mt-0">
      <div className="max-w-6xl ">
        <div className="flex justify-between items-center ">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            BizNexus AI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isCurrentPath(item.path)
                    ? "text-blue-600 bg-white"
                    : "text-white hover:bg-blue-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - Black Version */}
          <button
            className="md:hidden px-4 py-2 rounded-lg focus:outline-none 
              bg-black hover:bg-gray-800 text-black font-semibold
              transition-colors duration-200 shadow-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              transition={{ type: "tween", duration: 0.2 }}
              className="md:hidden fixed inset-y-0 right-0 w-64 bg-blue-600 shadow-xl z-50"
            >
              <div className="p-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-4 py-3 rounded-lg mb-2 font-medium transition-all ${
                      isCurrentPath(item.path)
                        ? "text-blue-600 bg-white"
                        : "text-black hover:bg-blue-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;