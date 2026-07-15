import React, { Key, useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  useTheme,
  Grid,
  TypeFace,
  BoolSwitch,
  Box,
  Stack,
  Columns,
  Slider,
  TextInput,
} from '@greysole/spooder-component-library';
import EditCustomSpooderInputPair from './EditCustomSpooderInputPair';
import SortableItem from '../../../common/dragAndDrop/SortableItem';
import { set } from 'react-hook-form';

export default function EditCustomSpooder() {
  const {
    themeVariables,
    customSpooder,
    setCustomSpooder,
    setThemeMonospacedFont,
    setThemeFontWeight,
    setThemeLetterSpacing,
  } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [spooderParts, setSpooderParts] = useState(
    Array.from({ length: customSpooder.length }, (_, i) => `part-${i + 1}`),
  );

  useEffect(() => {
    setSpooderParts(customSpooder.map((_, i) => `part-${i + 1}`));
  }, [customSpooder]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const newCustomSpooder = [...customSpooder];
      const newSpooderParts = [...spooderParts];
      const oldIndex = spooderParts.indexOf(active.id);
      const newIndex = spooderParts.indexOf(over.id);

      // Reorder both arrays
      newCustomSpooder.splice(newIndex, 0, newCustomSpooder.splice(oldIndex, 1)[0]);
      newSpooderParts.splice(newIndex, 0, newSpooderParts.splice(oldIndex, 1)[0]);

      setCustomSpooder(newCustomSpooder);
      setSpooderParts(newSpooderParts);
    }
  };

  const parseFontWeightInput = (value: string) => {
    let parsedValue = parseFloat(value);
    parsedValue < 100 && (parsedValue = 100);
    parsedValue > 900 && (parsedValue = 900);
    return isNaN(parsedValue) ? 100 : parsedValue;
  };

  const parseLetterSpacingInput = (value: string) => {
    let parsedValue = parseFloat(value);
    parsedValue < -1 && (parsedValue = -1);
    parsedValue > 1 && (parsedValue = 1);
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  return (
    <Stack spacing='medium' width='100%'>
      <TypeFace fontSize='large'>Custom Spooder</TypeFace>
      <BoolSwitch
        label='Use Monospaced Font'
        value={themeVariables.isMonospacedFont}
        onChange={() => {
          setThemeMonospacedFont(!themeVariables.isMonospacedFont);
        }}
      />
      <Columns spacing='xlarge' width='100%'>
        <Box width='50%' padding='xsmall'>
          <Slider
            orientation={'horizontal'}
            value={themeVariables.fontWeight}
            step={1 / 800}
            minMax={[100, 900]}
            onChange={(value: number) => {
              setThemeFontWeight(value);
            }}
          />
        </Box>
        <Box width='50%'>
          <TextInput
            label='Font Weight'
            value={`${Math.round(themeVariables.fontWeight)}`}
            onChange={(value) => setThemeFontWeight(parseFontWeightInput(value))}
            selectOnFocus={true}
          />
        </Box>
      </Columns>
      <Columns spacing='xlarge' width='100%'>
        <Box width='50%' padding='xsmall'>
          <Slider
            orientation={'horizontal'}
            value={themeVariables.letterSpacing}
            step={1 / 100}
            minMax={[-1, 1]}
            onChange={(value: number) => {
              setThemeLetterSpacing(value);
            }}
          />
        </Box>
        <Box width='50%'>
          <TextInput
            label='Letter Spacing'
            value={`${(themeVariables.letterSpacing / 2).toFixed(3)}`}
            onChange={(value) => setThemeLetterSpacing(parseLetterSpacingInput(value))}
            selectOnFocus={true}
            unit='em'
          />
        </Box>
      </Columns>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Grid columns={'repeat(auto-fill, 130px)'} width='100%' spacing='small' overflow='visible'>
          <SortableContext items={spooderParts} strategy={rectSortingStrategy}>
            {spooderParts.map((id, i) => (
              <SortableItem
                key={id}
                id={id}
                index={i}
                animateLayoutChanges={defaultAnimateLayoutChanges}
                handle
              >
                <EditCustomSpooderInputPair
                  customSpooder={customSpooder}
                  setCustomSpooder={setCustomSpooder}
                  index={i}
                />
              </SortableItem>
            ))}
          </SortableContext>
        </Grid>
      </DndContext>
    </Stack>
  );
}
