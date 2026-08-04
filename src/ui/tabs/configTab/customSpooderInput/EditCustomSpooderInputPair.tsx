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
  useTheme,
  StyleSize,
  useToast,
} from '@spooder/webui-component-library';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import type { DragHandleProps } from '../../../common/dragAndDrop/SortableItem';
import { faGrip, faPlus, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import DragHandleButton from '../../../common/dragAndDrop/DragHandleButton';

interface EditCustomSpooderInputPairProps {
  customSpooder: SpooderPetPair[];
  setCustomSpooder: (spooder: SpooderPetPair[]) => void;
  index: number;
  disabled?: boolean;
  dragHandleProps?: DragHandleProps;
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
  const { customSpooder, index, setCustomSpooder, dragHandleProps } = props;
  const themeBgColor = document.documentElement.style.getPropertyValue('--color-background-far');
  const { themeVariables, isMobileDevice } = useTheme();
  const { setNodeRef, setActivatorNodeRef } = useSortable({ id: `sortable-${index}` });
  const { showSuccess, showInfo } = useToast();

  // Safety check to ensure the current item exists
  if (!customSpooder || index < 0 || index >= customSpooder.length || !customSpooder[index]) {
    return null; // or return a placeholder component
  }

  const currentItem = customSpooder[index];

  const outOfContrastRange = () => {
    return calculateContrastWarning(currentItem.partColor);
  };

  const AddPartRight = () => {
    if (!customSpooder || index < 0 || index >= customSpooder.length) return;
    let newPart: SpooderPetPair = {
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

  const copyColorToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color).then(() => {
        showInfo(`Color <span>${color}</span> copied to clipboard!`);
      });
    } catch (err) {
      console.error('Failed to copy color: ', err);
    }
  };

  return (
    <Stack spacing='small' width='130px'>
      <Box flexFlow='row' justifyContent='space-between' width='100%' spacing='none'>
        <Button
          onClick={AddPartLeft}
          icon={faPlus}
          iconSize='smedium'
          className='minimal'
          tooltipText='Add a part to the left'
        ></Button>
        <Button
          onClick={handleDeletePart}
          icon={faTrash}
          iconSize='smedium'
          iconColor='var(--color-delete-border)'
          className='minimal'
          tooltipText='Delete this part'
        ></Button>
        {dragHandleProps && (
          <DragHandleButton dragHandleProps={dragHandleProps} tooltipText='Drag to reorder' />
        )}
        <Button
          onClick={AddPartRight}
          icon={faPlus}
          iconSize='smedium'
          className='minimal'
          tooltipText='Add a part to the right'
        ></Button>
      </Box>
      <Stack align='center' spacing='small'>
        <TextInput
          width='100%'
          color={customSpooder[index].partColor}
          style={{
            textAlign: 'center',
            backgroundColor: 'var(--color-background-far)',
            fontWeight: themeVariables.fontWeight,
            fontVariationSettings: `'MONO' ${themeVariables.isMonospacedFont ? 1 : 0}`,
            fontSize: isMobileDevice ? StyleSize.large : StyleSize.xlarge,
            lineHeight: 1,
            paddingTop: '0.25rem',
            paddingBottom: '0.25rem',
          }}
          onInput={(value) => {
            if (!customSpooder || index < 0 || index >= customSpooder.length) return;
            let newCustomSpooder = structuredClone(customSpooder);
            newCustomSpooder[index].partString = value;
            setCustomSpooder(newCustomSpooder);
          }}
          value={currentItem.partString}
        />
        <Box width='100%' alignItems='center' justifyContent='space-between' flexFlow='row'>
          <ColorInput
            onChange={(value) => {
              if (!customSpooder || index < 0 || index >= customSpooder.length) return;
              let newCustomSpooder = structuredClone(customSpooder);
              newCustomSpooder[index].partColor = value;
              setCustomSpooder(newCustomSpooder);
            }}
            value={currentItem.partColor}
            showWarning={!!outOfContrastRange()}
            className='smaller'
          />
          <Button
            className='minimal'
            onClick={() => copyColorToClipboard(currentItem.partColor)}
            label={currentItem.partColor}
            tooltipText='Copy color to clipboard'
          />
        </Box>
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
