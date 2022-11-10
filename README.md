# Threejs Sketches

some exploration into three js

## Assembling Cubes Notes.

- Speed must be a divisor of 90

### Pseudo Code

1. place all cubes randomly on the ground (do not set grid position)
2. define a function called refindPath


    - refindTargetAndPath should do the following
      - find closest target
      - find path to target
      - place event.listeners.on(Vector, refindTargetAndPath)
        - if a cube sets/unsets a vector in its path, && there is a listener
          - update call all listeners for that Vector
      - "occupy" the space on the grid it is at, as well as its next step
