import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import AssemblingCube from '../../components/FlippingCubes/AssemblingCube'
import BasicPointLight from '../../components/Basics/BasicPointLight'
import { LEFT, RIGHT, FORWARD, BACK, STAY, DOWN, UP } from '../../lib/constants'
import Game from './Game'
import { Vector2 } from 'three'

function AssemblingCubes(canvas) {
  // globals

  let width = window.innerWidth
  let height = window.innerHeight

  let scene, camera, renderer, controls, pointLight, plane, game, grid
  const gridToLoad =
    '{"dimensions":{"x":10,"y":10,"z":10},"offset":{"x":4.5,"y":-0.5,"z":4.5},"scale":20,"shape":{"x":10,"y":10,"z":10},"grid":[[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,1,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]]}'

  const stats = Stats()
  document.body.appendChild(stats.dom)

  //  ___ ___ _____ _   _ ___
  // / __| __|_   _| | | | _ \
  // \__ \ _|  | | | |_| |  _/
  // |___/___| |_|  \___/|_|
  //
  function setup(canvas) {
    scene = new THREE.Scene()
    game = new Game(gridToLoad, scene)
    grid = game.grid
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    // controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    const size = grid.scale * grid.shape.x
    const gridHelper = new THREE.GridHelper(size, grid.shape.x)
    scene.add(gridHelper)

    //camera
    camera.position.z = 150
    camera.position.y = 75

    // light
    pointLight = new BasicPointLight({ position: new THREE.Vector3(150, 100, 50) })
    pointLight.addTo(scene)

    plane = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x666666 }),
    )
    plane.receiveShadow = true
    plane.castShadow = false
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -0.5
    scene.add(plane)

    game.init()
    console.log(game)
    renderer.setSize(width, height)
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
    game.animate()
    requestAnimationFrame(animate)
  }

  setup(canvas)
  animate()

  window.addEventListener('resize', onWindowResize, false)

  function onWindowResize() {
    width = window.innerWidth
    height = window.innerHeight
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

export default AssemblingCubes
