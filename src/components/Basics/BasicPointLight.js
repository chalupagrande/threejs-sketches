import * as THREE from 'three'

export const BasicPointLightDefaults = {
  position: new THREE.Vector3(10, 10, 10),
  color: new THREE.Color('white'),
}
class BasicPointLight {
  constructor(props = {}) {
    const o = { ...BasicPointLightDefaults, ...props }
    this.options = o
    this.pointLight = new THREE.PointLight(o.color)
    this.pointLight.position.set(...o.position)
    // this.pointLight.castShadow = true
  }

  addTo = scene => {
    scene.add(this.pointLight)
  }

  animate = i => {
    // draw a circle of radius 20
    this.pointLight.position.x = Math.sin(-i) * 20
    this.pointLight.position.z = Math.cos(i) * 20
  }
}

export default BasicPointLight
