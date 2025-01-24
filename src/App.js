import {useEffect, useRef} from 'react'
import glManager from './glManager'

const App = () => {
  const canvasRef = useRef();
  const programRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      programRef.current = new glManager(canvas);
      programRef.current.render();
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
