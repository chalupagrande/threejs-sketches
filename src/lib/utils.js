/**
 *
 * @param {int} min
 * @param {int} max
 * @param {bool} floor - to Math.floor
 * @returns float
 */
export function random(min = 0, max = 1, floor = false) {
  const r = Math.random() * (max - min) + min
  return floor ? Math.floor(r) : r
}

export function chooseRandom(array) {
  return array[Math.floor(random(0, array.length))]
}

/**
 *
 * @param {THREE.Object3D} obj - object to rotate
 * @param {THREE.Vector3} point - point to rotate about
 * @param {THREE.Vector3} axis - normalized axis of rotation
 * @param {float} theta - amount to rotate in radians
 * @param {boolean} pointIsWorld - whether or not the point is a world coordinate
 */
export function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position) // compensate for world coordinate
  }

  obj.position.sub(point) // remove the offset
  obj.position.applyAxisAngle(axis, theta) // rotate the POSITION
  obj.position.add(point) // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position) // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta) // rotate the OBJECT
}

export function radToDeg(rad) {
  return (180 / Math.PI) * rad
}

export function degToRad(deg) {
  return (deg / 180) * Math.PI
}

// Function to download data to a file
export function saveFile(data, filename, type) {
  var file = new Blob([data], { type: type })
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename)
  else {
    // Others
    var a = document.createElement('a'),
      url = URL.createObjectURL(file)
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function () {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
}

export function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

export function isPerpendicular(vector1, vector2) {
  return vector1.dot(vector2) === 0
}
