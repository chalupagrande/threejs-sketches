import { Vector3 } from 'three'
import { saveFile } from '../../lib/utils'

class Grid {
  constructor(dimensions, scale = 1) {
    const dim = dimensions || new Vector3(10, 10, 10)
    this.shape = dim.clone()
    this.offset = new Vector3(
      dim.x % 2 === 0 ? Math.floor(dim.x / 2) - 0.5 : Math.floor(dim.x / 2) + 0.5,
      -0.5,
      dim.z % 2 === 0 ? Math.floor(dim.z / 2) - 0.5 : Math.floor(dim.z / 2) + 0.5,
    )
    this.scale = scale
    this.grid = []
    for (let x = 0; x < dim.x; x++) {
      this.grid.push([])
      for (let y = 0; y < dim.y; y++) {
        this.grid[x].push([])
        for (let z = 0; z < dim.z; z++) {
          this.grid[x][y].push(0)
        }
      }
    }
  }

  set(vector, val) {
    const { x, y, z } = vector
    if (
      x < 0 ||
      y < 0 ||
      z < 0 ||
      x > this.shape.x - 1 ||
      y > this.shape.y - 1 ||
      z > this.shape.z - 1
    ) {
      throw Error('Out of bounds')
    }
    return (this.grid[x][y][z] = val)
  }

  get(vector) {
    const { x, y, z } = vector
    if (
      x < 0 ||
      y < 0 ||
      z < 0 ||
      x > this.shape.x - 1 ||
      y > this.shape.y - 1 ||
      z > this.shape.z - 1
    ) {
      return null
    }
    return this.grid[x][y][z]
  }

  loop(func) {
    const [dimx, dimy, dimz] = this.shape
    for (let x = 0; x < dimx; x++) {
      for (let y = 0; y < dimy; y++) {
        for (let z = 0; z < dimz; z++) {
          const val = this.grid[x][y][z]
          func(val, new Vector3(x, y, z))
        }
      }
    }
  }

  getWorldCoordinatesFromGrid(vector) {
    return vector.clone().sub(this.offset).multiplyScalar(this.scale)
  }
  getGridCoordinatesFromWorld(vector) {
    return vector.clone().divideScalar(this.scale).add(this.offset).round()
  }

  setByPosition(vector, val) {
    const gridPos = this.getGridCoordinatesFromWorld(vector)
    return this.set(gridPos, val)
  }

  getByPosition(vector) {
    const gridPos = this.getGridCoordinatesFromWorld(vector)
    return this.get(gridPos)
  }

  save() {
    saveFile(JSON.stringify(this), 'grid.json', 'application/json')
  }

  load(json) {
    const parsed = JSON.parse(json)
    this.scale = parsed.scale
    this.shape = new Vector3(...Object.values(parsed.shape))
    this.offset = new Vector3(...Object.values(parsed.offset))
    this.grid = parsed.grid
  }

  /**
   * DEPRECATED
   * Get neighbors function needs to return GraphNodes
   */
  // getNeighbors(vector) {
  //   const curPos = vector.clone()
  //   const result = new Map()
  //   // left
  //   const left = new Vector3(...curPos).add(LEFT)
  //   result.set(left, this.get(left))
  //   // right
  //   const right = new Vector3(...curPos).add(RIGHT)
  //   result.set(right, this.get(right))
  //   // up
  //   const up = new Vector3(...curPos).add(UP)
  //   result.set(up, this.get(up))
  //   // down
  //   const down = new Vector3(...curPos).add(DOWN)
  //   result.set(down, this.get(down))
  //   // forward
  //   const forward = new Vector3(...curPos).add(FORWARD)
  //   result.set(forward, this.get(forward))
  //   // back
  //   const back = new Vector3(...curPos).add(BACK)
  //   result.set(back, this.get(back))
  //   // // upBack
  //   // const upBack = new Vector3(...curPos).add(UP).add(BACK)
  //   // result.set(upBack, this.get(upBack))
  //   // // upForward
  //   // const upForward = new Vector3(...curPos).add(UP).add(FORWARD)
  //   // result.set(upForward, this.get(upForward))
  //   // // upLeft
  //   // const upLeft = new Vector3(...curPos).add(UP).add(LEFT)
  //   // result.set(upLeft, this.get(upLeft))
  //   // // upRight
  //   // const upRight = new Vector3(...curPos).add(UP).add(RIGHT)
  //   // result.set(upRight, this.get(upRight))
  //   // // downBack
  //   // const downBack = new Vector3(...curPos).add(DOWN).add(BACK)
  //   // result.set(downBack, this.get(downBack))
  //   // // downForward
  //   // const downForward = new Vector3(...curPos).add(DOWN).add(FORWARD)
  //   // result.set(downForward, this.get(downForward))
  //   // // downLeft
  //   // const downLeft = new Vector3(...curPos).add(DOWN).add(LEFT)
  //   // result.set(downLeft, this.get(downLeft))
  //   // // downRight
  //   // const downRight = new Vector3(...curPos).add(DOWN).add(RIGHT)
  //   // result.set(downRight, this.get(downRight))
  //   // // forwardRight
  //   // const forwardRight = new Vector3(...curPos).add(FORWARD).add(RIGHT)
  //   // result.set(forwardRight, this.get(forwardRight))
  //   // // forwardLeft
  //   // const forwardLeft = new Vector3(...curPos).add(FORWARD).add(LEFT)
  //   // result.set(forwardLeft, this.get(forwardLeft))
  //   // // backRight
  //   // const backRight = new Vector3(...curPos).add(BACK).add(RIGHT)
  //   // result.set(backRight, this.get(backRight))
  //   // // backLeft
  //   // const backLeft = new Vector3(...curPos).add(BACK).add(LEFT)
  //   // result.set(backLeft, this.get(backLeft))

  //   return result
  // }
}

export default Grid
