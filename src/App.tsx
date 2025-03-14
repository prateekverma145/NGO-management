import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Opportunities from './pages/Opportunities';
import Events from './pages/Events';
import Donate from './pages/Donate';
import Forum from './pages/Forum';
import SignIn from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import OTPVerification from './pages/OTPVerification';
import ProtectedRoute from './components/ProtectedRoute';
import CreateOpportunityForm from './components/CreateOpportunityForm';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/verify-otp" element={<OTPVerification />} />

              {/* Protected Routes */}
              <Route
                path="/opportunities"
                element={
                  <ProtectedRoute>
                    <Opportunities />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donate"
                element={
                  <ProtectedRoute>
                    <Donate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forum"
                element={
                  <ProtectedRoute>
                    <Forum />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/opportunities/create"
                element={
                  <ProtectedRoute>
                    <CreateOpportunityForm />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Page not found</h2>
                    <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;