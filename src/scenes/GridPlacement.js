import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import BasicPointLight from '../components/Basics/BasicPointLight'
import Grid from '../components/Basics/Grid'

/**
 * This is a scene that allows you to build an object, reload that object
 * press spacebar to demonstrate the save and reload function. Open the terminal.
 * @param {*} canvas
 */
function GridPlacement(canvas) {
  // globals
  let opts = {
    w: window.innerWidth,
    h: window.innerHeight,
    voxelSize: 20,
    gridSize: 10,
  }

  let scene,
    camera,
    renderer,
    controls,
    pointLight,
    plane,
    grid,
    raycaster,
    pointer,
    rollOverMesh,
    objects = [],
    isShiftDown = false,
    cubeGeo,
    cubeMat
  // stats
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
    camera.position.z = 200
    camera.position.y = 200
    // grid
    const { voxelSize, gridSize } = opts
    const gridSizeVector = new THREE.Vector3(gridSize, gridSize, gridSize)
    grid = new Grid(gridSizeVector, voxelSize)

    // // gridhelper
    const gridHelper = new THREE.GridHelper(gridSize * voxelSize, gridSize)
    scene.add(gridHelper)

    //raycaster
    raycaster = new THREE.Raycaster()
    pointer = new THREE.Vector2()

    // light
    pointLight = new BasicPointLight({ position: new THREE.Vector3(10, 20, 10) })
    pointLight.addTo(scene)

    // OBJECTS
    // rollovermesh
    const rollOverGeo = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize)
    const rollOverMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      transparent: true,
    })
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
    scene.add(rollOverMesh)

    cubeGeo = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize)
    cubeMat = new THREE.MeshStandardMaterial({ color: 0xff0000 })

    // plane
    const planeSize = opts.voxelSize * opts.gridSize
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    planeGeo.rotateX(-Math.PI / 2)
    plane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({ color: 0x666666, opacity: 0.3, transparent: true }),
    )
    plane.receiveShadow = true
    plane.castShadow = false
    console.log(plane.position)
    objects.push(plane)
    scene.add(plane)

    renderer.setSize(opts.w, opts.h)
  }

  //    _   _  _ ___ __  __   _ _____ ___
  //   /_\ | \| |_ _|  \/  | /_\_   _| __|
  //  / _ \| .` || || |\/| |/ _ \| | | _|
  // /_/ \_\_|\_|___|_|  |_/_/ \_\_| |___|
  //
  function animate() {
    controls.update()
    stats.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  setup(canvas)
  animate()

  window.addEventListener('resize', onWindowResize, false)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('keydown', onDocumentKeyDown)
  window.addEventListener('keyup', onDocumentKeyUp)

  //  _    ___ ___ _____ ___ _  _ ___ ___  ___
  // | |  |_ _/ __|_   _| __| \| | __| _ \/ __|
  // | |__ | |\__ \ | | | _|| .` | _||   /\__ \
  // |____|___|___/ |_| |___|_|\_|___|_|_\|___/

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

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(objects, false)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      // i dont know why this is necessary. sometimes the intersection point is negative
      if (intersect.point.y < 0) intersect.point.y = Math.abs(intersect.point.y)
      if (rollOverMesh.position.y < 0) rollOverMesh.position.y = Math.abs(rollOverMesh.position.y)
      rollOverMesh.position.copy(intersect.point).add(intersect.face.normal)
      rollOverMesh.position
        .divideScalar(opts.voxelSize)
        .floor()
        .multiplyScalar(opts.voxelSize)
        .addScalar(opts.voxelSize / 2)
    }
  }

  function onPointerDown(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObjects(objects, false)

    if (intersects.length > 0) {
      const intersect = intersects[0]

      // delete cube

      if (isShiftDown) {
        if (intersect.object !== plane) {
          scene.remove(intersect.object)

          objects.splice(objects.indexOf(intersect.object), 1)
        }

        // create cube
      } else {
        const voxel = new THREE.Mesh(cubeGeo, cubeMat)
        const newPos = rollOverMesh.position.clone()
        voxel.position.set(...newPos)
        scene.add(voxel)
        objects.push(voxel)
        grid.setByPosition(voxel.position, 1)
        console.log(grid.getByPosition(voxel.position), grid)
      }
    }
  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 16:
        isShiftDown = true
        break
      case 32:
        saveAndReload()
        break
      default:
        break
    }
  }

  function onDocumentKeyUp(event) {
    switch (event.keyCode) {
      case 16:
        isShiftDown = false
        break
      default:
        break
    }
  }

  function saveAndReload() {
    // remove all objects
    grid.save()
    const filtered = objects.filter(e => {
      if (e !== plane) {
        scene.remove(e)
        return false
      }
      return true
    })
    objects = filtered
  }
}

export default GridPlacement
