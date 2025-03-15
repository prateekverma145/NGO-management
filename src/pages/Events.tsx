import React, { useState, useEffect } from 'react';
import { FaCalendar, FaBell, FaMapMarkerAlt, FaUsers, FaFilter, FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Event {
  _id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  participants: number | any[];
  imageUrl: string;
  isRegistered: boolean;
  notificationEnabled: boolean;
  organizer?: any;
}

const sampleEvents: Event[] = [
  {
    _id: '1',
    title: 'City Park Cleanup Drive',
    type: 'cleanliness',
    date: '2024-04-15',
    time: '09:00 AM',
    location: 'Central Park',
    description:
      'Join us for our monthly park cleanup initiative. Together we can make our parks cleaner and safer for everyone.',
    participants: 45,
    imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f',
    isRegistered: false,
    notificationEnabled: false,
  },
  {
    _id: '2',
    title: 'Food Distribution Drive',
    type: 'charity',
    date: '2024-04-20',
    time: '10:00 AM',
    location: 'Community Center',
    description:
      'Help us distribute food packages to families in need. Your small effort can make a big difference.',
    participants: 30,
    imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6',
    isRegistered: false,
    notificationEnabled: false,
  },
  {
    _id: '3',
    title: 'Emergency Flood Relief',
    type: 'disaster-relief',
    date: '2024-04-25',
    time: '08:00 AM',
    location: 'Riverside Community',
    description:
      'Urgent relief effort to help families affected by recent flooding. We need volunteers for supply distribution and cleanup.',
    participants: 85,
    imageUrl: 'https://images.unsplash.com/photo-1587502537745-84b86da1204f',
    isRegistered: false,
    notificationEnabled: false,
  },
  {
    _id: '4',
    title: 'Beach Cleanup Initiative',
    type: 'cleanliness',
    date: '2024-05-01',
    time: '07:30 AM',
    location: 'Sunset Beach',
    description:
      'Join our monthly beach cleanup drive to protect marine life and keep our beaches beautiful for everyone.',
    participants: 60,
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5',
    isRegistered: false,
    notificationEnabled: false,
  },
  {
    _id: '5',
    title: 'Childrens Education Drive',
    type: 'charity',
    date: '2024-05-05',
    time: '10:30 AM',
    location: 'City Library',
    description:
      'Help distribute school supplies and books to underprivileged children. Every child deserves quality education.',
    participants: 40,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
    isRegistered: false,
    notificationEnabled: false,
  },
  {
    _id: '6',
    title: 'Senior Citizens Support',
    type: 'charity',
    date: '2024-05-10',
    time: '09:00 AM',
    location: 'Golden Age Center',
    description:
      'Spend time with elderly residents and help with basic needs. Your company means the world to them.',
    participants: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a',
    isRegistered: false,
    notificationEnabled: false,
  },
  {
    _id: '7',
    title: 'Earthquake Relief Campaign',
    type: 'disaster-relief',
    date: '2024-05-15',
    time: '08:00 AM',
    location: 'Relief Center',
    description:
      'Emergency relief effort for earthquake-affected areas. We need volunteers for medical aid and supply distribution.',
    participants: 120,
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b',
    isRegistered: false,
    notificationEnabled: false,
  },
  {
    _id: '8',
    title: 'River Cleanup Project',
    type: 'cleanliness',
    date: '2024-05-20',
    time: '08:30 AM',
    location: 'River Valley Park',
    description:
      'Help us clean and preserve our local river ecosystem. Equipment and refreshments will be provided.',
    participants: 55,
    imageUrl: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3',
    isRegistered: false,
    notificationEnabled: false,
  },
  {
    _id: '9',
    title: 'Community Garden Initiative',
    type: 'cleanliness',
    date: '2024-05-25',
    time: '09:00 AM',
    location: 'Urban Community Garden',
    description:
      'Help us create a sustainable community garden! We will be planting vegetables, fruits, and flowers. Learn gardening skills while contributing to local food security.',
    participants: 35,
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
    isRegistered: false,
    notificationEnabled: false,
  },
];

const Events: React.FC = () => {
  const { token, user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [events, setEvents] = useState<Event[]>(sampleEvents); // Initialize with sample events
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (token) {
      fetchEvents();
      fetchNotificationPreferences();
    }
  }, [token, user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        console.log('Fetched events:', data.data);
        
        // Transform the API response to match our Event interface
        const transformedEvents = data.data.map((event: any) => {
          // Check if the current user is registered for this event
          const isUserRegistered = user && Array.isArray(event.participants) && 
            event.participants.some((p: any) => {
              const participantId = typeof p === 'string' ? p : p._id;
              return participantId === user._id;
            });
          
          return {
            ...event,
            participants: Array.isArray(event.participants) ? event.participants.length : 
                         (typeof event.participants === 'number' ? event.participants : 0),
            isRegistered: isUserRegistered || false,
            notificationEnabled: notificationStatus[event._id] || false
          };
        });
        
        setEvents(transformedEvents);
      } else {
        console.log('Using sample events as fallback');
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events. Using sample data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationPreferences = async () => {
    if (!token || !user) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/users/notification-preferences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.preferences) {
          const preferences: Record<string, boolean> = {};
          data.preferences.forEach((pref: any) => {
            preferences[pref.eventId] = true;
          });
          setNotificationStatus(preferences);
        }
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  const handleNotificationToggle = async (eventId: string) => {
    if (!token || !user) {
      toast.error('Please sign in to enable notifications');
      return;
    }
    
    try {
      // Optimistically update UI
      const newStatus = !notificationStatus[eventId];
      setNotificationStatus(prev => ({
        ...prev,
        [eventId]: newStatus
      }));
      
      // Update events state to reflect notification change
      setEvents(events.map(event =>
        event._id === eventId
          ? { ...event, notificationEnabled: newStatus }
          : event
      ));
      
      // Send request to backend
      const response = await fetch('http://localhost:5000/api/users/notification-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          eventId,
          enabled: newStatus
        }),
      });

      if (!response.ok) {
        // Revert changes if request fails
        setNotificationStatus(prev => ({
          ...prev,
          [eventId]: !newStatus
        }));
        
        setEvents(events.map(event =>
          event._id === eventId
            ? { ...event, notificationEnabled: !newStatus }
            : event
        ));
        
        throw new Error('Failed to update notification preference');
      }

      toast.success(newStatus ? 'Notifications enabled' : 'Notifications disabled');
    } catch (error) {
      console.error('Notification toggle error:', error);
      toast.error('Failed to update notification preference');
    }
  };

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    if (!token || !user) {
      toast.error('Please sign in to register for events');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const registrationData = {
      eventId: selectedEvent._id,
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
      setEvents(events.map(event =>
        event._id === selectedEvent._id
          ? { ...event, isRegistered: true, participants: typeof event.participants === 'number' ? event.participants + 1 : 1 }
          : event
      ));

      toast.success('Successfully registered for the event!');
      setShowRegistration(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
      console.error('Registration error:', error);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!token || !user) {
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

      // Update local state
      setEvents(events.map(event =>
        event._id === eventId
          ? { ...event, isRegistered: false, participants: typeof event.participants === 'number' ? event.participants - 1 : 0 }
          : event
      ));

      toast.success('Successfully unregistered from the event');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to unregister');
      console.error('Unregistration error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="mt-1 text-gray-600">Join events and make a difference in your community</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          {user?.userType === 'volunteer' && (
            <>
              <Link
                to="/my-events"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                My Registered Events
              </Link>
              
              <button
                onClick={async () => {
                  if (!token) {
                    toast.error('Please sign in to request weekly digest');
                    return;
                  }
                  
                  try {
                    const response = await fetch('http://localhost:5000/api/notifications/request-digest', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      }
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to request weekly digest');
                    }
                    
                    const data = await response.json();
                    toast.success(data.message || 'Weekly digest requested successfully');
                  } catch (error) {
                    console.error('Error requesting digest:', error);
                    toast.error('Failed to request weekly digest');
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Get Weekly Digest
              </button>
              
              <button
                onClick={async () => {
                  if (!token) {
                    toast.error('Please sign in to request today\'s reminders');
                    return;
                  }
                  
                  try {
                    const response = await fetch('http://localhost:5000/api/notifications/request-today-reminders', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      }
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to request today\'s reminders');
                    }
                    
                    const data = await response.json();
                    toast.success(data.message || 'Today\'s reminders requested successfully');
                  } catch (error) {
                    console.error('Error requesting reminders:', error);
                    toast.error('Failed to request today\'s reminders');
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Today's Reminders
              </button>
            </>
          )}
          
          {user?.userType === 'ngo' && (
            <Link
              to="/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Event
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            <FaFilter /> All
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeFilter === 'charity'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('charity')}
          >
            <FaHeart /> Charity
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeFilter === 'cleanliness'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('cleanliness')}
          >
            <FaUsers /> Cleanliness
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeFilter === 'disaster-relief'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setActiveFilter('disaster-relief')}
          >
            <FaUsers /> Disaster Relief
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 text-lg">No events found. Please check back later.</p>
          </div>
        ) : (
          events
            .filter(
              (event) =>
                (activeFilter === 'all' || event.type === activeFilter) &&
                (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  event.location.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <Link to={`/events/${event._id}`}>
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b';
                      }}
                    />
                  </Link>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleNotificationToggle(event._id)}
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        notificationStatus[event._id] || event.notificationEnabled
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600'
                      }`}
                      title={notificationStatus[event._id] || event.notificationEnabled ? "Disable notifications" : "Enable notifications"}
                    >
                      <FaBell />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                    <FaCalendar />
                    <span>
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </span>
                  </div>

                  <Link to={`/events/${event._id}`} className="block">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                  </div>

                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUsers />
                      <span>
                        {typeof event.participants === 'number' 
                          ? event.participants 
                          : Array.isArray(event.participants) 
                            ? (event.participants as any[]).length 
                            : 0} participants
                      </span>
                    </div>

                    {event.isRegistered ? (
                      <div className="flex gap-2">
                        <button
                          className="px-6 py-2 rounded-lg bg-green-600 text-white"
                          disabled
                        >
                          Registered
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to unregister from this event?')) {
                              handleUnregister(event._id);
                            }
                          }}
                          className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (!token) {
                            toast.error('Please sign in to register for events');
                            return;
                          }
                          setSelectedEvent(event);
                          setShowRegistration(true);
                        }}
                        className="px-6 py-2 rounded-lg transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Registration Modal */}
      {selectedEvent && showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              Register for {selectedEvent.title}
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Date:</span> {selectedEvent.date}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Time:</span> {selectedEvent.time}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Location:</span>{' '}
                {selectedEvent.location}
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

export default Events;
