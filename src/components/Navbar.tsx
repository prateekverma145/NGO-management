import { Menu, User, BarChart, LogOut, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a preference stored in localStorage
    const savedMode = localStorage.getItem('darkMode');
    // Check if user prefers dark mode in their OS settings
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return savedMode ? savedMode === 'true' : prefersDark;
  });

  useEffect(() => {
    // Apply dark mode class to the document element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={handleMenuItemClick}>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">VolunteerHub</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/opportunities" 
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Opportunities
              </Link>
              <Link 
                to="/events" 
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Events
              </Link>
              <Link 
                to="/donate" 
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Donate
              </Link>
              <Link 
                to="/forum" 
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Forum
              </Link>
            </div>
          </div>

          {/* Desktop Authentication Section */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                >
                  <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</span>
                    <span className="text-base font-semibold text-blue-600 dark:text-blue-300">
                      {user?.name}
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleMenuItemClick}
                    >
                      <BarChart className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      Dashboard
                    </Link>
                    <Link
                      to="/my-events"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleMenuItemClick}
                    >
                      My Events
                    </Link>
                    {user?.userType === 'volunteer' && (
                      <Link
                        to="/donations/history"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleMenuItemClick}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Donation History
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            {/* Dark Mode Toggle (Mobile) */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 mr-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
            {/* Mobile Navigation Links */}
            {['opportunities', 'events', 'donate', 'forum'].map((item) => (
              <Link
                key={item}
                to={`/${item}`}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                onClick={handleMenuItemClick}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}

            {/* Mobile Authentication Section */}
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/30 rounded-md mx-2">
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="ml-3 flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</span>
                        <span className="text-base font-semibold text-blue-600 dark:text-blue-300">
                          {user?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/dashboard"
                    className="block mx-2 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleMenuItemClick}
                  >
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      Dashboard
                    </div>
                  </Link>
                  
                  <Link
                    to="/my-events"
                    className="block mx-2 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleMenuItemClick}
                  >
                    My Events
                  </Link>
                  
                  {user?.userType === 'volunteer' && (
                    <Link
                      to="/donations/history"
                      className="block mx-2 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleMenuItemClick}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Donation History
                      </div>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="mx-2 w-[calc(100%-16px)] flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-1 px-2">
                  <Link
                    to="/signin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={handleMenuItemClick}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                    onClick={handleMenuItemClick}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;