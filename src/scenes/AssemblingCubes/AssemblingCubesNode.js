import { Node } from '../../lib/Graph'
/**
 * This Node is more specific to the path finding in our
 * game
 */
export class AssemblingNode extends Node {
  constructor(data, parent) {
    super({ position: data }, parent)
    // this.data = Vector3
    //Inherited
    // this.data = data
    // this.parent = parent
    // this.gCost = null
    // this.hCost = null
  }

  setData(data) {
    this.data = data
  }

  static checkNodeEquality(aNode, bNode) {
    const aPos = aNode.data.position.clone()
    const bPos = bNode.data.position.clone()
    return aPos.equals(bPos)
  }
}
