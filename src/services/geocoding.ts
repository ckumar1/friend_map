import { Friend } from '../types';

const GEOCODING_CACHE_KEY = 'geocoding_cache';

interface GeocodingCache {
  [key: string]: {
    coordinates: [number, number];
    timestamp: number;
  };
}

export class GeocodingService {
  private cache: GeocodingCache;

  constructor() {
    this.cache = this.loadCache();
  }

  private loadCache(): GeocodingCache {
    const cached = localStorage.getItem(GEOCODING_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  }

  private saveCache() {
    localStorage.setItem(GEOCODING_CACHE_KEY, JSON.stringify(this.cache));
  }

  async geocodeLocation(location: string): Promise<[number, number]> {
    // Check cache first
    if (this.cache[location]) {
      return this.cache[location].coordinates;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
        this.cache[location] = { coordinates: coords, timestamp: Date.now() };
        this.saveCache();
        return coords;
      }
    } catch (error) {
      console.error('Error geocoding location:', location, error);
    }

    // Default to center of US if no coordinates found
    return [-98.5795, 39.8283];
  }

  async processFriends(friends: Friend[]): Promise<Friend[]> {
    const processed: Friend[] = [];

    for (const friend of friends) {
      const coordinates = await this.geocodeLocation(friend.location);
      processed.push({
        ...friend,
        coordinates
      });
    }

    return processed;
  }
} 
