import * as THREE from 'three'

export const BasicCubeDefaults = {
  size: 1,
  color: new THREE.Color('skyblue'),
  position: new THREE.Vector3(0, 0.5, 0),
  castShadow: true,
  receiveShadow: true,
}

class BasicCube {
  constructor(props = {}, material = {}) {
    const o = { ...BasicCubeDefaults, ...props }
    this.options = o
    this.size = o.size
    this.geometry = new THREE.BoxGeometry(o.size, o.size, o.size)
    // MeshStandardMaterial allows for shadows on the object
    this.material = new THREE.MeshStandardMaterial({ color: o.color, ...material })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.receiveShadow = o.receiveShadow
    this.mesh.castShadow = o.castShadow
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
