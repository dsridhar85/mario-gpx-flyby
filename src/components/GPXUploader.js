import React from "react";
import GPXParser from "gpxparser";

export default function GPXUploader({ onLoad }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const gpx = new GPXParser();
        gpx.parse(reader.result);
        const track = gpx.tracks[0];
        if (track && track.points.length) {
          onLoad(track.points);
        } else {
          alert("No track points found in this GPX file.");
        }
      };
      reader.readAsText(file);
    }
  };
  return <input type="file" accept=".gpx" onChange={handleFile} />;
}
