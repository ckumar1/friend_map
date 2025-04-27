import { Location } from '../../types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface LocationGroupProps {
  location: Location;
  expandedGroups: string[];
  toggleGroup: (id: string) => void;
  onLocationSelect: (location: Location) => void;
}

const LocationGroup = ({
  location,
  expandedGroups,
  toggleGroup,
  onLocationSelect,
}: LocationGroupProps) => {
  const isExpanded = expandedGroups.includes(location.id);
  const Icon = isExpanded ? ChevronDownIcon : ChevronRightIcon;

  console.log('LocationGroup render:', {
    name: location.name,
    isExpanded,
    friendsCount: location.friends.length,
    friends: location.friends.map(f => f.name)
  });

  return (
    <div className="border rounded-md overflow-hidden mb-2">
      <button
        className={`w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700`}
        onClick={() => toggleGroup(location.id)}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{location.name}</span>
          <span className="text-sm text-gray-500">({location.friends?.length ?? 0})</span>
        </div>
      </button>
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 ml-4">
          {location.children && location.children.length > 0 ? (
            location.children.map(child => (
              <LocationGroup
                key={child.id}
                location={child}
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
                onLocationSelect={onLocationSelect}
              />
            ))
          ) : (
            (location.friends || []).map(friend => (
              <div
                key={friend.id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onLocationSelect(location)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">{friend.name}</span>
                    <span className="text-sm text-gray-500">@{friend.handle}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {friend.location}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LocationGroup; 
