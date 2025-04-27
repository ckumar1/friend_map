import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Friend } from '../../types';

interface FriendMarkerProps {
  friend: Friend;
  map: L.Map;
}

const FriendMarker = ({ friend, map }: FriendMarkerProps) => {
  const markerRef = useRef<L.Marker | null>(null);
  const popupRef = useRef<L.Popup | null>(null);

  useEffect(() => {
    if (!map) {
      console.error('Map not available for friend marker:', friend.name);
      return;
    }

    // Create marker
    const el = document.createElement('div');
    el.className = 'w-4 h-4 rounded-full flex items-center justify-center cursor-pointer';
    el.innerHTML = `
      <div class="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
        ${friend.name.charAt(0)}
      </div>
    `;

    // Create custom icon
    const customIcon = L.divIcon({
      html: el,
      className: 'friend-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    try {
      // Create marker
      const latLng = L.latLng(friend.coordinates[1], friend.coordinates[0]);
      console.log('Creating marker for friend:', friend.name, 'at coordinates:', {
        raw: friend.coordinates,
        latLng: latLng,
        mapBounds: map.getBounds(),
        mapCenter: map.getCenter(),
        mapZoom: map.getZoom()
      });
      
      markerRef.current = L.marker(latLng, { icon: customIcon }).addTo(map);
      console.log('Marker created and added to map:', markerRef.current);

      // Verify marker is in map bounds
      const bounds = map.getBounds();
      console.log('Marker in bounds:', bounds.contains(latLng));

      // Create popup
      popupRef.current = L.popup({
        closeButton: false,
        closeOnClick: false,
        offset: L.point(0, -8)
      })
        .setLatLng(latLng)
        .setContent(`
          <div class="p-2">
            <h3 class="font-bold">${friend.name}</h3>
            <p class="text-sm text-gray-600">@${friend.handle}</p>
            <p class="text-sm text-gray-600">${friend.location}</p>
          </div>
        `);

      // Add event listeners
      el.addEventListener('mouseenter', () => {
        popupRef.current?.openOn(map);
      });
      el.addEventListener('mouseleave', () => {
        popupRef.current?.close();
      });
    } catch (error) {
      console.error('Error creating marker for friend:', friend.name, error);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (popupRef.current) {
        popupRef.current.remove();
      }
      el.removeEventListener('mouseenter', () => popupRef.current?.openOn(map));
      el.removeEventListener('mouseleave', () => popupRef.current?.close());
    };
  }, [map, friend]);

  return null;
};

export default FriendMarker; 
