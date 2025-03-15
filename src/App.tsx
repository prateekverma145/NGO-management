import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import SignInPage from './pages/signIn';
import SignUpPage from './pages/signUp';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import CreateOpportunity from './pages/CreateOpportunity';
import Forum from './pages/Forum';
import ForumPost from './pages/ForumPost';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Donate from './pages/Donate';
import OTPVerification from './pages/OTPVerification';
import ReceivedDonations from './pages/ReceivedDonations';
import DonationHistory from './pages/DonationHistory';
import MyEvents from './pages/MyEvents';
import EventDetails from './pages/EventDetails';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if ((savedMode && savedMode === 'true') || (!savedMode && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Navbar />
          <main className="flex-grow bg-gray-50 dark:bg-gray-900">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/:id" element={<ForumPost />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/events" element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } />
              <Route path="/events/:id" element={
                <ProtectedRoute>
                  <EventDetails />
                </ProtectedRoute>
              } />
              <Route path="/donate" element={
                <ProtectedRoute>
                  <Donate />
                </ProtectedRoute>
              } />
              <Route path="/donations/history" element={
                <ProtectedRoute>
                  <DonationHistory />
                </ProtectedRoute>
              } />
              
              {/* NGO Only Routes */}
              <Route
                path="/opportunities/create"
                element={
                  <ProtectedRoute>
                    <CreateOpportunity />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/events/create"
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/donations/received"
                element={
                  <ProtectedRoute>
                    <ReceivedDonations />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/my-events" element={
                <ProtectedRoute>
                  <MyEvents />
                </ProtectedRoute>
              } />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster 
          position="top-right" 
          toastOptions={{
            // Customize toast styles for dark mode
            className: '',
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;