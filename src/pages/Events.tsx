import React, { useState, useEffect } from 'react';
import { FaCalendar, FaBell, FaMapMarkerAlt, FaUsers, FaFilter, FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Event {
  _id: string;
  title: string;
  type: 'charity' | 'cleanliness' | 'disaster-relief';
  date: string;
  time: string;
  location: string;
  description: string;
  participants: number;
  imageUrl: string;
  isRegistered: boolean;
  notificationEnabled: boolean;
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
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [events, setEvents] = useState<Event[]>(sampleEvents); // Initialize with sample events
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        // console.log("bsdvuvbdbniodnbibnimn");
        setEvents(data.data);
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

  const handleNotificationToggle = async (eventId: string) => {
    try {
      const response = await fetch('/api/events/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) throw new Error('Failed to toggle notification');

      setEvents(events.map(event =>
        event._id === eventId
          ? { ...event, notificationEnabled: !event.notificationEnabled }
          : event
      ));

      toast.success('Notification preference updated');
    } catch (error) {
      toast.error('Failed to update notification preference');
      console.error('Notification toggle error:', error);
    }
  };

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const formData = new FormData(e.currentTarget);
    const registrationData = {
      eventId: selectedEvent._id,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    };

    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      // Update local state
      setEvents(events.map(event =>
        event._id === selectedEvent._id
          ? { ...event, isRegistered: true, participants: event.participants + 1 }
          : event
      ));

      toast.success('Successfully registered for the event!');
      setShowRegistration(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
      console.error('Registration error:', error);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
        <p className="text-lg text-gray-600 mb-8">
          Join us in making a difference in our community
        </p>

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
          {events
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
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleNotificationToggle(event._id)}
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        event.notificationEnabled
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600'
                      }`}
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

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                  </div>

                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUsers />
                      <span>{event.participants} participants</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowRegistration(true);
                      }}
                      className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                        event.isRegistered
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {event.isRegistered ? 'Registered' : 'Register Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
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
