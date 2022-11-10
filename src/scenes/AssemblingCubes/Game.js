import * as THREE from 'three'
import BasicCube from '../../components/Basics/BasicCube'
import Grid from '../../components/Basics/Grid'
import AssemblingCube from './AssemblingCube'
import { random, isPerpendicular } from '../../lib/utils'
import { DIRECTIONS } from '../../lib/constants'
import { AssemblingNode } from './AssemblingCubesNode'

class Game {
  constructor(targetGridJSON, scene) {
    this.grid = new Grid()
    this.grid.load(targetGridJSON)
    this.cubes = [] // cube elements
    this.targets = [] // target grid coordinates
    this.scene = scene

    this.getNeighborsForNode = this.getNeighborsForNode.bind(this)
  }

  init() {
    // loop over target and place placeholders.
    this.grid.loop((val, coords) => {
      if (val) {
        // place targetBox
        this.targets.push(coords)
        const placeholder = new BasicCube(
          {
            position: this.grid.getWorldCoordinatesFromGrid(coords),
            size: this.grid.scale,
            color: 0xff0000,
            castShadow: false,
            receiveShadow: false,
          },
          { opacity: 0.5, transparent: true },
        )
        placeholder.addTo(this.scene)
        // reset this value to 0
        this.grid.set(coords, 0)
      }
    })
    // place real box randomly
    this.targets.forEach(e => {
      const x = random(0, this.grid.shape.x, true)
      const y = 0 // place somewhere on the ground
      const z = random(0, this.grid.shape.z, true)

      const randomGridPos = new THREE.Vector3(x, y, z)
      const randomWorldPos = this.grid.getWorldCoordinatesFromGrid(randomGridPos)

      const cube = new AssemblingCube({
        position: randomWorldPos,
        speed: 3, // speed must be a divisor of 90
        size: this.grid.scale,
      })
      cube.addTo(this.scene)
      cube.init(this)
      this.cubes.push(cube)
      // set its current position
    })
  }

  /**
   * Finds the closest target and returns its Vector3 Grid Position
   * @param {*} gridPos
   * @returns
   */
  findClosestTarget(gridPos) {
    const targets = this.targets
    const closestTarget = targets.reduce((a, e) => {
      const prevDist = gridPos.clone().sub(a).length()
      const curDist = gridPos.clone().sub(e).length()
      return Math.min(prevDist, curDist) === curDist ? e : a
    }, new THREE.Vector3(Infinity, Infinity, Infinity))
    return closestTarget.clone()
  }

  /**
   *
   * if it is a legal move, returns the floor direction
   * otherwise returns false
   * @param {*} gridPos
   * @param {*} directionOfTravel
   * @returns
   */
  getPossibleFloors(gridPos, directionOfTravel) {
    const possibleFloors = []
    // check to see that you are not going through the floor
    const desiredNextSpace = gridPos.clone().add(directionOfTravel)
    if (desiredNextSpace.y < 0) return false
    Object.entries(DIRECTIONS).forEach(([key, dir]) => {
      // if it is perpendicular, check the value
      if (isPerpendicular(dir, directionOfTravel)) {
        // if the value is 0 or null, add it as a possible
        const posToCheck = gridPos.clone().add(dir)
        const gridValue = this.grid.get(posToCheck)
        // also check one space over (ie just the corners touch)
        const oneOver = posToCheck.add(directionOfTravel)
        const oneOverValue = this.grid.get(oneOver)
        if (!!gridValue || posToCheck.y < 0) {
          possibleFloors.push(dir)
        } else if (oneOver.y < 0 || !!oneOverValue) {
          possibleFloors.push(dir)
        }
      }
    })
    return possibleFloors.length ? possibleFloors : false
  }

  /**
   *
   * @param {*} gridPos
   * @param {*} directionOfTravel
   * @param {*} game
   * @returns
   */
  isLegalMove(gridPos, directionOfTravel) {
    const possibleFloors = this.getPossibleFloors(gridPos, directionOfTravel)
    const nextPos = gridPos.clone().add(directionOfTravel)
    const nextValue = this.grid.get(nextPos)
    if (!possibleFloors || nextValue) return false
    // // iterate through possible floors and see if any arent allowed.
    /**
     *
     * THIS STIPULATION WILL LIKELY NOT ALLOW
     * for a block to move down into a hole.
     *   ⌐ B
     *   | X  0  X  X
     *   | X  X  X  X
     *   | X
     *
     * Box B will not be able to flip into space 0 with the following conditions
     * outlined below.
     */
    // const filteredFloors = possibleFloors.filter(floor => {
    //   const oppositeFloor = floor.clone().multiplyScalar(-1)
    //   const diagonallyAcross = oppositeFloor.clone().add(directionOfTravel)
    //   const oppositeFloorValue = game.grid.get(oppositeFloor)
    //   const diagonallyAcrossValue = game.grid.get(diagonallyAcross)
    //   return !oppositeFloorValue && !diagonallyAcrossValue
    // })
    // return filteredFloors.length ? filteredFloors : false
    return possibleFloors
  }

  getNeighborsForNode(node) {
    const gridPos = node.data.position
    const { x: xMax, y: yMax, z: zMax } = this.grid.shape
    const result = []
    Object.values(DIRECTIONS).forEach(dir => {
      const nbr = gridPos.clone().add(dir)
      if (nbr.x < 0 || nbr.x >= xMax || nbr.y < 0 || nbr.y >= yMax || nbr.z < 0 || nbr.z >= zMax) {
        return
      } else {
        result.push(new AssemblingNode(nbr))
      }
    })
    return result
  }

  calcDistanceBetweenNodes(aNode, bNode) {
    const aPos = aNode.data.position.clone()
    const bPos = bNode.data.position.clone()
    return aPos.distanceTo(bPos)
  }

  animate() {
    this.cubes.forEach((e, i) => {
      if (i === 0) console.log(e.gridPos)
      e.assemble(this)
    })
  }
}

export default Game

/**
 * Pseudo code for GAME
 *
 * //init 2 lists of targets
 * totalList = []
 * availableList = []
 *
 *
 * For Each cube
 *  func find&SetPath {
 *    cube.path = A* to target in available list
 *    add cube to target.hunters
 *  }
 *
 * when flipping, if the cube sets any locations to obstructed
 *  trigger an event that makes all cubes search their path for obstructions
 *  if obstructed,
 *    findAndSetPath
 *
 *
 *
 * add event listener -- when a cube makes it to the target,
 *  add any squares that opens up to the availableList
 *
 */
