import React from "react";
import { gpx } from "@tmcw/togeojson";

export default function GPXUploader({ onLoad }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parser = new DOMParser();
          const xml = parser.parseFromString(reader.result, "application/xml");
          const geojson = gpx(xml);
          if (
            !geojson.features ||
            geojson.features.length === 0 ||
            !geojson.features[0].geometry ||
            !geojson.features[0].geometry.coordinates
          ) {
            alert("No valid track found in this GPX file.");
            return;
          }
          // Use the first LineString feature (usually the track)
          const coords = geojson.features[0].geometry.coordinates;
          const points = coords.map(([lon, lat, ele]) => ({
            lat,
            lon,
            ele,
          }));
          onLoad(points);
        } catch (err) {
          alert("Failed to parse GPX file.");
        }
      };
      reader.readAsText(file);
    }
  };
  return <input type="file" accept=".gpx" onChange={handleFile} />;
}