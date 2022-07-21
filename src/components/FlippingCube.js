import * as THREE from 'three'
import BasicCube, { BasicCubeDefaults } from './Basics/BasicCube'
import { rotateAboutPoint } from '../lib/utils'
import { LEFT, RIGHT, DOWN, UP, BACK, FORWARD, XAXIS, ZAXIS, YAXIS } from '../lib/constants'
import { degToRad } from '../lib/utils'

export const FlippingCubeDefaults = {
  ...BasicCubeDefaults,
}

class FlippingCube extends BasicCube {
  constructor(props = {}) {
    super(props)
    this.ofRotation = null
    this.rotation = 0
  }

  flip(dir, theta) {
    // if flipped 90 deg. reset
    if (this.rotation >= 90 || !this.ofRotation) {
      this.rotation = 0
      this.mesh.rotation.set(0, 0, 0)
      const { point, axis, direction } = this.getNewOfRotation(dir)
      this.setOfRotation(point, direction, axis)
    }
    // otherwise rotate about the point
    const { point, axis, direction } = this.ofRotation
    const convertedTheta = direction * degToRad(theta)
    rotateAboutPoint(this.mesh, point, axis, convertedTheta, true)
    this.rotation += theta
  }

  setOfRotation(point, direction, axis) {
    this.ofRotation = {
      point,
      axis,
      direction,
    }
  }

  // gives you the new values for rotating about a
  // point give a direction.
  getNewOfRotation(dir) {
    const halfSize = this.options.size.x / 2
    const curPos = this.mesh.position.clone()
    if (dir.equals(LEFT)) {
      return {
        point: curPos.add(new THREE.Vector3(-halfSize, -halfSize, 0)),
        direction: 1,
        axis: ZAXIS,
      }
    } else if (dir.equals(RIGHT)) {
      return {
        point: curPos.add(new THREE.Vector3(halfSize, -halfSize, 0)),
        direction: -1,
        axis: ZAXIS,
      }
    } else if (dir.equals(BACK)) {
      return {
        point: curPos.add(new THREE.Vector3(0, -halfSize, -halfSize)),
        direction: -1,
        axis: XAXIS,
      }
    } else if (dir.equals(FORWARD)) {
      return {
        point: curPos.add(new THREE.Vector3(0, -halfSize, halfSize)),
        direction: 1,
        axis: XAXIS,
      }
    }
  }
}

export default FlippingCube
