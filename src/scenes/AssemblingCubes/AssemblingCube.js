import BasicFlippingCube, {
  BasicFlippingCubeDefaults,
} from '../../components/FlippingCubes/BasicFlippingCube'
import { generateId } from '../../lib/utils'
import { aStar } from '../../lib/Graph'
import { AssemblingNode } from './AssemblingCubesNode'

export const AssemblingCubeDefaults = {
  ...BasicFlippingCubeDefaults,
}

class AssemblingCube extends BasicFlippingCube {
  constructor(props = {}) {
    const options = { ...AssemblingCubeDefaults, ...props }
    super(options)
    this.options = options
    // INHERITED
    // this.geometry
    // this.material
    // this.mesh
    // this.ofRotation = null
    // this.rotation = 0
    // this.isDone = false
    // this.speed = 1
    this.id = generateId()
    this.target = null // current target vector in grid coordinates
    this.gridPos = null
    this.curDirection = null // current normal direction vector
    this.curFloor = null // current floor vector Perpendicular to curDirection
    this.path = null
    this.step = 0
    this.done = false
  }

  //  ___ _  _ _  _ ___ ___ ___ _____ ___ ___
  // |_ _| \| | || | __| _ \_ _|_   _| __|   \
  //  | || .` | __ | _||   /| |  | | | _|| |) |
  // |___|_|\_|_||_|___|_|_\___| |_| |___|___/
  //
  // flip
  // addTo
  // removeFrom
  // animate
  // getNewOfRotation
  // setOfRotation
  // setDone

  init(game) {
    if (!this.path) {
      // do not update gridPosition, otherwise path finding might use
      // its current position as a
      const curPos = this.mesh.position.clone()
      const gridPos = game.grid.getGridCoordinatesFromWorld(curPos)
      this.target = game.findClosestTarget(gridPos)

      this.path = this.findPathToTarget(gridPos, this.target, game)
      // cube spawned where it needs to be
      if (this.path.length === 0) {
        return (this.done = true)
      }
      const { position: nextPos, possibleFloors } = this.path[this.step].data
      const direction = nextPos.clone().sub(gridPos)
      this.curDirection = direction
      this.curFloor = possibleFloors[0]
      this.updateGridPosition(game)
    }
  }

  assemble(game) {
    if (this.done) return
    if (this.step < this.path.length) {
      this.flip(game)
    }
  }

  flip(game) {
    if (this.rotation >= 90) {
      const step = this.step + 1
      if (step === this.path.length) {
        return (this.done = true)
      }
      const { position: nextPos, possibleFloors } = this.path[step].data
      this.updateGridPosition(game)
      const direction = nextPos.clone().sub(this.gridPos)
      this.curDirection = direction
      this.curFloor = possibleFloors[0]
      this.step = step
    }
    super.flip(this.curDirection, this.curFloor)
  }

  updateGridPosition(game) {
    const curGridPos = this.gridPos
    if (curGridPos) game.grid.set(curGridPos, 0)
    const curPos = this.mesh.position.clone()
    const gridPos = game.grid.getGridCoordinatesFromWorld(curPos)
    game.grid.set(gridPos, 1)
    this.gridPos = gridPos
    return gridPos
  }

  findPathToTarget(startPos, targetPos, game) {
    const startNode = new AssemblingNode(startPos)
    const targetNode = new AssemblingNode(targetPos)
    const path = aStar(
      startNode,
      targetNode,
      AssemblingNode.checkNodeEquality,
      game.getNeighborsForNode,
      (current, neighbor) => {
        const curVector = current.data.position.clone()
        const neighborVector = neighbor.data.position.clone()
        const direction = neighborVector.sub(curVector)
        return game.isLegalMove(curVector, direction)
      },
      game.calcDistanceBetweenNodes,
    )
    return path
  }
}

export default AssemblingCube
