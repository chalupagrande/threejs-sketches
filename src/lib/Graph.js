export class Node {
  /**
   * @param {*} data
   * @param {*} parent
   */
  constructor(data, parent) {
    this.data = data
    this.parent = parent
    this.gCost = null
    this.hCost = null
  }

  fCost() {
    return this.gCost + this.hCost
  }
}

/**
 * @param {node} startNode
 * @param {node} targetNode
 * @param {func} checkNodeEquality - takes 2 nodes, and returns bool if they are equals
 * @param {func} getNeighbors - takes node, returns neighbors
 * @param {func} isTraversable - takes currentNode and neighbor and returns bool if neighbor node is traversable
 * @param {func} calcDistanceBetween2Nodes - takes 2 nodes and returns the distance between them
 */
export function aStar(
  startNode,
  targetNode,
  checkNodeEquality,
  getNeighbors,
  isTraversable,
  calcDistanceBetween2Nodes,
) {
  const open = []
  const closed = []
  open.push(startNode)
  const path = []
  while (open.length) {
    // finds the lowest fCost
    const current = open.reduce((a, b) => {
      if (!a) return b
      if (a.fCost() === b.fCost()) {
        // if it is equal, return the one closest to target.
        return Math.min(a.hCost, b.hCost) === a.hCost ? a : b
      }
      return Math.min(a.fCost(), b.fCost()) === a.fCost() ? a : b
    })
    // removes that node from open
    const currentIndex = open.findIndex(n => checkNodeEquality(n, current))
    open.splice(currentIndex, currentIndex + 1)
    // add current to closed
    closed.push(current)

    // if the target node is found!!
    if (checkNodeEquality(current, targetNode)) {
      // retrace the path back to the start node
      let cur = current
      while (!checkNodeEquality(cur, startNode)) {
        path.push(cur)
        cur = cur.parent
      }
      path.reverse()
      return path
    }

    const neighbors = getNeighbors(current)
    neighbors.forEach(neighbor => {
      const canTraverse = isTraversable(current, neighbor)
      if (closed.find(n => checkNodeEquality(n, neighbor)) || !canTraverse) {
        return
      }
      // specific to ASSEMBLING CUBES
      neighbor.setData({ ...neighbor.data, possibleFloors: canTraverse })
      const newMovementDistanceToNeighbor = calcDistanceBetween2Nodes(current, neighbor)
      if (open.indexOf(neighbor) === -1 || newMovementDistanceToNeighbor < neighbor.gCost) {
        neighbor.gCost = newMovementDistanceToNeighbor
        neighbor.hCost = calcDistanceBetween2Nodes(neighbor, targetNode)
        neighbor.parent = current
        // if it is not in the open list add it.
        if (open.indexOf(neighbor) === -1) {
          open.push(neighbor)
        }
      }
    })
  }
  return path
}

/**
 * g-cost = distance from start
 * h-cost = distance from end node
 * f-cost = g-cost + h-cost
 *
 *
 * A STAR PSEUDO CODE
 * const openList = [] // the set of nodes to be evaluated
 * const closedList = [] // the set of nodes already evaluated
 * add the start node to the OPENList
 *
 * loop
 *  current = node in OPEN with the lowest f-cost
 *  remove current from OPEN
 *  add current to CLOSED
 *
 *  if current is target node // path found
 *    return
 *  forEach neighbor of the current node
 *    if neighbor is not traversable or neighbor is in CLOSED
 *      skip to the next neighbor
 *
 *    if new path to neighbor is shorter OR neighbord is not in OPEN
 *      set f-cost of neighbor
 *      set parent of neighbor to current
 *      if neighbor is not in OPEN
 *        add neighbor to OPEN
 */
