import { ReferenceLine, ReferenceLineProps } from 'recharts';
import type { AxisId } from './axis-ids';

type Props = Omit<ReferenceLineProps, 'yAxisId'> & { yAxisId?: AxisId };
export const RefLine = ({ yAxisId, ...rest }: Props) => (
  <ReferenceLine {...(yAxisId ? { yAxisId } : {})} {...rest} />
);
