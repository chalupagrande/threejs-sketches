import { Vector3 } from 'three'

class Grid {
  constructor(dim, scale = 1) {
    this.offset = new Vector3(
      dim.x % 2 === 0 ? Math.floor(dim.x / 2) - 0.5 : Math.floor(dim.x / 2) + 0.5, 
      -0.5, 
      dim.z % 2 === 0 ? Math.floor(dim.z / 2) - 0.5 : Math.floor(dim.z / 2) + 0.5)
    this.scale = scale
    this.shape = dim.clone()
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
  set(x, y, z, val) {
    return (this.grid[x][y][z] = val)
  }
  get(x, y, z) {
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

  setByPosition(vector, val) {
    const { x, y, z } = vector.clone().divideScalar(this.scale).add(this.offset)
    console.log(x,y,z)
    const shape = this.shape
    if (x < 0 || x >= shape.x || y < 0 || y >= shape.y || z < 0 || z >= shape.z) {
      throw Error(`Out of bounds: ${x},${y},${z}`)
    }

    return (this.grid[x][y][z] = val)
  }

  getByPosition(vector) {
    const { x, y, z } = vector.clone().divideScalar(this.scale).add(this.offset)
    console.log(x,y,z)
    const shape = this.shape
    if (x < 0 || x >= shape.x || y < 0 || y >= shape.y || z < 0 || z >= shape.z) {
      throw Error(`Out of bounds: ${x},${y},${z}`)
    }
    return this.grid[x][y][z]
  }
}

export default Grid
