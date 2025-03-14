import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface IOpportunity {
  _id: string;
  title: string;
  organization: string;
  location: string;
  date: string;
  image: string;
  category: string;
  volunteers: number;
  description: string;
  createdBy: {
    _id: string;
    name: string;
    organizationName: string;
  };
  hoursPerWeek: string;
  deadline: string;
  impact: string;
  status: 'open' | 'closed';
  registeredVolunteers: string[];
  availableSpots: number;
}

const sampleOpportunities = [
  {
    title: "Youth Mentorship Program Coordinator",
    type: "Leadership",
    location: "Local Community Centers",
    deadline: "Ongoing",
    commitment: "10-15 hours/week",
    impact: "Support 50+ youth",
    description: "Lead our youth mentorship initiative by coordinating volunteer mentors and organizing weekly activities. Help shape the future of local youth through educational and personal development programs. Training provided."
  },
  {
    title: "Food Bank Distribution Manager",
    type: "Volunteer Management",
    location: "Multiple Locations",
    deadline: "May 30, 2024",
    commitment: "8-12 hours/week",
    impact: "Serve 200+ families",
    description: "Coordinate food distribution events, manage volunteer schedules, and ensure efficient operation of our food bank services. Help provide essential support to families in need while developing leadership skills."
  },
  {
    title: "Environmental Conservation Team Lead",
    type: "Project Management",
    location: "City Parks & Green Spaces",
    deadline: "April 25, 2024",
    commitment: "Weekends",
    impact: "Local ecosystem restoration",
    description: "Lead community clean-up initiatives, organize tree planting events, and coordinate environmental education workshops. Perfect for those passionate about environmental sustainability and community engagement."
  },
  {
    title: "Senior Care Volunteer Coordinator",
    type: "Healthcare Support",
    location: "Local Senior Centers",
    deadline: "Ongoing",
    commitment: "15-20 hours/week",
    impact: "Support 100+ seniors",
    description: "Manage volunteer programs for senior care facilities, organize social activities, and coordinate companionship visits. Make a difference in the lives of elderly community members while gaining healthcare volunteer management experience."
  },
  {
    title: "Literacy Program Director",
    type: "Education",
    location: "Public Libraries",
    deadline: "May 15, 2024",
    commitment: "12-15 hours/week",
    impact: "Literacy support for 75+ learners",
    description: "Direct our community literacy program, train volunteer tutors, and develop educational materials. Help improve literacy rates in our community while managing a team of dedicated volunteers."
  },
  {
    title: "Homeless Shelter Volunteer Manager",
    type: "Crisis Support",
    location: "Downtown Shelter",
    deadline: "Immediate",
    commitment: "20 hours/week",
    impact: "Support 150+ individuals",
    description: "Coordinate volunteer shifts at our homeless shelter, manage donation drives, and organize meal service programs. Gain experience in crisis management while helping provide essential services to vulnerable populations."
  }
];

const Opportunities: React.FC = () => {
  const { token, user } = useAuth();
  const [opportunities, setOpportunities] = useState<IOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, [token]);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/opportunities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setOpportunities(data.data);
      } else {
        setError(data.message || 'Failed to fetch opportunities');
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteer = async (opportunityId: string) => {
    if (!token || !user) {
      toast.error('Please login to register for opportunities');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/opportunities/register/${opportunityId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully registered for the opportunity!');
        fetchOpportunities();
      } else {
        toast.error(data.message || 'Failed to register');
      }
    } catch (error) {
      toast.error('Error registering for opportunity');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Community Service Opportunities</h1>
          <p className="text-gray-600 mt-2">Join our community of dedicated volunteers making a difference in people's lives.</p>
        </div>
        {user?.userType === 'ngo' && (
          <Link
            to="/opportunities/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Opportunity
          </Link>
        )}
      </div>

      {/* Real Opportunities Section */}
      {opportunities.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Current Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <div key={opportunity._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {opportunity.title}
                    </h2>
                    <span className="inline-block px-2 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded">
                      {opportunity.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{opportunity.organization}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {opportunity.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Deadline: {opportunity.deadline}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <span className="text-sm font-medium text-gray-700">Impact: </span>
                    <span className="text-sm text-gray-600">{opportunity.impact}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {opportunity.description}
                  </p>
                  
                  <button
                    onClick={() => handleVolunteer(opportunity._id)}
                    disabled={!token || !user || opportunity.registeredVolunteers.includes(user?._id || '')}
                    className={`w-full font-semibold py-2 px-4 rounded transition duration-300 ${
                      !token || !user
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : opportunity.registeredVolunteers.includes(user?._id || '')
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {!token || !user
                      ? 'Login to Register'
                      : opportunity.registeredVolunteers.includes(user?._id || '')
                      ? 'Already Registered'
                      : 'Volunteer Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Opportunities Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Featured Sample Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleOpportunities.map((opportunity, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {opportunity.title}
                  </h2>
                  <span className="inline-block px-2 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded">
                    {opportunity.type}
                  </span>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {opportunity.location}
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {opportunity.commitment}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline: {opportunity.deadline}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <span className="text-sm font-medium text-gray-700">Impact: </span>
                  <span className="text-sm text-gray-600">{opportunity.impact}</span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {opportunity.description}
                </p>
                
                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                  onClick={() => toast.success('This is a sample opportunity. Please check the current opportunities above.')}
                >
                  Volunteer Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Opportunities;