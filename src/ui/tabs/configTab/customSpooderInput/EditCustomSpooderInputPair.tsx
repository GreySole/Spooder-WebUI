import {
  Stack,
  FormTextInput,
  FormColorInput,
  TextInput,
  TypeFace,
  Columns,
  calculateContrastRatio,
} from '@greysole/spooder-component-library';
import React, { useEffect } from 'react';
import { get } from 'react-hook-form';

interface EditCustomSpooderInputPairProps {
  label: string;
  partName: string;
  customSpooder: Record<string, any>;
}

const calculateContrastWarning = (color: string) => {
  // This function can be used to calculate contrast and return a warning if needed
  const themeBgColor = document.documentElement.style.getPropertyValue('--color-background-far');
  const contrastThreshold = 2.25;

  const chosenColor = color;

  const contrastRatio = calculateContrastRatio(chosenColor, themeBgColor);

  return contrastRatio < contrastThreshold;
};

export default function EditCustomSpooderInputPair(props: EditCustomSpooderInputPairProps) {
  const { partName, label, customSpooder } = props;
  const themeBgColor = document.documentElement.style.getPropertyValue('--color-background-far');
  return (
    <Stack spacing='small' width='160px'>
      <TypeFace textAlign='center'>{label}</TypeFace>
      <Stack align='center' spacing='small'>
        <FormTextInput
          width='100%'
          formKey={`parts.${partName}`}
          color={customSpooder.colors[partName]}
          style={{ textAlign: 'center', backgroundColor: 'var(--color-background-far)' }}
        />
        <Columns width='100%' spacing='small'>
          <FormColorInput
            formKey={`colors.${partName}`}
            showWarning={calculateContrastWarning(customSpooder.colors[partName])}
          />
          <TypeFace width='106px' textAlign='center' fontWeight={'bold'}>
            {get(customSpooder, `colors.${partName}`, '')}
          </TypeFace>
        </Columns>
          <TypeFace
            width='100%'
            textAlign='center'
            fontSize='smedium'
            fontWeight='bold'
            color={calculateContrastRatio(themeBgColor, '#F00') < 2 ? '#500' : '#F00'}
            lineHeight={1.1}
          >
            {calculateContrastWarning(customSpooder.colors[partName]) ? (
              <>This may be too close to your theme color</>
            ) : (
              <>&nbsp;<br></br>&nbsp;</>
            )}
          </TypeFace>
      </Stack>
    </Stack>
  );
}
