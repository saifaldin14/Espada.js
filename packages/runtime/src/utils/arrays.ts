/**
 * Filters NULL nodes an array
 * Used for conditional rendering where we don't want to render empty nodes
 * NULL nodes shouldn't be added to the DOM
 * @param arr the child nodes to evaluate
 * @returns a filtered array without NULL values
 */
export function withoutNulls(arr) {
  return arr.filter((item) => item != null);
}
