import { useEffect, useRef, useState, memo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../../types';
import LocationCluster from './LocationCluster';

// Fix for Leaflet marker icons
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = icon;

interface MapProps {
  locations: Location[];
  selectedLocation?: Location;
  onLocationSelect: (location: Location) => void;
}

const Map = ({ locations, selectedLocation, onLocationSelect }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map
      map.current = L.map(mapContainer.current, {
        center: [39.8283, -98.5795], // Center of US
        zoom: 3,
        zoomControl: false,
        attributionControl: false,
        renderer: L.canvas() // Force canvas renderer for better performance
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1
      }).addTo(map.current);

      // Add controls
      L.control.zoom({
        position: 'topright'
      }).addTo(map.current);

      L.control.attribution({
        position: 'bottomright'
      }).addTo(map.current);

      // Handle map load
      const handleLoad = () => {
        setMapLoaded(true);
        setError(undefined);
      };

      map.current.once('load', handleLoad);
      map.current.on('load', handleLoad);

      // Handle errors
      map.current.on('error', () => {
        setError('Failed to load map. Please try refreshing the page.');
      });

      // Force a resize event to ensure the map is properly sized
      setTimeout(() => {
        map.current?.invalidateSize();
        if (!mapLoaded) {
          map.current?.fire('load');
        }
      }, 100);

      // Handle resize
      const handleResize = () => {
        if (map.current) {
          map.current.invalidateSize();
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (map.current) {
          map.current.remove();
        }
      };
    } catch {
      setError('Failed to initialize map. Please try refreshing the page.');
    }
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Fly to selected location
    if (selectedLocation) {
      map.current.flyTo(
        [selectedLocation.coordinates[1], selectedLocation.coordinates[0]],
        8,
        {
          duration: 2
        }
      );
    }
  }, [selectedLocation, mapLoaded]);

  if (error) {
    return (
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full bg-gray-100 map-container"
        style={{ minHeight: '500px' }}
      />
      {mapLoaded && map.current && (
        <LocationCluster
          locations={locations}
          map={map.current}
          onLocationSelect={onLocationSelect}
        />
      )}
    </div>
  );
};

export default memo(Map); 
