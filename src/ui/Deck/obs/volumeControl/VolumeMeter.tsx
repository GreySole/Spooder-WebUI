import React, { useCallback, useEffect, useRef, useState } from 'react';

interface VolumeMeterProps {
  level?: number;
}

export default function VolumeMeter(props: VolumeMeterProps) {
  const { level = 0 } = props;

  let scaleDim = window.innerWidth < 600 ? 'Y' : 'Y';

  let levelStyle = {
    level: {
      clipPath: `polygon(${scaleDim == 'X' ? level * 100 : 100}% ${scaleDim == 'Y' ? 100 - level * 100 : 0}%, 0% ${scaleDim == 'Y' ? 100 - level * 100 : 0}%, 0% 100%, ${scaleDim == 'X' ? level * 100 : 100}% 100%)`,
    },
  };

  return (
    <div className='deck-volume-meter-bar'>
      <div className='deck-volume-meter-bar-peak'></div>
      <div className='deck-volume-meter-bar-level' style={levelStyle.level}></div>
      <div className='deck-volume-meter-bar-power'></div>
    </div>
  );
}
