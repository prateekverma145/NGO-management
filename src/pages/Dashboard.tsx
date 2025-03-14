import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaHandHoldingHeart, FaCalendarCheck, FaUsers, FaChartLine } from 'react-icons/fa';

interface DashboardData {
  profile: any;
  recentDonations: any[];
  totalDonated: number;
  upcomingEvents: any[];
  impactStats: {
    totalDonations: number;
    eventsJoined: number;
    causesSupported: number;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setData(result.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-2xl text-white">{data?.profile.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {data?.profile.name}!</h1>
              <p className="text-gray-600">Your impact dashboard</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Donated</p>
                <h2 className="text-3xl font-bold text-gray-900">₹{data?.totalDonated}</h2>
              </div>
              <FaHandHoldingHeart className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Events Joined</p>
                <h2 className="text-3xl font-bold text-gray-900">{data?.impactStats.eventsJoined}</h2>
              </div>
              <FaCalendarCheck className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Causes Supported</p>
                <h2 className="text-3xl font-bold text-gray-900">{data?.impactStats.causesSupported}</h2>
              </div>
              <FaUsers className="text-4xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Donations</p>
                <h2 className="text-3xl font-bold text-gray-900">{data?.impactStats.totalDonations}</h2>
              </div>
              <FaChartLine className="text-4xl text-orange-500" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Donations */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Donations</h3>
            <div className="space-y-4">
              {data?.recentDonations.map((donation) => (
                <div key={donation._id} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">₹{donation.amount}</p>
                      <p className="text-sm text-gray-500">{donation.cause}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {data?.upcomingEvents.map((event) => (
                <div key={event._id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{data?.profile.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Member Since</p>
              <p className="font-medium">
                {new Date(data?.profile.createdAt).toLocaleDateString()}
              </p>
            </div>
            {data?.profile.phone && (
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{data?.profile.phone}</p>
              </div>
            )}
            {data?.profile.interests && (
              <div>
                <p className="text-gray-500">Interests</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.isArray(data.profile.interests) 
                    ? data.profile.interests.map((interest: string) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))
                    : typeof data.profile.interests === 'string' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {data.profile.interests}
                        </span>
                      )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;