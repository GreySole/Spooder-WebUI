import React, { Key, useEffect, useState } from 'react';
import {
  Stack,
  Columns,
  useTheme,
  Box,
  TypeFace,
  EditCustomSpooderInputPair,
  EditCustomSpooderForm,
  SpooderPetPair,
} from '@greysole/spooder-component-library';
import { v4 as uuidv4 } from 'uuid';
import EditCustomSpooderFormProvider from './EditCustomSpooderFormProvider';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function EditCustomSpooder() {
  const { customSpooder, setCustomSpooder } = useTheme();
  useEffect(() => {
    // Ensure each part has a stable ID for drag and drop
    const updatedParts = customSpooder.map((part: any) =>
      part.id ? part : { ...part, id: uuidv4() },
    );

    if (updatedParts.some((part: any, index: number) => part !== customSpooder[index])) {
      setCustomSpooder(updatedParts);
    }
  }, [customSpooder, setCustomSpooder]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedParts = Array.from(customSpooder);
    const [movedParts] = reorderedParts.splice(result.source.index, 1);

    reorderedParts.splice(result.destination.index, 0, movedParts);

    setCustomSpooder(reorderedParts);
  };

  return (
    <EditCustomSpooderFormProvider data={customSpooder}>
      <TypeFace fontSize='large' fontWeight='bold'>
        Custom Spooder
      </TypeFace>
      <EditCustomSpooderForm>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='custom-spooder-parts' direction='horizontal'>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <Box
                  flexFlow={`row${snapshot.isDraggingOver ? '' : ' wrap'}`}
                  spacing='small'
                  overflow='scroll'
                >
                  {customSpooder.map(
                    (
                      part: { partString: string; partColor: string; id?: string },
                      index: number,
                    ) => (
                      <Draggable
                        key={part.id || `spooder-part-drag-${index}`}
                        draggableId={part.id || `spooder-part-drag-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <EditCustomSpooderInputPair
                              customSpooder={customSpooder}
                              setCustomSpooder={setCustomSpooder}
                              index={index}
                              dragHandle={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ),
                  )}
                </Box>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </EditCustomSpooderForm>
    </EditCustomSpooderFormProvider>
  );
}
