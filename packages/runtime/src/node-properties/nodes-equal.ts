import { DOM_TYPES } from "../utils/consts";
import { VNode } from "../types/common";
import { vElementNode } from "../types/elementTypes";
/**
 * Checks whether two virtual nodes are equal, following a specific logic:
 *
 * - If the two nodes are of different types, they are not equal.
 * - Element nodes are equal if their tag is equal.
 * - All other nodes are equal.
 *
 * This logic is necessary for the `patchDOM()` function to work properly.
 *
 * @param {VNode} nodeOne the first virtual node
 * @param {VNode} nodeTwo the second virtual node
 * @returns {boolean} whether the two nodes are equal
 */
export function areNodesEqual(nodeOne: VNode, nodeTwo: VNode) {
  if (nodeOne.type !== nodeTwo.type) {
    return false;
  }

  if (nodeOne.type === DOM_TYPES.ELEMENT) {
    const { tag: tagOne } = nodeOne as vElementNode;
    const { tag: tagTwo } = nodeTwo as vElementNode;

    return tagOne === tagTwo;
  }

  return true;
}
