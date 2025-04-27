# Friend Map

A modern web application that displays your friends' locations on an interactive map with a grouped list view.

## Features

- Interactive Mapbox GL JS map with clustering
- Hierarchical location grouping (Country -> State -> City)
- Search functionality for locations and friends
- Responsive design with dark mode support
- Smooth animations and transitions
- Cached geocoding results

## Tech Stack

- React + TypeScript
- Mapbox GL JS
- Tailwind CSS
- Vite

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Mapbox access token:
   ```
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
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
│   │   ├── geocoding.ts
│   │   └── dataProcessing.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── locationUtils.ts
│   │   └── cache.ts
│   └── App.tsx
├── public/
│   ├── friends.json
│   └── index.html
├── package.json
└── tsconfig.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT 
