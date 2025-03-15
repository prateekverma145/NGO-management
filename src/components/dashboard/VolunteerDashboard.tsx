import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart, FaCalendarCheck, FaUsers, FaChartLine } from 'react-icons/fa';

interface VolunteerDashboardProps {
  data: {
    profile: any;
    stats: {
      opportunitiesJoined: number;
      upcomingOpportunities: number;
      totalDonated: number;
      upcomingEvents: number;
    };
    recentDonations: Array<{
      _id: string;
      amount: number;
      cause: string;
      createdAt: string;
    }>;
    upcomingEvents: Array<{
      _id: string;
      title: string;
      location: string;
      date: string;
      time?: string;
      organizer: {
        name: string;
        organizationName?: string;
      };
    }>;
    registeredOpportunities: Array<{
      _id: string;
      title: string;
      organization: string;
      location: string;
      date: string;
      deadline: string;
      createdBy: {
        name: string;
        organizationName?: string;
      };
    }>;
  };
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">No dashboard data available</h2>
          <p className="text-gray-600 mt-2">Please try again later or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-2xl text-white">{data.profile?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {data.profile?.name}!</h1>
            <p className="text-gray-600">Your volunteer dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Opportunities Joined</p>
              <h2 className="text-3xl font-bold text-gray-900">{data.stats.opportunitiesJoined}</h2>
            </div>
            <FaUsers className="text-4xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Upcoming Opportunities</p>
              <h2 className="text-3xl font-bold text-gray-900">{data.stats.upcomingOpportunities}</h2>
            </div>
            <FaCalendarCheck className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Donated</p>
              <h2 className="text-3xl font-bold text-gray-900">₹{data.stats.totalDonated}</h2>
            </div>
            <FaHandHoldingHeart className="text-4xl text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Upcoming Events</p>
              <h2 className="text-3xl font-bold text-gray-900">{data.stats.upcomingEvents}</h2>
            </div>
            <FaChartLine className="text-4xl text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Donations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Donations</h3>
            <Link to="/donate" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          
          {data.recentDonations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No donations yet</p>
              <Link to="/donate" className="mt-2 inline-block text-blue-600 hover:underline">Make your first donation</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentDonations.map((donation) => (
                <div key={donation._id} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">₹{donation.amount}</p>
                      <p className="text-sm text-gray-500">{donation.cause}</p>
                      {/* <p className="text-sm text-gray-500">{donation.organizationName}</p> */}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(donation.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Events</h3>
            <Link to="/events" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          
          {data.upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming events</p>
              <Link to="/events" className="mt-2 inline-block text-blue-600 hover:underline">Browse events</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.upcomingEvents.map((event) => (
                <div key={event._id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {event.organizer.organizationName || event.organizer.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {formatDate(event.date)}
                      </p>
                      {event.time && <p className="text-sm text-gray-500">{event.time}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Registered Opportunities */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Your Volunteer Opportunities</h3>
          <Link to="/opportunities" className="text-sm text-blue-600 hover:underline">Find More</Link>
        </div>
        
        {data.registeredOpportunities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't registered for any opportunities yet</p>
            <Link to="/opportunities" className="mt-2 inline-block text-blue-600 hover:underline">
              Browse volunteer opportunities
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.registeredOpportunities.map((opportunity) => (
                  <tr key={opportunity._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/opportunities/${opportunity._id}`} className="text-blue-600 hover:underline">
                        {opportunity.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {opportunity.organization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {opportunity.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(opportunity.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(opportunity.deadline)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{data.profile.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Member Since</p>
            <p className="font-medium">
              {formatDate(data.profile.createdAt)}
            </p>
          </div>
          {data.profile.phone && (
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{data.profile.phone}</p>
            </div>
          )}
          {data.profile.interests && (
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
  );
};

export default VolunteerDashboard; 