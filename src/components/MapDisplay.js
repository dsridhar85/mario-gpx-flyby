import React from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import mario from "../assets/mario-head.png";

// Fix Leaflet icon issues with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: mario,
  iconUrl: mario,
  shadowUrl: "",
});

const MarioIcon = new L.Icon({
  iconUrl: mario,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  className: "mario-icon"
});

export default function MapDisplay({ points, marioIndex }) {
  if (!points.length) return null;
  const position = [points[marioIndex].lat, points[marioIndex].lon];
  return (
    <div style={{ height: 400, marginTop: 16 }}>
      <MapContainer center={position} zoom={15} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={points.map(p => [p.lat, p.lon])} color="red" />
        <Marker
          position={position}
          icon={MarioIcon}
          // Mario hop effect: simple up/down offset every few points
          style={{
            transform:
              marioIndex % 20 < 10 ? "translateY(-12px)" : "translateY(0)"
          }}
        />
      </MapContainer>
    </div>
  );
}
