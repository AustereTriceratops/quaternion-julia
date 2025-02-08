import React, {useEffect, useMemo, useRef, useState} from 'react'
import glManager from './glManager'
import Controls from './controls';

const TIMESTEP = 50

const App = () => {
  const [juliaSeed, setJuliaSeed] = useState([ -0.49, -0.12, 0.67, -0.08]);
  const [plane, setPlane] = useState(0.01);

  const [cameraPhi, setCameraPhi] = useState(0.1);
  const [cameraTheta, setCameraTheta] = useState(0); // TODO
  const [cameraDist, setCameraDist] = useState(3);

  // ==============================
  // ====== CAMERA 3D LOGIC =======
  // ==============================

  const cameraPos = useMemo(() => {
    return [
      cameraDist * Math.cos(cameraTheta) * Math.cos(cameraPhi),
      cameraDist * Math.sin(cameraTheta),
      cameraDist * Math.cos(cameraTheta) * Math.sin(cameraPhi)
    ];
  }, [cameraPhi, cameraTheta, cameraDist]);

  const cameraAxisX = useMemo(() => {
    return [
      Math.sin(cameraPhi),
      0,
      -Math.cos(cameraPhi)
    ];
  }, [cameraPhi]);

  const cameraAxisY = useMemo(() => {
    return [
      -Math.cos(cameraTheta) * Math.cos(cameraPhi),
      -Math.sin(cameraTheta),
      -Math.cos(cameraTheta) * Math.sin(cameraPhi)
    ];
  }, [cameraPhi, cameraTheta]);

  // TODO: allow Z axis rotation
  const cameraAxisZ = useMemo(() => {
    return [
      cameraAxisX[1]*cameraAxisY[2] - cameraAxisX[2]*cameraAxisY[1],
      cameraAxisX[2]*cameraAxisY[0] - cameraAxisX[0]*cameraAxisY[2],
      cameraAxisX[0]*cameraAxisY[1] - cameraAxisX[1]*cameraAxisY[0],
  ];
  }, [cameraAxisX, cameraAxisY]);

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
  // ======== MOUSE INPUT =========
  // ==============================

  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = (ev) => {
    setIsDragging(true);
  }

  const onMouseUp = (ev) => {
    setIsDragging(false);
  }

  const onMouseMove = (ev) => {
    if (isDragging) {
      let newCameraPhi = cameraPhi;
      newCameraPhi += 0.015 * ev.movementX;
      setCameraPhi(newCameraPhi);
      
      let newCameraTheta = cameraTheta;
      newCameraTheta += 0.015 * ev.movementY;
      newCameraTheta = Math.min(newCameraTheta, 0.8);
      newCameraTheta = Math.max(newCameraTheta, -0.8);
      setCameraTheta(newCameraTheta);
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
    let newCameraPhi = cameraPhi;
    let newCameraDist = cameraDist;
    let updated = false;

    if (wDown) {
      newCameraDist -= 0.1;
      updated = true;
    }
    if (aDown) {
      newCameraPhi += 0.1;
      updated = true;
    }
    if (sDown) {
      newCameraDist += 0.1;
      updated = true;
    }
    if (dDown) {
      newCameraPhi -= 0.1;
      updated = true;
    }

    if (updated) {
      setCameraPhi(newCameraPhi);
      setCameraDist(newCameraDist);
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
    <React.Fragment>
      <Controls
        plane={plane}
        setPlane={setPlane}
        juliaSeed={juliaSeed}
        setJuliaSeed={setJuliaSeed}
      />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onKeyDown={(ev) => onKeyDown(ev)}
        onKeyUp={(ev) => onKeyUp(ev)}
        onMouseDown={(ev) => onMouseDown(ev)}
        onMouseUp={(ev) => onMouseUp(ev)}
        onMouseMove={(ev) => onMouseMove(ev)}
        style={{
            width: '100%',
            height: '100%'
        }}
        tabIndex={1}
      />
    </React.Fragment>
  );
}

export default App;
