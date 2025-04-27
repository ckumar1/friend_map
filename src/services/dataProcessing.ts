import { Friend, Location } from '../types';
import { STATE_ABBREVIATIONS } from './stateNames';

export const groupFriendsToLocations = (friends: Friend[]): Location[] => {
  const result: Location[] = [];
  const countryMap = new Map<string, Location>();
  const stateMap = new Map<string, Location>();
  const cityMap = new Map<string, Location>();

  friends.forEach(friend => {
    // Parse location string: "City, State" or "City, State, Country"
    const parts = friend.location.split(',').map(p => p.trim());
    const city = parts[0];
    let state = parts[1] || '';
    const country = parts[2] || (state === 'BC' ? 'Canada' : 'USA');

    // Normalize state abbreviation to full name
    if (state && STATE_ABBREVIATIONS[state]) {
      state = STATE_ABBREVIATIONS[state];
    }

    const countryKey = country;
    const stateKey = state ? `${state}, ${country}` : country;
    const cityKey = `${city}, ${stateKey}`;

    // Create or get country location
    let countryLocation = countryMap.get(countryKey);
    if (!countryLocation) {
      countryLocation = {
        id: countryKey,
        name: country,
        type: 'country',
        coordinates: [0, 0], // Will be updated with average of children
        friends: [],
        children: []
      };
      countryMap.set(countryKey, countryLocation);
      result.push(countryLocation);
    }

    // Create or get state location
    let stateLocation = stateMap.get(stateKey);
    if (!stateLocation && state) {
      stateLocation = {
        id: stateKey,
        name: state,
        type: 'state',
        coordinates: [0, 0], // Will be updated with average of children
        friends: [],
        children: []
      };
      stateMap.set(stateKey, stateLocation);
      if (!countryLocation.children) {
        countryLocation.children = [];
      }
      countryLocation.children.push(stateLocation);
    }

    // Create or get city location
    let cityLocation = cityMap.get(cityKey);
    if (!cityLocation && city) {
      cityLocation = {
        id: cityKey,
        name: city,
        type: 'city',
        coordinates: friend.coordinates,
        friends: [],
        children: []
      };
      cityMap.set(cityKey, cityLocation);
      if (stateLocation) {
        if (!stateLocation.children) {
          stateLocation.children = [];
        }
        stateLocation.children.push(cityLocation);
      } else {
        if (!countryLocation.children) {
          countryLocation.children = [];
        }
        countryLocation.children.push(cityLocation);
      }
    }

    // Add friend to appropriate location and propagate up the hierarchy
    if (cityLocation) {
      cityLocation.friends.push(friend);
      if (stateLocation) {
        stateLocation.friends.push(friend);
      }
      countryLocation.friends.push(friend);
    } else if (stateLocation) {
      stateLocation.friends.push(friend);
      countryLocation.friends.push(friend);
    } else {
      countryLocation.friends.push(friend);
    }
  });

  // Update coordinates for parent locations based on their children
  const updateCoordinates = (location: Location) => {
    if (location.children && location.children.length > 0) {
      const coordinates = location.children.reduce((acc, child) => {
        updateCoordinates(child);
        return [acc[0] + child.coordinates[0], acc[1] + child.coordinates[1]];
      }, [0, 0]);
      location.coordinates = [
        coordinates[0] / location.children.length,
        coordinates[1] / location.children.length
      ];
    }
  };

  result.forEach(updateCoordinates);
  return result;
}; 
