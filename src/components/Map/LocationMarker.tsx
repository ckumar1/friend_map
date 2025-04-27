import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Location } from '../../types';

interface LocationMarkerProps {
  location: Location;
  map: L.Map;
  onClick: () => void;
  isSelected: boolean;
}

const LocationMarker = ({ location, map, onClick, isSelected }: LocationMarkerProps) => {
  const markerRef = useRef<L.Marker | null>(null);
  const popupRef = useRef<L.Popup | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create marker
    const el = document.createElement('div');
    el.className = `w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-transform ${
      isSelected ? 'scale-125' : ''
    }`;
    el.innerHTML = `
      <div class="w-full h-full rounded-full ${
        isSelected ? 'bg-primary-600' : 'bg-primary-500'
      } flex items-center justify-center text-white text-xs font-bold">
        ${(location.friends?.length ?? 0)}
      </div>
    `;

    // Create custom icon
    const customIcon = L.divIcon({
      html: el,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Create marker
    markerRef.current = L.marker(
      [location.coordinates[1], location.coordinates[0]],
      { icon: customIcon }
    ).addTo(map);

    // Create popup
    popupRef.current = L.popup({
      closeButton: false,
      closeOnClick: false,
      offset: L.point(0, -12)
    })
      .setLatLng([location.coordinates[1], location.coordinates[0]])
      .setContent(`
        <div class="p-2">
          <h3 class="font-bold">${location.name}</h3>
          <p class="text-sm text-gray-600">${location.friends?.length ?? 0} friends</p>
        </div>
      `);

    // Add event listeners
    el.addEventListener('click', onClick);
    el.addEventListener('mouseenter', () => popupRef.current?.openOn(map));
    el.addEventListener('mouseleave', () => popupRef.current?.close());

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (popupRef.current) {
        popupRef.current.remove();
      }
      el.removeEventListener('click', onClick);
      el.removeEventListener('mouseenter', () => popupRef.current?.openOn(map));
      el.removeEventListener('mouseleave', () => popupRef.current?.close());
    };
  }, [map, location, onClick, isSelected]);

  return null;
};

export default LocationMarker; 
