import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import all Mario directions
import marioRunLeft1 from "../assets/mario-run-left-1.png";
import marioRunLeft2 from "../assets/mario-run-left-2.png";
import marioRunRight1 from "../assets/mario-run-right-1.png";
import marioRunRight2 from "../assets/mario-run-right-2.png";
import marioRunUp1 from "../assets/mario-run-up-1.png";
import marioRunUp2 from "../assets/mario-run-up-2.png";
import marioRunDown1 from "../assets/mario-run-down-1.png";
import marioRunDown2 from "../assets/mario-run-down-2.png";

// Helper to determine direction
function getDirection(prev, next) {
  if (!prev || !next) return "down";
  const dx = next.lon - prev.lon;
  const dy = next.lat - prev.lat;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  return dy > 0 ? "down" : "up";
}

// Mario sprites by direction
const marioSprites = {
  left: [marioRunLeft1, marioRunLeft2],
  right: [marioRunRight1, marioRunRight2],
  up: [marioRunUp1, marioRunUp2],
  down: [marioRunDown1, marioRunDown2]
};

export default function MapDisplay({ points, marioIndex }) {
  const [frame, setFrame] = useState(0);
  const [isHopping, setIsHopping] = useState(false);

  useEffect(() => {
    // Running frame alternates every 6 steps for animation
    if (points.length) {
      const interval = setInterval(() => {
        setFrame(f => (f + 1) % 2);
      }, 120);
      return () => clearInterval(interval);
    }
  }, [points]);

  useEffect(() => {
    // Hop every 30 steps (customize as needed)
    if (points.length && marioIndex > 0 && marioIndex % 30 === 0) {
      setIsHopping(true);
      setTimeout(() => setIsHopping(false), 350); // hop duration
    }
  }, [marioIndex, points.length]);

  if (!points.length) return null;
  const prev = points[marioIndex - 1] || points[marioIndex];
  const curr = points[marioIndex];
  const next = points[marioIndex + 1] || curr;

  const direction = getDirection(prev, next);
  const marioIcon = new L.Icon({
    iconUrl: marioSprites[direction][frame],
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    className: "mario-icon"
  });

  // Offset Mario for hop animation
  let hopOffset = [0, 0];
  if (isHopping) {
    switch (direction) {
      case "up": hopOffset = [0, -15]; break;
      case "down": hopOffset = [0, -15]; break;
      case "left": hopOffset = [-10, -10]; break;
      case "right": hopOffset = [10, -10]; break;
      default: break;
    }
  }

  // Apply offset to position
  const toLeaflet = (lat, lon, offset = [0, 0]) => [
    lat + (offset[1] * 0.000009), // latitude degrees per meter approx
    lon + (offset[0] * 0.000013)
  ];

  return (
    <div style={{ height: 400, marginTop: 16 }}>
      <MapContainer center={[curr.lat, curr.lon]} zoom={15} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={points.map(p => [p.lat, p.lon])} color="red" />
        <Marker
          position={toLeaflet(curr.lat, curr.lon, hopOffset)}
          icon={marioIcon}
        />
      </MapContainer>
    </div>
  );
}
