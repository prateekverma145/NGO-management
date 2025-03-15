import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface Event {
  _id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  participants: any[];
  imageUrl: string;
  isRegistered: boolean;
  organizer: {
    _id: string;
    name: string;
    organizationName?: string;
  };
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setEvent(data.data);
      } else {
        toast.error('Event not found');
        navigate('/events');
      }
    } catch (error) {
      console.error('Error loading event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;
    
    if (!token || !user) {
      toast.error('Please sign in to register for events');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const registrationData = {
      eventId: event._id,
      fullName: formData.get('fullName') || user.name,
      email: formData.get('email') || user.email,
      phone: formData.get('phone') || '',
    };

    try {
      const response = await fetch(`http://localhost:5000/api/events/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Update local state
      setEvent(prev => prev ? { ...prev, isRegistered: true } : null);
      toast.success('Successfully registered for the event!');
      setShowRegistration(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
      console.error('Registration error:', error);
    }
  };

  const handleUnregister = async () => {
    if (!event) return;
    
    if (!token || !user) {
      toast.error('Please sign in to unregister from events');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${event._id}/unregister`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unregistration failed');
      }

      // Update local state
      setEvent(prev => prev ? { ...prev, isRegistered: false } : null);
      toast.success('Successfully unregistered from the event');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to unregister');
      console.error('Unregistration error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Event not found</div>
      </div>
    );
  }

  const upcoming = isUpcoming(event.date);
  const isToday = event.date === new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Back to Events
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Event Image */}
        <div className="relative h-64 md:h-96 bg-gray-300">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b';
            }}
          />
          
          {/* Event Type Badge */}
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            {event.type.charAt(0).toUpperCase() + event.type.slice(1).replace('-', ' ')}
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="flex items-center text-gray-600 mb-4">
                <FaCalendar className="mr-3 text-blue-600" />
                <div>
                  <div className="font-medium">Date</div>
                  <div>{formatDate(event.date)}</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <FaClock className="mr-3 text-blue-600" />
                <div>
                  <div className="font-medium">Time</div>
                  <div>{event.time}</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-3 text-blue-600" />
                <div>
                  <div className="font-medium">Location</div>
                  <div>{event.location}</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <FaUsers className="mr-3 text-blue-600" />
                <div>
                  <div className="font-medium">Participants</div>
                  <div>{Array.isArray(event.participants) ? event.participants.length : 0} registered</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Organizer Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Organized by</h3>
            <p className="text-gray-700">
              {event.organizer?.organizationName || event.organizer?.name || 'Unknown'}
            </p>
          </div>
          
          {/* Event Description */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">About this event</h3>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
          
          {/* Today Alert */}
          {upcoming && isToday && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-10a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>This event is today!</strong> Make sure you're prepared and arrive on time.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Registration/Unregistration Buttons */}
          {user && (
            <div className="flex flex-col sm:flex-row gap-4">
              {event.isRegistered ? (
                <>
                  <div className="px-6 py-3 bg-green-100 text-green-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    You are registered for this event
                  </div>
                  
                  {upcoming && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to unregister from this event?')) {
                          handleUnregister();
                        }
                      }}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cancel Registration
                    </button>
                  )}
                </>
              ) : (
                upcoming && (
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register for this Event
                  </button>
                )
              )}
              
              <Link
                to="/my-events"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                View My Events
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              Register for {event.title}
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Date:</span> {formatDate(event.date)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Time:</span> {event.time}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Location:</span> {event.location}
              </p>
            </div>

            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  defaultValue={user?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistration(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails; 