import React from 'react'
import Sketch from '../Sketch'
import GridPlacement from '../../scenes/GridPlacement'
import AssemblingCubes from '../../scenes/AssemblingCubes/AssemblingCubes'

function App() {
  return (
    <div className="App">
      <Sketch sketch={AssemblingCubes} />
    </div>
  )
}

export default App
