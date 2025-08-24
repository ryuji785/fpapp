import { ReferenceLine, ReferenceLineProps } from 'recharts';
import { AXIS, type AxisId } from './axis-ids';

type Props = Omit<ReferenceLineProps, 'yAxisId'> & { yAxisId?: AxisId };
export const RefLine = ({ yAxisId = AXIS.ASSETS, ...rest }: Props) => (
  <ReferenceLine yAxisId={yAxisId} {...rest} />
);
