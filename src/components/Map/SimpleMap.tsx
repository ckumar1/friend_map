import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const geocodeCache: Record<string, [number, number]> = {};

async function geocode(location: string): Promise<[number, number]> {
  if (geocodeCache[location]) return geocodeCache[location];

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.features && data.features.length > 0) {
    const coords = data.features[0].center as [number, number];
    geocodeCache[location] = coords;
    return coords;
  }
  // Default to US center if not found
  return [-98.5795, 39.8283];
}

export default function SimpleMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283],
      zoom: 3,
    });

    fetch('/friends.json')
      .then(res => res.json())
      .then(async (friends) => {
        for (const friend of friends) {
          const coords = await geocode(friend.location);
          new mapboxgl.Marker()
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup().setText(`${friend.name} (${friend.location})`))
            .addTo(map);
        }
      });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: 500, border: '2px solid red' }} />;
} 
