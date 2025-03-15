import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';
import NGODashboard from '../components/dashboard/NGODashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [volunteerData, setVolunteerData] = useState(null);
  const [ngoData, setNgoData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication token not found');
        setLoading(false);
        return;
      }

      // Determine which dashboard to fetch based on user type
      const endpoint = user?.userType === 'ngo' 
        ? 'http://localhost:5000/api/dashboard/ngo' 
        : 'http://localhost:5000/api/dashboard/volunteer';

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load dashboard data');
      }

      const result = await response.json();
      
      if (user?.userType === 'ngo') {
        setNgoData(result.data);
      } else {
        setVolunteerData(result.data);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user type
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {user?.userType === 'ngo' ? (
        <NGODashboard data={ngoData} />
      ) : (
        <VolunteerDashboard data={volunteerData} />
      )}
    </div>
  );
};

export default Dashboard;