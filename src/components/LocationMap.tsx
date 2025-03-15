import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-hot-toast';    
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin, Navigation, Phone, Clock, Info } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface Location {
  id: string;
  name: string;
  type: 'ngo' | 'food_bank' | 'blood_bank' | 'shelter';
  coordinates: [number, number];
  address: string;
  contact?: string;
  hours?: string;
  description?: string;
  website?: string;
}

// Expanded sample locations with more data points across India
const sampleLocations: Location[] = [
  // Bangalore
  {
    id: '1',
    name: 'Hope Foundation NGO',
    type: 'ngo',
    coordinates: [12.9716, 77.5946],
    address: '123 Main St, Koramangala, Bangalore',
    contact: '+91 9876543210',
    hours: 'Mon-Fri: 9AM-5PM',
    description: 'Providing education and healthcare to underprivileged children',
    website: 'https://hopefoundation.org'
  },
  {
    id: '2',
    name: 'City Food Bank',
    type: 'food_bank',
    coordinates: [12.9796, 77.5906],
    address: '456 Church St, Indiranagar, Bangalore',
    contact: '+91 9876543211',
    hours: 'Daily: 8AM-8PM',
    description: 'Distributing food to those in need'
  },
  {
    id: '3',
    name: 'Life Blood Bank',
    type: 'blood_bank',
    coordinates: [12.9716, 77.6046],
    address: '789 Hospital Rd, Whitefield, Bangalore',
    contact: '+91 9876543212',
    hours: '24/7',
    description: 'Emergency blood services available round the clock'
  },
  {
    id: '4',
    name: 'Safe Haven Shelter',
    type: 'shelter',
    coordinates: [12.9746, 77.5846],
    address: '321 Shelter Ave, JP Nagar, Bangalore',
    contact: '+91 9876543213',
    hours: '24/7',
    description: 'Emergency shelter for women and children'
  },
  
  // Delhi
  {
    id: '5',
    name: 'Delhi Care Foundation',
    type: 'ngo',
    coordinates: [28.6139, 77.2090],
    address: '45 Connaught Place, New Delhi',
    contact: '+91 9876543214',
    hours: 'Mon-Sat: 10AM-6PM',
    description: 'Supporting education initiatives across Delhi'
  },
  {
    id: '6',
    name: 'Delhi Community Kitchen',
    type: 'food_bank',
    coordinates: [28.6329, 77.2195],
    address: '78 Chandni Chowk, Delhi',
    contact: '+91 9876543215',
    hours: 'Daily: 7AM-9PM',
    description: 'Free meals for those in need'
  },
  {
    id: '7',
    name: 'Delhi Blood Services',
    type: 'blood_bank',
    coordinates: [28.5621, 77.2841],
    address: '23 Nehru Place, New Delhi',
    contact: '+91 9876543216',
    hours: 'Mon-Sun: 8AM-10PM',
    description: 'Blood donation and transfusion services'
  },
  {
    id: '8',
    name: 'Delhi Night Shelter',
    type: 'shelter',
    coordinates: [28.6508, 77.2373],
    address: '12 Kashmere Gate, Delhi',
    contact: '+91 9876543217',
    hours: '24/7',
    description: 'Emergency shelter with food and basic amenities'
  },
  
  // Mumbai
  {
    id: '9',
    name: 'Mumbai Cares NGO',
    type: 'ngo',
    coordinates: [19.0760, 72.8777],
    address: '123 Marine Drive, Mumbai',
    contact: '+91 9876543218',
    hours: 'Mon-Fri: 9AM-6PM',
    description: 'Supporting slum development and education'
  },
  {
    id: '10',
    name: 'Mumbai Food Support',
    type: 'food_bank',
    coordinates: [19.0596, 72.8295],
    address: '56 Bandra West, Mumbai',
    contact: '+91 9876543219',
    hours: 'Daily: 9AM-9PM',
    description: 'Food distribution center for low-income families'
  },
  {
    id: '11',
    name: 'Mumbai Blood Bank',
    type: 'blood_bank',
    coordinates: [19.1176, 72.9060],
    address: '34 Powai, Mumbai',
    contact: '+91 9876543220',
    hours: '24/7',
    description: 'Emergency blood services and donation center'
  },
  {
    id: '12',
    name: 'Mumbai Shelter Home',
    type: 'shelter',
    coordinates: [19.0821, 72.8416],
    address: '78 Juhu, Mumbai',
    contact: '+91 9876543221',
    hours: '24/7',
    description: 'Temporary housing for homeless individuals'
  },
  
  // Hyderabad
  {
    id: '13',
    name: 'Hyderabad Relief NGO',
    type: 'ngo',
    coordinates: [17.3850, 78.4867],
    address: '34 Banjara Hills, Hyderabad',
    contact: '+91 9876543222',
    hours: 'Mon-Sat: 9:30AM-5:30PM',
    description: 'Providing relief services and education support'
  },
  {
    id: '14',
    name: 'Hyderabad Food Support',
    type: 'food_bank',
    coordinates: [17.4399, 78.4983],
    address: '78 Secunderabad, Hyderabad',
    contact: '+91 9876543223',
    hours: 'Daily: 8AM-8PM',
    description: 'Community kitchen and food distribution'
  },
  
  // Chennai
  {
    id: '15',
    name: 'Chennai Blood Center',
    type: 'blood_bank',
    coordinates: [13.0827, 80.2707],
    address: '45 Marina Beach Rd, Chennai',
    contact: '+91 9876543224',
    hours: 'Mon-Sun: 7AM-10PM',
    description: 'Blood donation and emergency services'
  },
  {
    id: '16',
    name: 'Chennai Emergency Shelter',
    type: 'shelter',
    coordinates: [13.0569, 80.2425],
    address: '23 T Nagar, Chennai',
    contact: '+91 9876543225',
    hours: '24/7',
    description: 'Emergency shelter with medical facilities'
  },
  
  // Kolkata
  {
    id: '17',
    name: 'Kolkata Community Services',
    type: 'ngo',
    coordinates: [22.5726, 88.3639],
    address: '67 Park Street, Kolkata',
    contact: '+91 9876543226',
    hours: 'Mon-Fri: 10AM-6PM',
    description: 'Community development and education programs'
  },
  {
    id: '18',
    name: 'Kolkata Food Distribution',
    type: 'food_bank',
    coordinates: [22.5958, 88.3699],
    address: '12 Salt Lake City, Kolkata',
    contact: '+91 9876543227',
    hours: 'Daily: 9AM-7PM',
    description: 'Food distribution and community meals'
  },
  
  // Pune
  {
    id: '19',
    name: 'Pune Blood Donation Center',
    type: 'blood_bank',
    coordinates: [18.5204, 73.8567],
    address: '89 Koregaon Park, Pune',
    contact: '+91 9876543228',
    hours: 'Mon-Sun: 8AM-9PM',
    description: 'Blood donation and testing services'
  },
  {
    id: '20',
    name: 'Pune Homeless Shelter',
    type: 'shelter',
    coordinates: [18.5314, 73.8446],
    address: '34 Aundh, Pune',
    contact: '+91 9876543229',
    hours: '24/7',
    description: 'Shelter providing food, clothing, and basic necessities'
  },
  
  // Ahmedabad
  {
    id: '21',
    name: 'Ahmedabad Relief Foundation',
    type: 'ngo',
    coordinates: [23.0225, 72.5714],
    address: '45 Navrangpura, Ahmedabad',
    contact: '+91 9876543230',
    hours: 'Mon-Sat: 9AM-5PM',
    description: 'Disaster relief and community support'
  },
  {
    id: '22',
    name: 'Ahmedabad Food Bank',
    type: 'food_bank',
    coordinates: [23.0469, 72.5316],
    address: '78 Satellite, Ahmedabad',
    contact: '+91 9876543231',
    hours: 'Daily: 8AM-8PM',
    description: 'Food distribution and nutrition programs'
  },
  
  // Jaipur
  {
    id: '23',
    name: 'Jaipur Blood Services',
    type: 'blood_bank',
    coordinates: [26.9124, 75.7873],
    address: '56 Civil Lines, Jaipur',
    contact: '+91 9876543232',
    hours: 'Mon-Sun: 8AM-8PM',
    description: 'Blood donation and emergency services'
  },
  {
    id: '24',
    name: 'Jaipur Shelter Home',
    type: 'shelter',
    coordinates: [26.9260, 75.8235],
    address: '23 Malviya Nagar, Jaipur',
    contact: '+91 9876543233',
    hours: '24/7',
    description: 'Emergency shelter with food and medical support'
  }
];

const LocationMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([20.5937, 78.9629]); // Default to center of India
  const [locations, setLocations] = useState<Location[]>(sampleLocations);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState<number>(500); // Default to 500km to show more locations

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'ngo':
        return new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'food_bank':
        return new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'blood_bank':
        return new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'shelter':
        return new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      default:
        return new L.Icon.Default();
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ngo':
        return 'NGO';
      case 'food_bank':
        return 'Food Bank';
      case 'blood_bank':
        return 'Blood Bank';
      case 'shelter':
        return 'Shelter';
      default:
        return type;
    }
  };

  const filteredLocations = selectedType === 'all' 
    ? locations 
    : locations.filter(loc => loc.type === selectedType);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // Sort locations by distance from user
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    const distA = calculateDistance(
      userLocation[0], userLocation[1], 
      a.coordinates[0], a.coordinates[1]
    );
    const distB = calculateDistance(
      userLocation[0], userLocation[1], 
      b.coordinates[0], b.coordinates[1]
    );
    return distA - distB;
  });

  // Get locations within radius
  const locationsWithinRadius = sortedLocations.filter(location => {
    const distance = calculateDistance(
      userLocation[0], userLocation[1],
      location.coordinates[0], location.coordinates[1]
    );
    return distance <= searchRadius;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Nearby Assistance</h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Radius (km)
            </label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
              <option value="250">250 km</option>
              <option value="500">500 km</option>
              <option value="1000">1000 km</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType('ngo')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'ngo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            NGOs
          </button>
          <button
            onClick={() => setSelectedType('food_bank')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'food_bank'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Food Banks
          </button>
          <button
            onClick={() => setSelectedType('blood_bank')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'blood_bank'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Blood Banks
          </button>
          <button
            onClick={() => setSelectedType('shelter')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'shelter'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Shelters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="h-[500px] rounded-lg overflow-hidden">
          <MapContainer
            center={userLocation}
            zoom={5} // Zoomed out to show more of India
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User Location Marker */}
            <Marker
              position={userLocation}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                </div>
              </Popup>
            </Marker>

            {/* Location Markers */}
            {locationsWithinRadius.map((location) => (
              <Marker
                key={location.id}
                position={location.coordinates}
                icon={getMarkerColor(location.type)}
              >
                <Popup>
                  <div className="text-sm max-w-xs">
                    <div className="bg-gray-100 -m-3 mb-2 p-3 rounded-t-lg">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-1">
                        {getTypeLabel(location.type)}
                      </span>
                      <h3 className="font-bold text-base">{location.name}</h3>
                    </div>
                    
                    <div className="space-y-2 py-1">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
                        <p className="text-gray-600">{location.address}</p>
                      </div>
                      
                      {location.contact && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                          <p className="text-gray-600">{location.contact}</p>
                        </div>
                      )}
                      
                      {location.hours && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                          <p className="text-gray-600">{location.hours}</p>
                        </div>
                      )}
                      
                      {location.description && (
                        <div className="flex items-start">
                          <Info className="h-4 w-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
                          <p className="text-gray-600 text-xs">{location.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                      {location.website ? (
                        <a
                          href={location.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Visit Website
                        </a>
                      ) : <span></span>}
                      
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[0]},${location.coordinates[1]}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Get Directions
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
          <h3 className="text-xl font-bold mb-4">Nearby Locations ({locationsWithinRadius.length})</h3>
          {locationsWithinRadius.length > 0 ? (
            <div className="space-y-4">
              {locationsWithinRadius.map((location) => {
                const distance = calculateDistance(
                  userLocation[0], userLocation[1],
                  location.coordinates[0], location.coordinates[1]
                ).toFixed(1);
                
                return (
                  <div key={location.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-start">
                      <div className={`w-3 h-3 rounded-full mt-1.5 mr-2 ${
                        location.type === 'ngo' ? 'bg-blue-500' :
                        location.type === 'food_bank' ? 'bg-green-500' :
                        location.type === 'blood_bank' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold">{location.name}</h4>
                          <span className="text-xs text-gray-500">{distance} km</span>
                        </div>
                        <p className="text-xs text-gray-500">{getTypeLabel(location.type)}</p>
                        <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                        {location.contact && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Contact:</span> {location.contact}
                          </p>
                        )}
                        {location.hours && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Hours:</span> {location.hours}
                          </p>
                        )}
                        <div className="mt-3 flex justify-end">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[0]},${location.coordinates[1]}&travelmode=driving`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Get Directions
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No locations found within {searchRadius} km. Try increasing your search radius.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationMap; 