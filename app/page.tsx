"use client";
import MapboxGL from "./components/MapboxGL";
import AddressSection from "@/app/components/AddressSection";
import "bootstrap/dist/css/bootstrap.min.css";

export const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiemFoZmlyIiwiYSI6ImNtMWw2emJzazAyanAya3B2b2psYXJlbXIifQ.lqcRz0-kLaGP4vIgZNmHIw";

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <MapboxGL />

      <AddressSection />
    </div>
  );
}
