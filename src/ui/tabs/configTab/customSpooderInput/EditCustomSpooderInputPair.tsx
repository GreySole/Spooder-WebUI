import React from 'react';
import {
  Stack,
  Columns,
  Box,
  TypeFace,
  SpooderPetPair,
  calculateContrastRatio,
  Button,
  TextInput,
  ColorInput,
} from '@greysole/spooder-component-library';
import { faPlus, faTrash, faX } from '@fortawesome/free-solid-svg-icons';

interface EditCustomSpooderInputPairProps {
  customSpooder: SpooderPetPair[];
  setCustomSpooder: (spooder: SpooderPetPair[]) => void;
  index: number;
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
  const { customSpooder, index, setCustomSpooder } = props;
  const themeBgColor = document.documentElement.style.getPropertyValue('--color-background-far');

  // Safety check to ensure the current item exists
  if (!customSpooder || index < 0 || index >= customSpooder.length || !customSpooder[index]) {
    return null; // or return a placeholder component
  }

  const currentItem = customSpooder[index];

  const outOfContrastRange = () => {
    return calculateContrastWarning(currentItem.partColor);
  };

  const AddPartRight = () => {
    // Logic to add a part to the right
    if (!customSpooder || index < 0 || index >= customSpooder.length) return;

    const newPart: SpooderPetPair = {
      partString: '',
      partColor: '#FFFFFF',
    };
    let newCustomSpooder = [...customSpooder];
    newCustomSpooder.splice(index + 1, 0, newPart);
    setCustomSpooder(newCustomSpooder);
  };

  const AddPartLeft = () => {
    // Logic to add a part to the left
    if (!customSpooder || index < 0 || index > customSpooder.length) return;

    const newPart: SpooderPetPair = {
      partString: '',
      partColor: '#FFFFFF',
    };
    let newCustomSpooder = [...customSpooder];
    newCustomSpooder.splice(index, 0, newPart);
    setCustomSpooder(newCustomSpooder);
  };

  const handleDeletePart = () => {
    // Logic to delete the part
    if (!customSpooder || index < 0 || index >= customSpooder.length || customSpooder.length <= 1)
      return;

    let newCustomSpooder = [...customSpooder];
    newCustomSpooder.splice(index, 1);
    setCustomSpooder(newCustomSpooder);
  };

  return (
    <Stack spacing='small' width='160px'>
      <Box flexFlow='row' justifyContent='space-between' width='100%' spacing='small'>
        <Button onClick={AddPartLeft} icon={faPlus} iconSize='smedium' className='minimal'></Button>
        <Button
          onClick={handleDeletePart}
          icon={faTrash}
          iconSize='smedium'
          iconColor='var(--color-delete-border)'
          className='minimal'
        ></Button>
        <Button
          onClick={AddPartRight}
          icon={faPlus}
          iconSize='smedium'
          className='minimal'
        ></Button>
      </Box>
      <Stack align='center' spacing='small'>
        <TextInput
          width='100%'
          color={customSpooder[index].partColor}
          style={{
            textAlign: 'center',
            backgroundColor: 'var(--color-background-far)',
          }}
          onInput={(value) => {
            if (!customSpooder || index < 0 || index >= customSpooder.length) return;
            const newCustomSpooder = [...customSpooder];
            newCustomSpooder[index].partString = value;
            setCustomSpooder(newCustomSpooder);
          }}
          value={currentItem.partString}
        />
        <Columns width='100%' spacing='small'>
          <ColorInput
            onChange={(value) => {
              if (!customSpooder || index < 0 || index >= customSpooder.length) return;
              const newCustomSpooder = [...customSpooder];
              newCustomSpooder[index].partColor = value;
              setCustomSpooder(newCustomSpooder);
            }}
            value={currentItem.partColor}
            showWarning={outOfContrastRange()}
          />
          <TypeFace width='106px' textAlign='center' fontWeight={'bold'}>
            {currentItem.partColor}
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
          {outOfContrastRange() ? (
            <>This may be too close to your theme color</>
          ) : (
            <>
              &nbsp;<br></br>&nbsp;
            </>
          )}
        </TypeFace>
      </Stack>
    </Stack>
  );
}
