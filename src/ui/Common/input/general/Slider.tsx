import React, { useState, useRef, useEffect, useCallback, CSSProperties } from 'react';

interface SliderProps {
  value: number;
  orientation: 'horizontal' | 'vertical';
  gradient: string;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value, orientation, gradient, onChange }) => {
  const [grabbed, setGrabbed] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        console.log('FIRE');
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!sliderRef.current || !knobRef.current || !grabbed) return;
      event.preventDefault();

      const sliderRect = sliderRef.current.getBoundingClientRect();
      let newValue = 0;

      if (orientation === 'horizontal') {
        const offsetX = event.clientX - sliderRect.left;
        newValue = Math.max(0, Math.min(1, offsetX / sliderRect.width));
      } else {
        const offsetY = event.clientY - sliderRect.top;
        newValue = Math.max(0, Math.min(1, offsetY / sliderRect.height));
      }

      onChange(newValue);
    },
    [grabbed, orientation, onChange],
  );

  const throttledPointerMove = useCallback(throttle(handlePointerMove, 500), [handlePointerMove]);

  const handlePointerUp = useCallback((event: PointerEvent) => {
    event.preventDefault();
    console.log('RELEASED');
    handlePointerMove(event);
    setGrabbed(false);
    document.removeEventListener('pointerup', handlePointerUp);
  }, []);

  const handlePointerDown = useCallback(
    (event: any) => {
      event.preventDefault();
      console.log('GRABBED');
      document.addEventListener('pointerup', handlePointerUp);
      setGrabbed(true);
      handlePointerMove(event);
    },
    [handlePointerMove],
  );

  useEffect(() => {
    document.addEventListener('pointermove', handlePointerMove);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handlePointerMove]);

  const getKnobColor = () => {
    const gradientColors = gradient.split(',').map((color) => color.trim());

    const interpolateColor = (color1: string, color2: string, factor: number) => {
      if (!color1 || !color2) return '';
      const hex = (color: string) => {
        const match = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if (!match) {
          throw new Error(`Invalid color format: ${color}`);
        }
        return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
      };

      const [r1, g1, b1] = hex(color1);
      const [r2, g2, b2] = hex(color2);

      const r = Math.round(r1 + factor * (r2 - r1));
      const g = Math.round(g1 + factor * (g2 - g1));
      const b = Math.round(b1 + factor * (b2 - b1));

      return `rgb(${r}, ${g}, ${b})`;
    };

    const segment = 1 / (gradientColors.length - 1);
    const index = Math.floor(value / segment);
    const factor = (value - index * segment) / segment;

    return interpolateColor(gradientColors[index], gradientColors[index + 1], factor);
  };

  const sliderStyle =
    orientation === 'horizontal'
      ? {
          background: `linear-gradient(to right, ${gradient})`,
          position: 'relative' as CSSProperties['position'],
          borderRadius: '10px',
          width: '100%',
          height: '20px',
          cursor: 'pointer',
        }
      : {
          background: `linear-gradient(to bottom, ${gradient})`,
          position: 'relative' as CSSProperties['position'],
          borderRadius: '10px',
          width: '20px',
          height: '100%',
          cursor: 'pointer',
        };

  const knobStyle = {
    position: 'absolute' as CSSProperties['position'],
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'solid white 2px',
    transform: 'translate(-50%, -25%)',
    [orientation === 'horizontal' ? 'left' : 'top']: `${value * 100}%`,
  };

  return (
    <div
      ref={sliderRef}
      className={`slider ${orientation}`}
      onPointerDown={handlePointerDown}
      style={{ userSelect: 'none', ...sliderStyle }}
    >
      <div
        ref={knobRef}
        className='knob'
        style={{
          backgroundColor: getKnobColor(),
          ...knobStyle,
        }}
      />
    </div>
  );
};

export default Slider;
