import React from "react";

export default function Controls({ playing, onPlayPause, speed, onSpeed }) {
  return (
    <div style={{ margin: "1rem 0" }}>
      <button onClick={onPlayPause}>{playing ? "Pause" : "Play"}</button>
      <label style={{ marginLeft: 16 }}>
        Speed: {speed}x{" "}
        <input
          type="range"
          min="1"
          max="200"
          value={speed}
          onChange={e => onSpeed(Number(e.target.value))}
          style={{ verticalAlign: "middle" }}
        />
      </label>
    </div>
  );
}
