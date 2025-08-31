import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
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
  //if (!prev || !next) return "down";
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

// Helper component to control map center and zoom
function MapController({ curr, tracedPoints, isComplete }) {
  const map = useMap();
  useEffect(() => {
    if (isComplete && tracedPoints.length > 1) {
      // Fit bounds to all traced points at end
      const bounds = L.latLngBounds(tracedPoints.map(p => [p.lat, p.lon]));
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (curr) {
      // Keep Mario near center as navigation moves
      map.setView([curr.lat, curr.lon]);
    }
  }, [curr, tracedPoints, isComplete, map]);
  return null;
}

export default function MapDisplay({ points, marioIndex, bounds }) {
  const [frame, setFrame] = useState(0);
  const [isHopping, setIsHopping] = useState(false);
  const [showComplete, setShowComplete] = useState(false);


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

  useEffect(() => {
    // Show "activity complete" overlay at end
    if (points.length && marioIndex >= points.length - 1) {
      setShowComplete(true);
    } else {
      setShowComplete(false);
    }
  }, [marioIndex, points.length]);
  // Fit bounds on initial load

  // Use ref to avoid resetting map on every render
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current && bounds) {
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds]);

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

  // Only trace the path up to Mario's current position
  const tracedPoints = points.slice(0, marioIndex + 1);

  // If near the end, zoom out to show all traced path
  const isComplete = marioIndex >= points.length - 1;

  return (
    <div style={{ height: 400, marginTop: 16, position: "relative" }}>
      <MapContainer
        center={[curr.lat, curr.lon]}
        zoom={15}
        style={{ height: "100%" }}
        scrollWheelZoom={false}
        zoomControl={false}
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={tracedPoints.map(p => [p.lat, p.lon])} color="red" />
        <Marker
          position={toLeaflet(curr.lat, curr.lon, hopOffset)}
          icon={marioIcon}
        />
        <MapController curr={curr} tracedPoints={tracedPoints} isComplete={isComplete} />
      </MapContainer>
      {showComplete && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            color: "#fff",
            fontSize: 32,
            fontWeight: "bold",
            zIndex: 1000,
            borderRadius: 12,
            padding: "16px 32px",
            width: "fit-content",
            margin: "0 auto"
          }}
        >
          Activity Complete
        </div>
      )}
    </div>
  );
}