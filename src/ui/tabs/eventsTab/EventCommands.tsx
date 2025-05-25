import React, { useEffect, useState } from 'react';
import EventAddCommand from './eventCommand/EventAddCommand';
import { EVENT_KEY } from './FormKeys';
import { useFormContext } from 'react-hook-form';
import {
  Border,
  Box,
  Button,
  Icon,
  Stack,
  TypeFace,
  useTheme,
} from '@greysole/spooder-component-library';
import EventCommandTimeline from './eventCommand/EventCommandTimeline';
import EventCommand from './EventCommand';
import {
  faGrip,
  faGripHorizontal,
  faGripVertical,
  faList,
  faTimeline,
} from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface EventCommandsProps {
  eventName: string;
}

export default function EventCommands(props: EventCommandsProps) {
  const { eventName } = props;
  const { watch, setValue } = useFormContext();
  const eventCommands = watch(`${EVENT_KEY}.${eventName}.commands`, []);
  const [showTimeline, setShowTimeline] = useState(false);
  const { isMobileDevice } = useTheme();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedCommands = Array.from(eventCommands);
    const [movedCommand] = reorderedCommands.splice(result.source.index, 1);
    reorderedCommands.splice(result.destination.index, 0, movedCommand);

    setValue(`${EVENT_KEY}.${eventName}.commands`, reorderedCommands);
  };

  return (
    <Stack height='100%' spacing='medium'>
      <TypeFace>Commands:</TypeFace>
      <Box>
        <Button
          label={showTimeline ? 'Commands' : 'Timeline'}
          icon={showTimeline ? faList : faTimeline}
          iconSize='large'
          onClick={() => setShowTimeline(!showTimeline)}
        />
      </Box>
      {showTimeline ? (
        <EventCommandTimeline eventName={eventName} />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='eventCommands'>
            {(provided) => (
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'column',
                  width: isMobileDevice ? '100%' : undefined,
                  height: isMobileDevice ? undefined : '100%',
                }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {eventCommands.map((command: any, index: number) => (
                  <Draggable
                    key={`${eventName}-${index}`}
                    draggableId={`${eventName}-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style, // Preserve Draggable's styles
                        }}
                      >
                        {/* Wrapper div to apply custom styles */}
                        <div
                          style={{
                            display: 'flex',
                            width: '100%',
                            height: '100%', // Ensure full height
                          }}
                        >
                          <Border>
                            <Box
                              width='100%'
                              height='inherit'
                              flexFlow={isMobileDevice ? 'column' : 'row'}
                              alignItems='center'
                              padding='small'
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  width: isMobileDevice ? '100%' : undefined,
                                  height: '100%', // Ensure handle covers full height
                                }}
                                {...provided.dragHandleProps}
                              >
                                <Box
                                  width={isMobileDevice ? '100%' : undefined}
                                  height={isMobileDevice ? undefined : '100%'}
                                  padding='medium'
                                  marginBottom={isMobileDevice ? 'small' : 'none'}
                                  marginRight={isMobileDevice ? 'none' : 'small'}
                                  justifyContent={isMobileDevice ? 'center' : undefined}
                                  alignItems={isMobileDevice ? undefined : 'center'}
                                  backgroundColor='var(--color-background-far)'
                                >
                                  <Icon
                                    icon={isMobileDevice ? faGripHorizontal : faGripVertical}
                                    iconSize='large'
                                  />
                                </Box>
                              </div>
                              <EventCommand
                                eventName={eventName}
                                commandIndex={index}
                                commandType={command.type}
                              />
                            </Box>
                          </Border>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <EventAddCommand eventName={eventName} />
    </Stack>
  );
}
