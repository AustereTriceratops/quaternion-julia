import {useEffect, useRef, useState} from 'react'
import glManager from './glManager'

const App = () => {
  const [juliaSeed, setJuliaSeed] = useState([ 0.33, 0.56, 0.43, -0.72,]);
  const [plane, setPlane] = useState(0.01);

  const [cameraPos, setCameraPos] = useState([1.24, 0, 0.44])
  const [cameraAxisX, setCameraAxisX] = useState([0.794, 0, -0.604])
  const [cameraAxisY, setCameraAxisY] = useState([-0.604, 0, -0.794])
  const [cameraAxisZ, setCameraAxisZ] = useState([0.0, 1.0, 0.0])

  // these are defaults from /source
  // static cameraX = new THREE.Vector3(0.794, 0, -0.604);
	// static cameraY = new THREE.Vector3(-0.604, 0, -0.794);
	// static cameraZ = new THREE.Vector3(0.0, 1.0, 0.0);
	// static cameraPos = new THREE.Vector3(1.24, 0, 0.44);

  const canvasRef = useRef();
  const programRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      programRef.current = new glManager(canvas);
      programRef.current.render(cameraPos, cameraAxisX, cameraAxisY, cameraAxisZ, juliaSeed, plane);
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
          width: '100%',
          height: '100%'
      }}
    />
  );
}

export default App;
