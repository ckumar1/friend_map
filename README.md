# Friend Map

A modern web application that displays your friends' locations on an interactive map with a grouped list view. Built with React and Leaflet, this application provides an intuitive way to visualize and explore your friends' locations across the globe.

## Features

- Interactive Leaflet map with marker clustering
- Hierarchical location grouping (Country -> State -> City)
- Search functionality for locations and friends
- Responsive design with dark mode support
- Custom styled popups with friend information
- Smooth animations and transitions
- Efficient marker clustering for better performance

## Tech Stack

- React 18 + TypeScript
- Leaflet + Leaflet.MarkerCluster
- Tailwind CSS
- Vite
- Headless UI
- Heroicons

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
friend-map/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── Map.tsx
│   │   │   ├── LocationMarker.tsx
│   │   │   └── LocationCluster.tsx
│   │   ├── FriendsList/
│   │   │   ├── FriendsList.tsx
│   │   │   ├── LocationGroup.tsx
│   │   │   └── FriendCard.tsx
│   │   └── Search/
│   │       ├── SearchBar.tsx
│   │       └── Filters.tsx
│   ├── services/
│   │   └── dataProcessing.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── locationUtils.ts
│   └── App.tsx
├── public/
│   ├── friends.json
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Development

The project uses several key technologies:

- **Leaflet**: For the interactive map functionality
- **Leaflet.MarkerCluster**: For efficient marker clustering
- **Tailwind CSS**: For styling and responsive design
- **TypeScript**: For type safety and better development experience
- **Vite**: For fast development and building

### Key Features Implementation

- **Map Clustering**: Uses Leaflet.MarkerCluster to group nearby markers
- **Location Grouping**: Hierarchical organization of friends by location
- **Responsive Design**: Built with Tailwind CSS for mobile-first approach
- **Type Safety**: Full TypeScript implementation for better code quality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT 
