import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import FlippingCube from '../components/FlippingCubes/BasicFlippingCube'
import BasicPointLight from '../components/Basics/BasicPointLight'
import { LEFT, RIGHT, FORWARD, BACK, STAY } from '../lib/constants'

function FlippingCubes(canvas) {
  // globals
  let opts = {
    w: window.innerWidth,
    h: window.innerHeight,
    planeSize: 100,
  }

  let scene,
    camera,
    renderer,
    cubes = [],
    controls,
    pointLight,
    plane,
    flipDir = RIGHT

  const stats = Stats()
  document.body.appendChild(stats.dom)

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
    camera.position.z = 8
    camera.position.y = 1

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
    plane.position.y = -0.5
    scene.add(plane)

    const cube = new FlippingCube({
      position: new THREE.Vector3(0, 0, 0),
    })
    cube.addTo(scene)
    cubes.push(cube)

    renderer.setSize(opts.w, opts.h)
  }

  //    _   _  _ ___ __  __   _ _____ ___
  //   /_\ | \| |_ _|  \/  | /_\_   _| __|
  //  / _ \| .` || || |\/| |/ _ \| | | _|
  // /_/ \_\_|\_|___|_|  |_/_/ \_\_| |___|
  //
  function animate() {
    renderer.render(scene, camera)
    controls.update()
    stats.update()
    cubes.forEach(e => e.flip(flipDir, 0.5))
    requestAnimationFrame(animate)
  }

  setup(canvas)
  animate()

  window.addEventListener('resize', onWindowResize, false)
  window.addEventListener('keydown', setFlipDir)

  function onWindowResize() {
    opts.w = window.innerWidth
    opts.h = window.innerHeight
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function setFlipDir(event) {
    event.preventDefault()
    switch (event.code) {
      case 'ArrowUp':
        flipDir = BACK
        break
      case 'ArrowDown':
        flipDir = FORWARD
        break
      case 'ArrowRight':
        flipDir = RIGHT
        break
      case 'ArrowLeft':
        flipDir = LEFT
        break
      case 'Space':
        flipDir = STAY
        break
      default:
        break
    }
  }
}

export default FlippingCubes
