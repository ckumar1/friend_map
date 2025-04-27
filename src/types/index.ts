export interface Friend {
  id: string;
  name: string;
  handle: string;
  location: string;
  coordinates: [number, number];
}

export interface Location {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city';
  coordinates: [number, number];
  parentId?: string;
  children?: Location[];
  friends: Friend[];
}

export interface MapboxFeature {
  id: string;
  type: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  properties: {
    [key: string]: any;
  };
} 
