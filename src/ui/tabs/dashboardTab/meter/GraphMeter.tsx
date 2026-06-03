import { formatBytes, useTheme } from '@greysole/spooder-component-library';
import React from 'react';

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
  const { themeVariables } = useTheme();

  const points = data.map((value, index) => {
    let x = (index / (data.length - 1)) * paddedWidth;
    let y = paddedHeight - (value / maxDataValue) * paddedHeight;

    isNaN(x) && (x = 0);
    isNaN(y) && (y = 0);

    return [x, y];
  });

  const buffer = 1;

  // Adds 4 points to the graph to complete the shape and allow a filled background
  const completedPoints = `${-buffer},${paddedHeight} ${-buffer},${points[0][1]} ${points.map(([x, y]) => `${x},${y}`).join(' ')} ${points[points.length - 1][0] + buffer},${points[points.length - 1][1]} ${paddedWidth + buffer},${paddedHeight}`;

  return (
    <svg width={width} height={height} style={{ border: '1px solid var(--theme-text-color)' }}>
      <rect
        width={paddedWidth}
        height={paddedHeight}
        fill={themeVariables.isDarkTheme ? '#000c' : '#fffe'}
      />
      <text
        x={paddedWidth + 5}
        y={height * 0.08}
        fill='var(--theme-text-color)'
        fontSize={height * 0.08}
      >
        {`${formatBytes(maxDataValue, 0)}/s`}
      </text>
      <text
        x={paddedWidth + 5}
        y={paddedHeight / 2}
        fill='var(--theme-text-color)'
        fontSize={height * 0.08}
      >
        {`${formatBytes(maxDataValue / 2, 0)}/s`}
      </text>
      <text
        x={paddedWidth + 5}
        y={paddedHeight - 5}
        fill='var(--theme-text-color)'
        fontSize={height * 0.08}
      >
        {`0/s`}
      </text>
      <polyline
        fill={color + '33'}
        stroke={color}
        strokeWidth='2'
        points={completedPoints}
        style={{ clipPath: `inset(0 2px 0 0)` }}
      />
    </svg>
  );
}
