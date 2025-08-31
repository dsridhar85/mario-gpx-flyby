import React, { useState, useRef, useEffect } from "react";
import GPXUploader from "./components/GPXUploader";
import MapDisplay from "./components/MapDisplay";
import Controls from "./components/Controls";

function App() {
  const [points, setPoints] = useState([]);
  const [marioIdx, setMarioIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef();
  const [bounds, setBounds] = useState(null); // NEW

  useEffect(() => {
    if (playing && points.length) {
      timerRef.current = setInterval(() => {
        setMarioIdx(idx => (idx + 1 < points.length ? idx + 1 : idx));
      }, 1000 / speed);
      return () => clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed, points]);

  // Reset Mario if new GPX loaded
  useEffect(() => {
    setMarioIdx(0);
    if (points.length) {
      const lats = points.map(p => p.lat);
      const lons = points.map(p => p.lon);
      setBounds([
        [Math.min(...lats), Math.min(...lons)],
        [Math.max(...lats), Math.max(...lons)]
      ]);
    } else {
      setBounds(null);
    }
  }, [points]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Mario GPX Flyby!</h1>
      <GPXUploader onLoad={setPoints} />
      <Controls
        playing={playing}
        onPlayPause={() => setPlaying(p => !p)}
        speed={speed}
        onSpeed={setSpeed}
      />
      <MapDisplay points={points} marioIndex={marioIdx} bounds={bounds}/>
      <p style={{marginTop: '2rem'}}>Upload a .gpx file of your run, then press Play!</p>
    </div>
  );
}
export default App;
