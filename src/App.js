import {useEffect, useRef, useState} from 'react'
import glManager from './glManager'

const TIMESTEP = 50

const App = () => {
  const [juliaSeed, setJuliaSeed] = useState([ 0.33, 0.56, 0.43, -0.72,]);
  const [plane, setPlane] = useState(0.01);

  const [cameraPos, setCameraPos] = useState([1.24, 0, 0.44]);
  const [cameraAxisX, setCameraAxisX] = useState([0.794, 0, -0.604]);
  const [cameraAxisY, setCameraAxisY] = useState([-0.604, 0, -0.794]);
  const [cameraAxisZ, setCameraAxisZ] = useState([0.0, 1.0, 0.0]);

  // ==============================
  // ======= KEYBOARD INPUT =======
  // ==============================

  const [wDown, setWDown] = useState(false);
  const [aDown, setADown] = useState(false);
  const [sDown, setSDown] = useState(false);
  const [dDown, setDDown] = useState(false);

  const onKeyDown = (ev) => {
    if (!wDown && ev.key === 'w') {
      setWDown(true);
    }
    if (!aDown && ev.key === 'a') {
      setADown(true);
    }
    if (!sDown && ev.key === 's') {
      setSDown(true);
    }
    if (!dDown && ev.key === 'd') {
      setDDown(true);
    }
  }

  const onKeyUp = (ev) => {
    if (ev.key === 'w') {
      setWDown(false);
    }
    if (ev.key === 'a') {
      setADown(false);
    }
    if (ev.key === 's') {
      setSDown(false);
    }
    if (ev.key === 'd') {
      setDDown(false);
    }
  }
  
  // ==============================
  // ===== TIMER AND MOVEMENT =====
  // ==============================

  const [t, setT] = useState(0);

  // timer
  // the timer will always be running, I added a mod to avoid integer overflow problems
  useEffect(() => {
    const timer = setTimeout(() => {setT((t + TIMESTEP) % 1e4)}, TIMESTEP);
    return () => clearTimeout(timer);
  }, [t])

  // movement
  // should only be updated as t updates
  useEffect(() => {
    let movement_vec = [0.0, 0.0, 0.0];

    if (wDown) {
      movement_vec = movement_vec.map((coord, i) => {
        return coord + cameraAxisY[i];
      })
    }
    if (aDown) {
      movement_vec = movement_vec.map((coord, i) => {
        return coord - cameraAxisX[i];
      })
    }
    if (sDown) {
      movement_vec = movement_vec.map((coord, i) => {
        return coord - cameraAxisY[i];
      })
    }
    if (dDown) {
      movement_vec = movement_vec.map((coord, i) => {
        return coord + cameraAxisX[i];
      })
    }

    const norm = Math.sqrt(movement_vec.reduce((prev, curr) => prev + curr*curr, 0));

    if (norm > 0.001) {
      const newCameraPos = cameraPos.map((coord, i) => {
        return coord + 0.001 * TIMESTEP * movement_vec[i];
      });
  
      setCameraPos(newCameraPos);
    }
  }, [t])

  // ==============================
  // ============ REFS ============
  // ==============================

  const canvasRef = useRef();
  const programRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      programRef.current = new glManager(canvas);
      programRef.current.render(cameraPos, cameraAxisX, cameraAxisY, cameraAxisZ, juliaSeed, plane);
    }
  }, [])

  useEffect(() => {
    programRef.current.render(cameraPos, cameraAxisX, cameraAxisY, cameraAxisZ, juliaSeed, plane);
  }, [cameraPos, cameraAxisX, cameraAxisY, cameraAxisZ, juliaSeed, plane])

  return (
    <canvas 
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onKeyDown={(ev) => onKeyDown(ev)}
      onKeyUp={(ev) => onKeyUp(ev)}
      style={{
          width: '100%',
          height: '100%'
      }}
      tabIndex={0}
    />
  );
}

export default App;
