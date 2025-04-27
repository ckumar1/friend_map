import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Location } from '../../types';

interface LocationClusterProps {
  locations: Location[];
  map: L.Map;
  onLocationSelect: (location: Location) => void;
}

const LocationCluster = ({ locations, map, onLocationSelect }: LocationClusterProps) => {
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }

    // Helper to recursively gather all city and friend markers, assigning state/country
    const gatherMarkers = (
      location: Location,
      parentState: string | undefined,
      parentCountry: string | undefined
    ): L.Marker[] => {
      let markers: L.Marker[] = [];
      const state = location.type === 'state' ? location.name : parentState;
      const country = location.type === 'country' ? location.name : parentCountry;

      // Add marker for this location if it's a city
      if (location.type === 'city') {
        const el = document.createElement('div');
        el.className = 'w-6 h-6 rounded-full flex items-center justify-center cursor-pointer';
        el.innerHTML = `
          <div class="w-full h-full rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
            ${(location.friends?.length ?? 0)}
          </div>
        `;
        const customIcon = L.divIcon({
          html: el,
          className: 'custom-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        const marker = L.marker(
          [location.coordinates[1], location.coordinates[0]],
          { icon: customIcon }
        );
        // @ts-expect-error: custom property for clustering
        marker.options.state = state;
        // @ts-expect-error: custom property for clustering
        marker.options.country = country;
        // Attach friend names as a custom property
        // @ts-expect-error: custom property for clustering
        marker.friendNames = (location.friends || []).map(friend => friend.name);
        
        // Debug log to ensure friendNames is set
        console.log(`Setting friendNames for ${location.name}:`, 
          // @ts-expect-error: custom property for clustering
          marker.friendNames
        );
        const popup = L.popup({
          closeButton: false,
          closeOnClick: false,
          offset: L.point(0, -12)
        })
          .setLatLng([location.coordinates[1], location.coordinates[0]])
          .setContent(`
            <div class="p-2">
              <h3 class="font-bold">${location.name}</h3>
              <p class="text-sm text-gray-600">${location.friends?.length ?? 0} friends</p>
              <ul>
                ${(location.friends || []).map(friend => `<li>${friend.name}</li>`).join('')}
              </ul>
            </div>
          `);
        el.addEventListener('click', () => onLocationSelect(location));
        el.addEventListener('mouseenter', () => popup.openOn(map));
        el.addEventListener('mouseleave', () => popup.close());
        marker.bindPopup(popup);
        markers.push(marker);
      }
      // Recurse into children
      if (location.children && location.children.length > 0) {
        location.children.forEach((child: Location) => {
          markers = markers.concat(gatherMarkers(child, state, country));
        });
      }
      return markers;
    };

    // Custom iconCreateFunction for state/country-aware clusters
    const iconCreateFunction = (cluster: L.MarkerCluster) => {
      const markers = cluster.getAllChildMarkers() as L.Marker[];
      let totalFriends = 0;
      markers.forEach((marker: L.Marker) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const friendNames = (marker as any).friendNames;
        if (Array.isArray(friendNames)) {
          totalFriends += friendNames.length;
        }
      });
      // Fallback to marker count if no friends found
      const label = `${totalFriends}`;
      return L.divIcon({
        html: `<div class="custom-cluster-icon">${label}</div>`,
        className: '',
        iconSize: [40, 40]
      });
    };

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 12, // Cluster at low zoom, show individual markers at high zoom
      iconCreateFunction
    });

    // Gather all markers (cities + friends)
    let allMarkers: L.Marker[] = [];
    locations.forEach((location: Location) => {
      allMarkers = allMarkers.concat(gatherMarkers(location, undefined, undefined));
    });
    allMarkers.forEach((marker: L.Marker) => clusterGroup.addLayer(marker));

    // Add popup on cluster mouseover to show all cities and their friends in the cluster
    let clusterPopup: L.Popup | null = null;
    clusterGroup.on('clustermouseover', (event: L.LeafletEvent & { layer: L.MarkerCluster }) => {
      const cluster = event.layer;
      const markers = cluster.getAllChildMarkers() as L.Marker[];
      // Gather all cities and their friends in the cluster
      const cityData: { name: string; friends: string[] }[] = markers.map(marker => {
        // @ts-expect-error: custom property for clustering
        const cityName = marker.getPopup()?.getContent()?.match(/<h3 class="font-bold">(.*?)<\/h3>/)?.[1] || '';
        // @ts-expect-error: custom property for clustering
        const friendNames = marker.friendNames || [];
        return { name: cityName, friends: friendNames };
      });
      // Remove duplicates by city name
      const uniqueCities = Array.from(new Map(cityData.map(c => [c.name, c])).values());
      if (uniqueCities.length > 0) {
        const popupContent = `<div class='p-2'><div class='font-bold mb-1'>Cities in this cluster:</div><ul>${uniqueCities.map(city => `<li><b>${city.name}</b>${city.friends.length > 0 ? ': ' + city.friends.join(', ') : ''}</li>`).join('')}</ul></div>`;
        clusterPopup = L.popup({ closeButton: false, offset: L.point(0, -20) })
          .setLatLng(cluster.getLatLng())
          .setContent(popupContent)
          .openOn(map);
      }
    });
    clusterGroup.on('clustermouseout', () => {
      if (clusterPopup) {
        map.closePopup(clusterPopup);
        clusterPopup = null;
      }
    });

    clusterRef.current = clusterGroup;
    map.addLayer(clusterGroup);

    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
        clusterRef.current = null;
      }
    };
  }, [map, locations, onLocationSelect]);

  return null;
};

export default LocationCluster; 
