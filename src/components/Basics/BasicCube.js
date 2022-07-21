import * as THREE from 'three'

export const BasicCubeDefaults = {
  size: new THREE.Vector3(1, 1, 1),
  color: new THREE.Color('skyblue'),
  position: new THREE.Vector3(0,0.5,0),
}

class BasicCube {
  constructor(props = {}) {
    const o = { ...BasicCubeDefaults, ...props }
    this.options = o
    this.geometry = new THREE.BoxGeometry(...o.size)
    // MeshStandardMaterial allows for shadows on the object
    this.material = new THREE.MeshStandardMaterial({ color: o.color })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.receiveShadow = true
    this.mesh.castShadow = true
    this.mesh.position.set(...o.position)
  }

  addTo = scene => {
    scene.add(this.mesh)
  }

  removeFrom = scene => {
    scene.remove(this.mesh)
  }

  animate = () => {
    this.mesh.rotation.x += 0.01
    this.mesh.rotation.y += 0.01
  }
}

export default BasicCube
