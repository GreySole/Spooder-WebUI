import React from 'react';
import { useTheme } from '@spooder/webui-component-library';

interface ProgressBarProps {
  progress: number;
  total: number;
  height?: string;
}

export default function ProgressBar({ progress, total, height = '10px' }: ProgressBarProps) {
  const { themeColors } = useTheme();
  const percent = total > 0 ? Math.min(100, Math.max(0, (progress / total) * 100)) : 0;

  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius: height,
        backgroundColor: themeColors.backgroundColorNear,
        border: `1px solid ${themeColors.buttonBorderColor}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          height: '100%',
          backgroundColor: themeColors.baseColor,
          transition: 'width 150ms ease-out',
        }}
      />
    </div>
  );
}
