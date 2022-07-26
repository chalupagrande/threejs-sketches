import * as THREE from 'three'
import BasicFlippingCube, { BasicFlippingCubeDefaults } from './BasicFlippingCube'
import { generateId, isPerpendicular } from '../../lib/utils'
import { ZERO, DIRECTIONS } from '../../lib/constants'
import { aStar, AssemblingNode } from '../../lib/Graph'

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
    this.id = generateId
    this.target = null // current target vector in grid coordinates
    this.curDirection = null // current normal direction vector
    this.curFloor = null // current floor vector Perpendicular to curDirection
    this.gridPos = null
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

  assemble(game) {
    const grid = game.grid
    if (this.rotation === 0) {
      const curPos = this.mesh.position.clone()
      const gridPos = grid.getGridCoordinatesFromWorld(curPos)
      const closestTarget = game.findClosestTarget(gridPos)
      this.target = closestTarget
      this.gridPos = gridPos
      // this.findPathToTarget(game)
    }
  }

  findPathToTarget(game) {
    console.time('aStar')
    const startNode = new AssemblingNode(this.gridPos)
    const targetNode = new AssemblingNode(this.target)
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
    console.timeEnd('aStar')
  }

  /**
   * adds the Cube to Grid
   * @param {*} grid
   * @param {*} position
   */
  addToGrid(grid, position) {
    this.grid = grid
    this.mesh.position.set(position)
    this.rotation.set(ZERO)
    this.grid.setByPosition(position)
  }
}

export default AssemblingCube
