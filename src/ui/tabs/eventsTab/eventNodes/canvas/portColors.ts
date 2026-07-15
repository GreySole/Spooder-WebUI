import { NodePortDataType } from '../../../../Types';

export const EXEC_COLOR = '#ecf0f1';

export const PORT_COLORS: { [key in NodePortDataType]: string } = {
  string: '#f39c12',
  number: '#3498db',
  boolean: '#e74c3c',
  any: '#95a5a6',
};

export function colorForPort(dataType?: NodePortDataType): string {
  return dataType ? PORT_COLORS[dataType] : PORT_COLORS.any;
}
