"use client";
import MapboxGL from "./components/MapboxGL";
import useMapStore from "@/app/state/useMapStore";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import AddressList from "@/app/components/AddressList";

export const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiemFoZmlyIiwiYSI6ImNtMWw2emJzazAyanAya3B2b2psYXJlbXIifQ.lqcRz0-kLaGP4vIgZNmHIw";

export default function Home() {
  const { addresses } = useMapStore();

  const addressCoords = addresses.map((address: SearchBoxRetrieveResponse) => {
    return {
      longitude: address.features[0].geometry.coordinates[0],
      latitude: address.features[0].geometry.coordinates[1],
    };
  });

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <MapboxGL addressCoords={addressCoords} />
      <div className="position-absolute top-0 start-0 w-25 h-100 bg-white bg-opacity-75 p-3 overflow-auto">
        <AddressList />
      </div>
    </div>
  );
}
