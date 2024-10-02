// import { useRef, useEffect, useState } from "react";
// import { SearchBox } from "@mapbox/search-js-react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// const accessToken =
//   "pk.eyJ1IjoiemFoZmlyIiwiYSI6ImNtMWw2emJzazAyanAya3B2b2psYXJlbXIifQ.lqcRz0-kLaGP4vIgZNmHIw";

// export default function MapWithGeocoder() {
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const mapInstanceRef = useRef<mapboxgl.Map | undefined>(undefined);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   useEffect(() => {
//     mapboxgl.accessToken = accessToken;

//     if (mapContainerRef.current) {
//       mapInstanceRef.current = new mapboxgl.Map({
//         container: mapContainerRef.current, // container ID
//         center: [-74.5, 40], // starting position [lng, lat]
//         zoom: 9, // starting zoom
//       });
//       mapInstanceRef.current.on("load", () => {
//         setMapLoaded(true);
//       });
//     } else {
//       mapInstanceRef.current = undefined;
//       setMapLoaded(false);
//     }
//   }, []);

//   return (
//     <>
//       <SearchBox
//         accessToken={accessToken}
//         map={mapInstanceRef.current}
//         mapboxgl={mapboxgl}
//         value={inputValue}
//         onChange={(d) => {
//           setInputValue(d);
//         }}
//         marker
//       />
//       <div id="map-container" ref={mapContainerRef} style={{ height: 300 }} />
//     </>
//   );
// }
