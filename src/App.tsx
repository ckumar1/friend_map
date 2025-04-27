import { useState, useEffect, useMemo } from 'react';
import { Location } from './types';
import Map from './components/Map/Map';
import FriendsList from './components/FriendsList/FriendsList';
import { GeocodingService } from './services/geocoding';
import { groupFriendsToLocations } from './services/dataProcessing';

const geocodingService = new GeocodingService();

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/friends.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch friends.json: ${response.status} ${response.statusText}`);
        }
        const friendsRaw = await response.json();
        
        const processedFriends = await geocodingService.processFriends(friendsRaw);
        const groupedLocations = groupFriendsToLocations(processedFriends);
        
        setLocations(groupedLocations);
        setError(undefined);
      } catch {
        setError('Failed to load or geocode friends data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadingContent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading friends data...</p>
      </div>
    </div>
  ), []);

  const errorContent = useMemo(() => error && (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  ), [error]);

  if (loading) {
    return loadingContent;
  }

  if (error) {
    return errorContent;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Ship Friend Map
          </h1>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 relative">
              <Map
                locations={locations}
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
              />
            </div>
          </div>
          <div className="flex flex-col min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <FriendsList
                locations={locations}
                onLocationSelect={setSelectedLocation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 
