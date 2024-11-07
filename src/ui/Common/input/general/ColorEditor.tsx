import React from 'react';
import tinycolor from 'tinycolor2';

interface ColorEditorProps {
  color: string;
  alpha: number;
  onColorChanged: (color: string) => void;
}

export default function ColorEditor(props: ColorEditorProps) {
  const { color, alpha, onColorChanged } = props;
  function processColorChange(e: any) {
    const newColor = tinycolor(color) ?? new tinycolor();
    onColorChanged(newColor.setAlpha(alpha).toRgbString());
  }

  function processAlphaChange(e: any) {
    const newColor = tinycolor(color) ?? new tinycolor();
    onColorChanged(newColor.setAlpha(alpha).toRgbString());
  }

  return (
    <div className='theme-color-edit'>
      <input name='color' type='color' value={color} onChange={processColorChange} />
      <input
        name='alpha'
        type='range'
        min='0'
        max='100'
        value={alpha * 100}
        onChange={processAlphaChange}
      />
    </div>
  );
}
