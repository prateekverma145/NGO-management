import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 pt-16 pb-8 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-50 dark:bg-blue-900/30 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-purple-50 dark:bg-purple-900/30 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">VolunteerHub</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Connecting passionate volunteers with meaningful opportunities to make a difference in communities around the world.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/volunteer-guide" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  Volunteer Guide
                </Link>
              </li>
              <li>
                <Link to="/organizations" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  For Organizations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  123 Volunteer Street, Community City, 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <a href="tel:+11234567890" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <a href="mailto:info@volunteerhub.com" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                  info@volunteerhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-b border-gray-200 dark:border-gray-700 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Stay updated with the latest volunteer opportunities and community news.</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {currentYear} VolunteerHub. All rights reserved.</p>
          <p className="mt-2">
            Made with <Heart className="h-4 w-4 text-red-500 dark:text-red-400 inline mx-1" /> for communities worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}