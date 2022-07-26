import * as THREE from 'three'
import BasicCube, { BasicCubeDefaults } from '../Basics/BasicCube'
import { rotateAboutPoint, degToRad } from '../../lib/utils'
import {
  LEFT,
  RIGHT,
  DOWN,
  UP,
  BACK,
  FORWARD,
  XAXIS,
  ZAXIS,
  YAXIS,
  STAY,
} from '../../lib/constants'

export const BasicFlippingCubeDefaults = {
  ...BasicCubeDefaults,
  speed: 1,
}

class BasicFlippingCube extends BasicCube {
  constructor(props = {}) {
    const options = { ...BasicFlippingCubeDefaults, ...props }
    super(options)
    //inherited
    // this.size
    // this.geometry
    // this.material
    // this.mesh
    this.options = options
    this.ofRotation = null
    this.rotation = 0
    this.isDone = false
    this.speed = 1
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

  flip(dir, floor) {
    // if flipped 90 deg. reset
    if (this.rotation >= 90 || !this.ofRotation) {
      this.rotation = 0
      this.mesh.rotation.set(0, 0, 0)
      const { point, axis, direction } = this.getNewOfRotation(dir, floor)
      this.setOfRotation(point, direction, axis)
    }
    if (this.isDone) return
    // otherwise rotate about the point
    const { point, axis, direction } = this.ofRotation
    const convertedTheta = direction * degToRad(this.speed)
    rotateAboutPoint(this.mesh, point, axis, convertedTheta, true)
    this.rotation += this.speed
  }

  /**
   *
   * @param {Vector3} dir - desired direction of travel
   * @param {Vector3} floor - the "floor" that is perpendicular to the direction of travel
   * @returns
   */
  getNewOfRotation(dir, floor) {
    const a = dir.clone().multiplyScalar(this.size)
    const b = floor.clone().multiplyScalar(this.size)
    a.divideScalar(2)
    b.divideScalar(2)
    const normalizedPointOfRotation = a.clone().add(b)
    const curPos = this.mesh.position.clone()
    // floor movement
    if (dir.equals(LEFT) && floor.equals(DOWN)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: ZAXIS,
      }
    } else if (dir.equals(RIGHT) && floor.equals(DOWN)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: ZAXIS,
      }
    } else if (dir.equals(BACK) && floor.equals(DOWN)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: XAXIS,
      }
    } else if (dir.equals(FORWARD) && floor.equals(DOWN)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: XAXIS,
      }
      // UP
    } else if (dir.equals(UP) && floor.equals(RIGHT)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: ZAXIS,
      }
    } else if (dir.equals(UP) && floor.equals(LEFT)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: ZAXIS,
      }
    } else if (dir.equals(UP) && floor.equals(FORWARD)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: XAXIS,
      }
    } else if (dir.equals(UP) && floor.equals(BACK)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: XAXIS,
      }
      //DOWN
    } else if (dir.equals(DOWN) && floor.equals(RIGHT)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: ZAXIS,
      }
    } else if (dir.equals(DOWN) && floor.equals(LEFT)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: ZAXIS,
      }
    } else if (dir.equals(DOWN) && floor.equals(FORWARD)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: XAXIS,
      }
    } else if (dir.equals(DOWN) && floor.equals(BACK)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: XAXIS,
      }
      // wall movement
    } else if (dir.equals(FORWARD) && floor.equals(RIGHT)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: YAXIS,
      }
    } else if (dir.equals(BACK) && floor.equals(RIGHT)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: YAXIS,
      }
    } else if (dir.equals(FORWARD) && floor.equals(LEFT)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: YAXIS,
      }
    } else if (dir.equals(BACK) && floor.equals(LEFT)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: YAXIS,
      }
    } else if (dir.equals(RIGHT) && floor.equals(FORWARD)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: YAXIS,
      }
    } else if (dir.equals(LEFT) && floor.equals(FORWARD)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: YAXIS,
      }
    } else if (dir.equals(RIGHT) && floor.equals(BACK)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: YAXIS,
      }
    } else if (dir.equals(LEFT) && floor.equals(BACK)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: YAXIS,
      }
    } else if (dir.equals(LEFT) && floor.equals(UP)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: ZAXIS,
      }
    } else if (dir.equals(RIGHT) && floor.equals(UP)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: ZAXIS,
      }
    } else if (dir.equals(BACK) && floor.equals(UP)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: 1,
        axis: XAXIS,
      }
    } else if (dir.equals(FORWARD) && floor.equals(UP)) {
      return {
        point: curPos.add(normalizedPointOfRotation),
        direction: -1,
        axis: XAXIS,
      }
    } else {
      this.isDone = true
      return {
        point: curPos,
        direction: 0,
        axis: STAY,
      }
    }
  }

  setDone(isDone) {
    this.isDone = isDone
  }

  setOfRotation(point, direction, axis) {
    this.ofRotation = {
      point,
      axis,
      direction,
    }
  }
}

export default BasicFlippingCube
