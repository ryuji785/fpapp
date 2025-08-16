export const AXIS = {
  ASSETS: 'assets',
  FLOW: 'flow',
} as const;
export type AxisId = typeof AXIS[keyof typeof AXIS];
