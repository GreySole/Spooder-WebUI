import React from 'react';
import { formatBytes, useTheme } from '@spooder/webui-component-library';

interface CircleMeterProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  showMax?: boolean;
  formatByteData?: boolean;
}

export default function CircleMeter(props: CircleMeterProps) {
  const { label, value, min, max, showMax = false, formatByteData = false, unit = '' } = props;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(Math.max(value, min), max);
  const fillPercentage = ((normalizedValue - min) / (max - min)) * 100;
  const strokeDashoffset = circumference - (fillPercentage / 100) * circumference;
  const { themeColors } = useTheme();

  return (
    <div style={{ textAlign: 'center', transition: 'all' }}>
      <svg width='200' height='200'>
        <text x='100' y='50' fill='var(--theme-text-color)' textAnchor='middle' dy='.3em' fontSize='20'>
          {label}
        </text>
        <circle
          cx='100'
          cy='100'
          r={radius}
          stroke={themeColors.darkColorAnalogousCCW}
          strokeWidth='10'
          fill='none'
        />
        <circle
          cx='100'
          cy='100'
          r={radius}
          stroke={themeColors.colorAnalogousCW}
          strokeWidth='10'
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform='rotate(-90 100 100)'
          style={{ transition: 'stroke-dashoffset 1s' }}
        />
        {showMax ? (
          <>
            <text x='100' y='86' fill='var(--theme-text-color)' textAnchor='middle' dy='.3em' fontSize='22'>
              {formatByteData ? formatBytes(value) : `${value} ${unit}`}
            </text>
            <line x1='50' y1='100' x2='150' y2='100' stroke='var(--theme-text-color)' strokeWidth='2' />
            <text x='100' y='117' fill='var(--theme-text-color)' textAnchor='middle' dy='.3em' fontSize='22' fontWeight='800'>
              {formatByteData ? formatBytes(max) : `${max} ${unit}`}
            </text>
          </>
        ) : (
          <text x='100' y='102' fill='var(--theme-text-color)' textAnchor='middle' dy='.3em' fontSize='40' fontWeight='700'>
            {formatByteData ? formatBytes(value) : `${value}${unit}`}
          </text>
        )}
      </svg>
    </div>
  );
}
