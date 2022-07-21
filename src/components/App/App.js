import React from 'react'
import Sketch from '../Sketch'
import FlippingCubes from '../../scenes/FlippingCubes'
import GridPlacement from '../../scenes/GridPlacement'

function App() {
  return (
    <div className="App">
      <Sketch sketch={GridPlacement} />
    </div>
  )
}

export default App
