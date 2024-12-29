import React from 'react';
import { formatBytes } from '../../../util/DataUtil';
import useTheme from '../../../../app/hooks/useTheme';

interface GraphMeterProps {
  data: number[];
  color?: string;
  width: number;
  height: number;
}

export default function GraphMeter({ data, color = 'blue', width, height }: GraphMeterProps) {
  const paddedWidth = width * 0.75;
  const paddedHeight = height * 1.0;
  const maxDataValue = Math.max(...data);
  const minDataValue = Math.min(...data);
  const dataRange = maxDataValue - minDataValue;
  const { themeVariables } = useTheme();

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * paddedWidth;
      const y = paddedHeight - ((value - minDataValue) / dataRange) * paddedHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ border: '1px solid white' }}>
      <rect
        width={paddedWidth}
        height={paddedHeight}
        fill={themeVariables.isDarkTheme ? 'black' : 'white'}
      />
      <text x={paddedWidth + 5} y={height * 0.1} fill='white' fontSize={height * 0.1}>
        {formatBytes(maxDataValue, 0)}
      </text>
      <text x={paddedWidth + 5} y={paddedHeight / 2} fill='white' fontSize={height * 0.1}>
        {formatBytes(maxDataValue / 2, 0)}
      </text>
      <text x={paddedWidth + 5} y={paddedHeight - 5} fill='white' fontSize={height * 0.1}>
        {formatBytes(minDataValue, 0)}
      </text>
      <polyline fill='none' stroke={color} strokeWidth='2' points={points} />
    </svg>
  );
}
