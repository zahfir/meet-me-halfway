"use client";
import MapboxGL from "./components/MapboxGL";
import PersonSection from "@/app/components/Person/PersonSection";
import "bootstrap/dist/css/bootstrap.min.css";
import POIDetailsModal from "./components/POIDetailsModal/POIDetailsModal";

export const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiemFoZmlyIiwiYSI6ImNtMWw2emJzazAyanAya3B2b2psYXJlbXIifQ.lqcRz0-kLaGP4vIgZNmHIw";

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <MapboxGL />

      <PersonSection />
      <POIDetailsModal />
    </div>
  );
}
