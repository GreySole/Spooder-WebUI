import React from 'react';
import Expandable from '../../../common/layout/Expandable';
import useTheme from '../../../../app/hooks/useTheme';

export default function ThemeColor() {
  const { themeColors, setThemeColor } = useTheme();
  console.log('THEME COLORS', themeColors);
  return (
    <Expandable label='Theme Color'>
      <label>
        Theme Color:
        <input
          type='color'
          value={themeColors.baseColor}
          onChange={(e) => setThemeColor(e.target.value)}
          title='Change Theme Color'
          onClick={(e) => e.stopPropagation()}
        />
        {/* {(luma(this.state.themeColor) < .01) && <FontAwesomeIcon icon={faWarning} size="1x" />} */}
      </label>
    </Expandable>
  );
}
