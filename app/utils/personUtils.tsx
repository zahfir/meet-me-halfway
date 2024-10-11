/**
 *
 * @param oldWeight
 * @param dx
 * @returns The new weight given how much the mouse has moved in the x-axis
 */
export const computeNewWeight = (oldWeight: number, dx: number) => {
  const sensitivity = 5;
  return Math.max(1, Math.min(100, oldWeight + dx / sensitivity));
};
