import React, { useEffect } from 'react';
import { get } from 'react-hook-form';
import {
  Stack,
  Columns,
  Box,
  TypeFace,
  FormTextInput,
  FormColorInput,
  SpooderPet,
  SpooderPetPair,
  calculateContrastRatio,
  Button,
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

  const outOfContrastRange = () => {
    return calculateContrastWarning(customSpooder[index].partColor);
  };

  const AddPartRight = () => {
    // Logic to acid a part to the rignt
    const newPart: SpooderPetPair = {
      partString: '',
      partColor: '',
    };
    let newCustomSpooder = [...customSpooder];
    newCustomSpooder.splice(index + 1, 0, newPart);
    setCustomSpooder(newCustomSpooder);
  };

  const AddPartLeft = () => {
    // Logic to acid a part to the left
    const newPart: SpooderPetPair = {
      partString: '',
      partColor: '',
    };
    let newCustomSpooder = [...customSpooder];
    newCustomSpooder.splice(index, 0, newPart);
    setCustomSpooder(newCustomSpooder);
  };

  const handleDeletePart = () => {
    // Logic to delete the part
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
        <FormTextInput
          width='100%'
          formKey={`parts.${index}.partString`}
          color={customSpooder[index].partColor}
          style={{ textAlign: 'center', backgroundColor: 'var(--color-background-far)' }}
        />
        <Columns width='100%' spacing='small'>
          <FormColorInput formKey={`parts.${index}.partColor`} showWarning={outOfContrastRange()} />
          <TypeFace width='106px' textAlign='center' fontWeight={'bold'}>
            {customSpooder[index].partColor}
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
