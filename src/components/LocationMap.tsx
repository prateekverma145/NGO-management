import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-hot-toast';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
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
}

// Expanded sample locations with more data points
const sampleLocations: Location[] = [
  // Bangalore
  {
    id: '1',
    name: 'Hope Foundation NGO',
    type: 'ngo',
    coordinates: [12.9716, 77.5946],
    address: '123 Main St, Bangalore',
    contact: '+91 9876543210'
  },
  {
    id: '2',
    name: 'City Food Bank',
    type: 'food_bank',
    coordinates: [12.9796, 77.5906],
    address: '456 Church St, Bangalore',
    contact: '+91 9876543211'
  },
  {
    id: '3',
    name: 'Life Blood Bank',
    type: 'blood_bank',
    coordinates: [12.9716, 77.6046],
    address: '789 Hospital Rd, Bangalore',
    contact: '+91 9876543212'
  },
  {
    id: '4',
    name: 'Safe Haven Shelter',
    type: 'shelter',
    coordinates: [12.9746, 77.5846],
    address: '321 Shelter Ave, Bangalore',
    contact: '+91 9876543213'
  },
  // Delhi
  {
    id: '5',
    name: 'Delhi Care Foundation',
    type: 'ngo',
    coordinates: [28.6139, 77.2090],
    address: '45 Connaught Place, Delhi',
    contact: '+91 9876543214'
  },
  {
    id: '6',
    name: 'Delhi Community Kitchen',
    type: 'food_bank',
    coordinates: [28.6329, 77.2195],
    address: '78 Chandni Chowk, Delhi',
    contact: '+91 9876543215'
  },
  // Mumbai
  {
    id: '7',
    name: 'Mumbai Blood Services',
    type: 'blood_bank',
    coordinates: [19.0760, 72.8777],
    address: '123 Marine Drive, Mumbai',
    contact: '+91 9876543216'
  },
  {
    id: '8',
    name: 'Mumbai Shelter Home',
    type: 'shelter',
    coordinates: [19.0821, 72.8416],
    address: '56 Bandra West, Mumbai',
    contact: '+91 9876543217'
  },
  // Hyderabad
  {
    id: '9',
    name: 'Hyderabad Relief NGO',
    type: 'ngo',
    coordinates: [17.3850, 78.4867],
    address: '34 Banjara Hills, Hyderabad',
    contact: '+91 9876543218'
  },
  {
    id: '10',
    name: 'Hyderabad Food Support',
    type: 'food_bank',
    coordinates: [17.4399, 78.4983],
    address: '78 Secunderabad, Hyderabad',
    contact: '+91 9876543219'
  },
  // Chennai
  {
    id: '11',
    name: 'Chennai Blood Center',
    type: 'blood_bank',
    coordinates: [13.0827, 80.2707],
    address: '45 Marina Beach Rd, Chennai',
    contact: '+91 9876543220'
  },
  {
    id: '12',
    name: 'Chennai Emergency Shelter',
    type: 'shelter',
    coordinates: [13.0569, 80.2425],
    address: '23 T Nagar, Chennai',
    contact: '+91 9876543221'
  },
  // Kolkata
  {
    id: '13',
    name: 'Kolkata Community Services',
    type: 'ngo',
    coordinates: [22.5726, 88.3639],
    address: '67 Park Street, Kolkata',
    contact: '+91 9876543222'
  },
  {
    id: '14',
    name: 'Kolkata Food Distribution',
    type: 'food_bank',
    coordinates: [22.5958, 88.3699],
    address: '12 Salt Lake City, Kolkata',
    contact: '+91 9876543223'
  },
  // Pune
  {
    id: '15',
    name: 'Pune Blood Donation Center',
    type: 'blood_bank',
    coordinates: [18.5204, 73.8567],
    address: '89 Koregaon Park, Pune',
    contact: '+91 9876543224'
  },
  {
    id: '16',
    name: 'Pune Homeless Shelter',
    type: 'shelter',
    coordinates: [18.5314, 73.8446],
    address: '34 Aundh, Pune',
    contact: '+91 9876543225'
  }
];

const LocationMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([12.9716, 77.5946]);
  const [locations, setLocations] = useState<Location[]>(sampleLocations);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState<number>(5);
  const [error, setError] = useState<string>('');
  const [mapKey, setMapKey] = useState<number>(0); // Add this to force map re-render

  const fetchLocations = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/locations/nearby?latitude=${latitude}&longitude=${longitude}&radius=${searchRadius}&type=${selectedType}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const transformedLocations = data.data.map((loc: any) => ({
          id: loc._id,
          name: loc.name,
          type: loc.type,
          coordinates: loc.coordinates.coordinates.reverse() as [number, number],
          address: loc.address,
          contact: loc.contact
        }));
        setLocations(transformedLocations.length > 0 ? transformedLocations : sampleLocations);
        setError('');
      } else {
        console.error('API Error:', data.message);
        setLocations(sampleLocations);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations(sampleLocations);
      setError('');
      // Only log to console, don't show toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(newLocation);
          fetchLocations(newLocation[0], newLocation[1]);
          setMapKey(prev => prev + 1); // Force map to re-render with new center
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('');
          fetchLocations(userLocation[0], userLocation[1]);
          // Only log to console, don't show toast
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
      setLoading(false);
      setError('');
    }
  }, [searchRadius, selectedType]);

  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius);
    fetchLocations(userLocation[0], userLocation[1]);
  };

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    fetchLocations(userLocation[0], userLocation[1]);
  };

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

  const filteredLocations = selectedType === 'all' 
    ? locations 
    : locations.filter(loc => loc.type === selectedType);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Find the nearest locations to the user's position
  const getNearestLocations = () => {
    // Calculate distance between two points using Haversine formula
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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
    return [...filteredLocations].sort((a, b) => {
      const distA = getDistance(
        userLocation[0], userLocation[1], 
        a.coordinates[0], a.coordinates[1]
      );
      const distB = getDistance(
        userLocation[0], userLocation[1], 
        b.coordinates[0], b.coordinates[1]
      );
      return distA - distB;
    });
  };

  const nearestLocations = getNearestLocations();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Nearby Assistance</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Radius (km)
            </label>
            <select
              value={searchRadius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">1 km</option>
              <option value="2">2 km</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTypeChange('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleTypeChange('ngo')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'ngo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            NGOs
          </button>
          <button
            onClick={() => handleTypeChange('food_bank')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'food_bank'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Food Banks
          </button>
          <button
            onClick={() => handleTypeChange('blood_bank')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'blood_bank'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Blood Banks
          </button>
          <button
            onClick={() => handleTypeChange('shelter')}
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
            key={mapKey}
            center={userLocation}
            zoom={13}
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
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                position={location.coordinates}
                icon={getMarkerColor(location.type)}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-bold mb-1">{location.name}</h3>
                    <p className="text-gray-600 mb-1">{location.address}</p>
                    {location.contact && (
                      <p className="text-gray-600">
                        Contact: {location.contact}
                      </p>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[0]},${location.coordinates[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                    >
                      Get Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
          <h3 className="text-xl font-bold mb-4">Nearest Locations</h3>
          {nearestLocations.length > 0 ? (
            <div className="space-y-4">
              {nearestLocations.map((location) => (
                <div key={location.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-start">
                    <div className={`w-3 h-3 rounded-full mt-1.5 mr-2 ${
                      location.type === 'ngo' ? 'bg-blue-500' :
                      location.type === 'food_bank' ? 'bg-green-500' :
                      location.type === 'blood_bank' ? 'bg-red-500' :
                      'bg-orange-500'
                    }`}></div>
                    <div>
                      <h4 className="font-semibold">{location.name}</h4>
                      <p className="text-sm text-gray-600">{location.address}</p>
                      {location.contact && (
                        <p className="text-sm text-gray-600">Contact: {location.contact}</p>
                      )}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[0]},${location.coordinates[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No locations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationMap; 