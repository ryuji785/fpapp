import { ReferenceLine, ReferenceLineProps } from 'recharts';
import { AxisId } from './axis-ids';

type Props = Omit<ReferenceLineProps, 'yAxisId'> & { yAxisId: AxisId };
export const RefLine = (p: Props) => <ReferenceLine {...p} />;
