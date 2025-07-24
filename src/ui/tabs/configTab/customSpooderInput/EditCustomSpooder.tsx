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
} from '@dnd-kit/sortable';
import { useTheme, Grid } from '@greysole/spooder-component-library';
import EditCustomSpooderInputPair from './EditCustomSpooderInputPair';
import SortableItem from '../../../common/dragAndDrop/SortableItem';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function EditCustomSpooder() {
  const { customSpooder, setCustomSpooder } = useTheme();

  const [spooderParts, setSpooderParts] = useState(
    Array.from({ length: customSpooder.length }, (_, i) => `part-${i + 1}`),
  );
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

  useEffect(() => {
    console.log('New Spooder Parts:', spooderParts);
  }, [spooderParts]);

  useEffect(() => {
    setSpooderParts(customSpooder.map((_, i) => `part-${i + 1}`));
  }, [customSpooder]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      console.log('Old Custom Spooder:', customSpooder);

      const newCustomSpooder = [...customSpooder];
      const newSpooderParts = [...spooderParts];
      const oldIndex = spooderParts.indexOf(active.id);
      const newIndex = spooderParts.indexOf(over.id);

      // Reorder both arrays
      newCustomSpooder.splice(newIndex, 0, newCustomSpooder.splice(oldIndex, 1)[0]);
      newSpooderParts.splice(newIndex, 0, newSpooderParts.splice(oldIndex, 1)[0]);

      console.log('New Custom Spooder:', newCustomSpooder);

      setCustomSpooder(newCustomSpooder);
      setSpooderParts(newSpooderParts);
    }
  };

  console.log('EDIT CUSTOM SPOODER RENDER');

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Grid
          columns={'repeat(auto-fill, 160px)'}
          width='100vw'
          spacing='medium'
          overflow='auto'
          padding='small'
        >
          <SortableContext items={spooderParts} strategy={rectSortingStrategy}>
            {spooderParts.map((id, i) => (
              <SortableItem
                key={id}
                id={id}
                index={i}
                animateLayoutChanges={defaultAnimateLayoutChanges}
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
    </>
  );
}
