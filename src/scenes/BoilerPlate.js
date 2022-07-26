import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import BasicCube from '../components/Basics/BasicCube'
import BasicPointLight from '../components/Basics/BasicPointLight'
import { random } from '../lib/utils'

function BoilerPlate(canvas) {
  // globals
  let opts = {
    w: window.innerWidth,
    h: window.innerHeight,
    planeSize: 100,
    numCubes: 10,
  }

  let scene,
    camera,
    renderer,
    cubes = [],
    controls,
    pointLight,
    plane,
    timeStep = 0,
    raycaster,
    pointer
  // stats
  const stats = Stats()
  document.body.appendChild(stats.dom)
  // gui
  const gui = new GUI()
  gui.add(opts, 'numCubes', 1, 50, 1).onChange(changeCubeNumber)
  //  ___ ___ _____ _   _ ___
  // / __| __|_   _| | | | _ \
  // \__ \ _|  | | | |_| |  _/
  // |___/___| |_|  \___/|_|
  //
  function setup(canvas) {
    scene = new THREE.Scene()
    // camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100)
    camera = new THREE.PerspectiveCamera(75, opts.w / opts.h, 0.1, 1000)
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(opts.w, opts.h)

    // controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    //camera
    camera.position.z = 20
    camera.position.y = 20

    //raycaster
    raycaster = new THREE.Raycaster()
    pointer = new THREE.Vector2()

    // light
    pointLight = new BasicPointLight({ position: new THREE.Vector3(10, 20, 10) })
    pointLight.addTo(scene)

    plane = new THREE.Mesh(
      new THREE.PlaneGeometry(opts.planeSize, opts.planeSize, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x666666 }),
    )
    plane.receiveShadow = true
    plane.castShadow = false
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)

    changeCubeNumber(10)

    renderer.setSize(opts.w, opts.h)
  }

  function changeCubeNumber(numCubes) {
    let delta = numCubes - cubes.length
    if (cubes.length > numCubes) {
      const toRemove = cubes.slice(delta)
      toRemove.forEach(e => e.removeFrom(scene))
      cubes = cubes.slice(0, numCubes)
    } else {
      for (let i = 0; i < delta; i++) {
        const x = random(-10, 10)
        const y = random(0, 10)
        const z = random(-10, 10)
        const c = new BasicCube({
          position: new THREE.Vector3(x, y, z),
        })
        c.addTo(scene)
        cubes.push(c)
      }
    }
  }

  //    _   _  _ ___ __  __   _ _____ ___
  //   /_\ | \| |_ _|  \/  | /_\_   _| __|
  //  / _ \| .` || || |\/| |/ _ \| | | _|
  // /_/ \_\_|\_|___|_|  |_/_/ \_\_| |___|
  //
  function animate() {
    renderer.render(scene, camera)
    controls.update()
    cubes.forEach(e => e.animate(timeStep))
    pointLight.animate(timeStep)
    stats.update()
    requestAnimationFrame(animate)
    timeStep += 0.005
  }

  setup(canvas)
  animate()

  window.addEventListener('resize', onWindowResize, false)
  window.addEventListener('pointermove', onPointerMove)

  function onWindowResize() {
    opts.w = window.innerWidth
    opts.h = window.innerHeight
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function onPointerMove(event) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    const meshes = cubes.map(e => e.mesh)
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(meshes, false)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      const object = intersect.object
      object.material.color.set(0xff0000)
      
    }
  }
}

export default BoilerPlate
