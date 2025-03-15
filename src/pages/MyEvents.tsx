import React, { useState, useEffect } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Event {
  _id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: {
    _id: string;
    name: string;
    organizationName?: string;
  };
  imageUrl: string;
}

const MyEvents: React.FC = () => {
  const { token, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  useEffect(() => {
    if (token) {
      fetchMyEvents();
    }
  }, [token, filter]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/events/my-events?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch registered events');
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error loading registered events:', error);
      toast.error('Failed to load your registered events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!token) {
      toast.error('Please sign in to unregister from events');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/unregister`, {
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

      // Remove the event from the list
      setEvents(events.filter(event => event._id !== eventId));
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
        <div className="text-xl">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Registered Events</h1>
          <p className="mt-1 text-gray-600">Manage your event registrations</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link
            to="/events"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Events
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            filter === 'upcoming'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming Events
        </button>
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            filter === 'past'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setFilter('past')}
        >
          Past Events
        </button>
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            filter === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setFilter('all')}
        >
          All Events
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No registered events found</h2>
          <p className="text-gray-600 mb-6">
            {filter === 'upcoming' 
              ? "You don't have any upcoming events. Browse events to find opportunities to participate."
              : filter === 'past'
              ? "You haven't participated in any past events yet."
              : "You haven't registered for any events yet. Browse events to find opportunities to participate."}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => {
            const upcoming = isUpcoming(event.date);
            return (
              <div 
                key={event._id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  upcoming ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex-1">
                      <Link to={`/events/${event._id}`} className="block">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          {event.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaCalendar className="mr-2" />
                        <span>{formatDate(event.date)}</span>
                        {event.time && (
                          <>
                            <FaClock className="ml-4 mr-2" />
                            <span>{event.time}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="text-gray-600 mb-4">
                        <p className="text-sm">
                          Organized by: {event.organizer?.organizationName || event.organizer?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end mt-4 md:mt-0">
                      {upcoming && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to unregister from this event?')) {
                              handleUnregister(event._id);
                            }
                          }}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          <FaTrash className="mr-2" />
                          Unregister
                        </button>
                      )}
                      
                      <Link
                        to={`/events/${event._id}`}
                        className="mt-2 text-blue-600 hover:underline text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  {upcoming && event.date === new Date().toISOString().split('T')[0] && (
                    <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEvents; 