import { useState } from 'react';
import { Location } from '../../types';
import LocationGroup from './LocationGroup';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FriendsListProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

const FriendsList = ({ locations, onLocationSelect }: FriendsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (locationId: string) => {
    setExpandedGroups(prev =>
      prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  // Only filter at the friend level for search
  const filterLocations = (locs: Location[]): Location[] => {
    return locs
      .map(location => {
        if (location.children && location.children.length > 0) {
          const filteredChildren = filterLocations(location.children);
          return {
            ...location,
            children: filteredChildren,
            friends: [] // Don't show friends at this level if children exist
          };
        } else {
          // Leaf node: filter friends
          const filteredFriends = location.friends.filter(friend =>
            friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.location.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return {
            ...location,
            friends: filteredFriends
          };
        }
      })
      .filter(location =>
        (location.children && location.children.length > 0) ||
        (location.friends && location.friends.length > 0)
      );
  };

  const filteredLocations = searchQuery ? filterLocations(locations) : locations;
  const totalFriends = locations.reduce((sum, location) => sum + (location.friends?.length || 0), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search locations or friends..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {totalFriends} friends in {locations.length} locations
        </div>
      </div>

      <div className="space-y-2">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => (
            <LocationGroup
              key={location.id}
              location={location}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
              onLocationSelect={onLocationSelect}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No locations or friends found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList; 
