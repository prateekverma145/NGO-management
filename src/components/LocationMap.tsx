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

const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'Hope Foundation NGO',
    type: 'ngo',
    coordinates: [12.9716, 77.5946], // Bangalore coordinates
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
  }
];

const LocationMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([12.9716, 77.5946]); // Default to Bangalore
  const [locations, setLocations] = useState<Location[]>(sampleLocations);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Nearby Assistance</h2>
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

      <div className="h-[500px] rounded-lg overflow-hidden">
        <MapContainer
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
    </div>
  );
};

export default LocationMap; 