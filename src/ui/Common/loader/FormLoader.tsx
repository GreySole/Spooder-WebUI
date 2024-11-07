import React from 'react';
import useTheme from '../../../app/hooks/useTheme';

interface FormLoaderProps {
  numRows?: number;
  width?: string;
}

export default function FormLoader({ numRows = 3, width = '50%' }: FormLoaderProps) {
  const getRandomInitialValue = () => Math.random() * 2;
  const { themeColors } = useTheme();

  return (
    <svg width='100%' height='300' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <linearGradient id='gradient'>
          <stop offset='0%' stopColor={themeColors.baseColor} />
          <stop offset='100%' stopColor={themeColors.colorAnalogousCCW} />
        </linearGradient>
      </defs>
      {Array.from({ length: numRows }).map((_, i) => (
        <>
          <rect
            x='10'
            y={50 * i + 10}
            rx='10'
            ry='10'
            height='40'
            fill='url(#gradient)'
            stroke='black'
            strokeWidth='2'
          >
            <animate
              attributeName='width'
              values={`${width};0;${width}`}
              keyTimes='0;0.5;1'
              dur='2s'
              begin={`-${getRandomInitialValue()}s`}
              repeatCount='indefinite'
            />
          </rect>
          <rect
            x='10'
            y={50 * i + 10}
            rx='10'
            ry='10'
            width={`${width}`}
            height='40'
            fill='none'
            stroke={themeColors.buttonFontColor}
            strokeWidth='2'
          ></rect>
        </>
      ))}
    </svg>
  );
}
