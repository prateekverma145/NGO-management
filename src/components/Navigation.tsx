import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link 
              to="/opportunities" 
              className="inline-flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              Opportunities
            </Link>
            <Link 
              to="/events" 
              className="inline-flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              Events
            </Link>
            <Link 
              to="/donate" 
              className="inline-flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              Donate
            </Link>
            <Link 
              to="/forum" 
              className="inline-flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              Forum
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;