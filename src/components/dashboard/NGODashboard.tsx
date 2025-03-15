import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaHandHoldingHeart, FaCalendarCheck, FaUsers, FaChartLine } from 'react-icons/fa';

interface NGODashboardProps {
  data: {
    profile: any;
    stats: {
      totalOpportunities: number;
      liveOpportunities: number;
      closedOpportunities: number;
      totalVolunteers: number;
      totalDonationsReceived: number;
    };
    recentDonations: Array<{
      _id: string;
      amount: number;
      cause: string;
      createdAt: string;
      userId: {
        name: string;
      };
    }>;
    upcomingEvents: Array<{
      _id: string;
      title: string;
      location: string;
      date: string;
      time?: string;
    }>;
    opportunities: {
      live: Array<{
        _id: string;
        title: string;
        location: string;
        date: string;
        deadline: string;
        volunteers: number;
        registeredVolunteers: Array<any>;
        availableSpots: number;
      }>;
      closed: Array<{
        _id: string;
        title: string;
        location: string;
        date: string;
        deadline: string;
        volunteers: number;
        registeredVolunteers: Array<any>;
      }>;
    };
  };
}

const NGODashboard: React.FC<NGODashboardProps> = ({ data }) => {
  const navigate = useNavigate();
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
            <span className="text-2xl text-white">{data.profile?.organizationName?.[0] || data.profile?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {data.profile?.organizationName || data.profile?.name}!
            </h1>
            <p className="text-gray-600">Your NGO dashboard</p>
          </div>
        </div>
      </div>

      {/* Donation Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div onClick={() => navigate('/donations/received')}>
            <h2 className="text-xl font-semibold mb-2">Total Donations Received</h2>
            <p className="text-sm opacity-80">Support from your generous donors</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-4xl font-bold">₹{data.stats.totalDonationsReceived.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Opportunities</p>
              <h2 className="text-3xl font-bold text-gray-900">{data.stats.totalOpportunities}</h2>
            </div>
            <FaChartLine className="text-4xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Live Opportunities</p>
              <h2 className="text-3xl font-bold text-gray-900">{data.stats.liveOpportunities}</h2>
            </div>
            <FaCalendarCheck className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Closed Opportunities</p>
              <h2 className="text-3xl font-bold text-gray-900">{data.stats.closedOpportunities}</h2>
            </div>
            <FaCalendarCheck className="text-4xl text-gray-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Volunteers</p>
              <h2 className="text-3xl font-bold text-gray-900">{data.stats.totalVolunteers}</h2>
            </div>
            <FaUsers className="text-4xl text-purple-500" />
          </div>
        </div>
      </div>

      {/* Live Opportunities */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Live Opportunities</h3>
          <Link to="/opportunities/create" className="text-sm text-blue-600 hover:underline">Create New</Link>
        </div>
        
        {data.opportunities.live.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No live opportunities</p>
            <Link to="/opportunities/create" className="mt-2 inline-block text-blue-600 hover:underline">
              Create your first opportunity
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
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteers
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.opportunities.live.map((opportunity) => (
                  <tr key={opportunity._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/opportunities/${opportunity._id}`} className="text-blue-600 hover:underline">
                        {opportunity.title}
                      </Link>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-600 font-medium">
                        {opportunity.registeredVolunteers.length} / {opportunity.volunteers}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({opportunity.availableSpots} spots left)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Closed Opportunities */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Closed Opportunities</h3>
        </div>
        
        {data.opportunities.closed.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No closed opportunities</p>
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
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteers
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.opportunities.closed.map((opportunity) => (
                  <tr key={opportunity._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/opportunities/${opportunity._id}`} className="text-blue-600 hover:underline">
                        {opportunity.title}
                      </Link>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600 font-medium">
                        {opportunity.registeredVolunteers.length} / {opportunity.volunteers}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        (Closed)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Donations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Donations Received</h3>
            <Link to="/donations/received" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          
          {data.recentDonations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No donations received yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentDonations.map((donation) => (
                <div key={donation._id} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">₹{donation.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{donation.cause}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        From {donation.userId.name}
                      </p>
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
            </div>
          ) : (
            <div className="space-y-4">
              {data.upcomingEvents.map((event) => (
                <div key={event._id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
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

      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Organization Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500">Organization Name</p>
            <p className="font-medium">{data.profile.organizationName || data.profile.name}</p>
          </div>
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
          {data.profile.address && (
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium">{data.profile.address}</p>
            </div>
          )}
          {data.profile.website && (
            <div>
              <p className="text-gray-500">Website</p>
              <a 
                href={data.profile.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {data.profile.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGODashboard; 