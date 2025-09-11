import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Navigation, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { OrthodontistService } from '../services/orthodontistApi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Orthodontist {
  id: string;
  name: string;
  specialty: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
}

interface OrthodontistFinderProps {
  onClose: () => void;
}

const OrthodontistFinder: React.FC<OrthodontistFinderProps> = ({ onClose }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [orthodontists, setOrthodontists] = useState<Orthodontist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedOrthodontist, setSelectedOrthodontist] = useState<Orthodontist | null>(null);

  useEffect(() => {
    initializeMap();
    getCurrentLocationAndFindOrthodontists();
    return () => { if (map.current) map.current.remove(); };
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    map.current = L.map(mapContainer.current).setView([38.9637, 35.2433], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);
  };

  const getCurrentLocationAndFindOrthodontists = async () => {
    setIsLoading(true);
    try {
      const location = await OrthodontistService.getCurrentLocation();
      setUserLocation(location);

      if (map.current) {
        map.current.setView([location.latitude, location.longitude], 10);

        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        L.marker([location.latitude, location.longitude], { icon: userIcon })
          .addTo(map.current)
          .bindPopup('<div class="p-2"><strong>Your Location</strong></div>');
      }

      const orthodontistData = await OrthodontistService.findNearbyOrthodontists(location.latitude, location.longitude, 50);
      setOrthodontists(orthodontistData.orthodontists);
      addOrthodontistMarkers(orthodontistData.orthodontists);
      toast.success(`Found ${orthodontistData.orthodontists.length} orthodontists within 50km`);
    } catch (error) {
      console.error('Location/API error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to find orthodontists');
    } finally { setIsLoading(false); }
  };

  const addOrthodontistMarkers = (orthodontists: Orthodontist[]) => {
    if (!map.current) return;

    orthodontists.forEach((ortho) => {
      const icon = L.divIcon({
        className: 'orthodontist-marker',
        html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                 <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                 </svg>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([ortho.latitude, ortho.longitude], { icon })
        .addTo(map.current!)
        .bindPopup(`
          <div class="p-4 rounded-xl shadow-md bg-white border border-gray-200 w-64">
            <h3 class="font-semibold text-gray-800 text-sm mb-1">${ortho.name}</h3>
            <p class="text-xs text-blue-600 mb-1">${ortho.specialty}</p>
            <p class="text-xs text-gray-600 mb-1">${ortho.address}, ${ortho.city}</p>
            <p class="text-xs font-medium text-purple-600">${ortho.phone}</p>
          </div>
        `);

      marker.on('click', () => setSelectedOrthodontist(ortho));
      markersRef.current[ortho.id] = marker;
    });
  };

  
  useEffect(() => {
    if (selectedOrthodontist && map.current) {
      const marker = markersRef.current[selectedOrthodontist.id];
      if (marker) {
        map.current.setView(marker.getLatLng(), 12, { animate: true });
        marker.openPopup();
      }
    }
  }, [selectedOrthodontist]);

  const handleGetDirections = (orthodontist: Orthodontist) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${orthodontist.latitude},${orthodontist.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-white">Find an Orthodontist</h2>
              <p className="text-blue-100">Orthodontists within 50km of your location</p>
            </div>
          </div>
          <div className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span className="text-sm">OpenStreetMap Ready</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[600px]">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          )}
        </div>

        {/* Orthodontist List */}
        <div className="w-full lg:w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              Nearby Orthodontists ({orthodontists.length})
            </h3>
          </div>

          {orthodontists.length === 0 && !isLoading && (
            <div className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orthodontists found in your area</p>
            </div>
          )}

          <div className="space-y-2 p-4">
            {orthodontists.map((ortho) => (
              <div
                key={ortho.id}
                className={`bg-white rounded-xl p-4 border-2 transition-all cursor-pointer hover:shadow-md ${
                  selectedOrthodontist?.id === ortho.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOrthodontist(ortho)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{ortho.name}</h4>
                    <p className="text-xs text-blue-600 mb-2">{ortho.specialty}</p>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">{ortho.address}, {ortho.city}</p>
                    <p className="text-xs font-medium text-purple-600 mb-2">{ortho.phone}</p>
                  </div>
                  <div
                    className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleGetDirections(ortho); }}
                  >
                    <Navigation className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrthodontistFinder;
