import React, { useRef, useEffect, useCallback } from 'react'

function Sketch({ sketch }) {
  let canvasRef = useRef(null)

  const memoSketch = useCallback(c => sketch(c), [false])

  useEffect(() => {
    if (canvasRef && canvasRef.current && memoSketch) {
      console.log(canvasRef.current)
      memoSketch(canvasRef.current)
    }
  }, [canvasRef.current])

  return <canvas ref={canvasRef} />
}

export default Sketch
