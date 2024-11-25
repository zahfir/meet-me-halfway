# Meet Me Halfway

## About the Project

**Meet Me Halfway** is a location-sharing app designed to calculate the optimal meeting point (geometric centroid) for a group of people. Users can input their locations, and the app dynamically determines the best central location for everyone. Features include OpenStreetMap-based point of interest search and dynamic route generation.

## Features

- Calculate a geometric centroid for user-defined locations.
- Display meeting area with a marker and circle.
- Query points of interest (e.g., restaurants, cafes) near the meeting area using OpenStreetMap and Overpass API.
- Interactive map with dynamic route calculations to the meeting area.
- Fully responsive and built with Bootstrap.

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/meet-me-halfway.git
cd meet-me-halfway
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## Environment Variables

The project requires environment variables for the following services:

    Mapbox
    OpenRouteService
    Overpass (OpenStreetMaps)
    Nominatim

Create a .env.local file in project's root directory and insert the following:

```bash
MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
ORS_API_KEY=your-open-route-service-api-key

# Plus these constants
ORS_BASE_URL="https://api.openrouteservice.org/v2/directions/driving-car"
NEXT_PUBLIC_OVERPASS_URL="https://overpass-api.de/api/interpreter"
NEXT_PUBLIC_NOMINATIM_URL="https://nominatim.openstreetmap.org"
```
## Acknowledgements

- Mapbox for powerful interactive mapping.
- OpenStreetMap for open geographic data.
- Zustand for state management.
- Bootstrap for styling and responsive UI.

## License

This project is licensed under the MIT License.
