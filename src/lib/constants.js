import { Vector3 } from 'three'

export const LEFT = new Vector3(-1, 0, 0)
export const RIGHT = new Vector3(1, 0, 0)
export const DOWN = new Vector3(0, -1, 0)
export const UP = new Vector3(0, 1, 0)
export const BACK = new Vector3(0, 0, -1)
export const FORWARD = new Vector3(0, 0, 1)

export const DIRECTIONS = {
  LEFT,
  RIGHT,
  DOWN,
  UP,
  BACK,
  FORWARD,
}

export const STAY = new Vector3(0, 0, 0)
export const ZERO = new Vector3(0, 0, 0)

export const XAXIS = new Vector3(1, 0, 0)
export const ZAXIS = new Vector3(0, 0, 1)
export const YAXIS = new Vector3(0, 1, 0)
