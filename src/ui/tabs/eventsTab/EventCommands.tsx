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
} from '@spooder/webui-component-library';
import EventCommandTimeline from './eventCommand/EventCommandTimeline';
import EventCommand from './EventCommand';
import {
  faGrip,
  faGripHorizontal,
  faGripVertical,
  faList,
  faTimeline,
} from '@fortawesome/free-solid-svg-icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableItem from '../../common/dragAndDrop/SortableItem';
import Draggable from '../../common/dragAndDrop/Draggable';

interface EventCommandsProps {
  eventName: string;
}

// Sortable item component for @dnd-kit
function SortableEventCommand({
  id,
  eventName,
  command,
  index,
  isMobileDevice,
}: {
  id: string;
  eventName: string;
  command: any;
  index: number;
  isMobileDevice: boolean;
}) {
  return (
    <SortableItem index={index} id={id} handle={true}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
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
            <Draggable
              id={id}
              style={{
                width: isMobileDevice ? '100%' : undefined,
                height: isMobileDevice ? undefined : '100%',
              }}
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
                <Icon icon={isMobileDevice ? faGripHorizontal : faGripVertical} iconSize='large' />
              </Box>
            </Draggable>
            <EventCommand eventName={eventName} commandIndex={index} commandType={command.type} />
          </Box>
        </Border>
      </div>
    </SortableItem>
  );
}

export default function EventCommands(props: EventCommandsProps) {
  const { eventName } = props;
  const { watch, setValue } = useFormContext();
  const eventCommands = watch(`${EVENT_KEY}.${eventName}.commands`, []);
  const [showTimeline, setShowTimeline] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const { isMobileDevice } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: any) => {
    setDraggedItemId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItemId(null);

    if (active.id !== over?.id) {
      const oldIndex = eventCommands.findIndex(
        (_: any, index: number) => `${eventName}-${index}` === active.id,
      );
      const newIndex = eventCommands.findIndex(
        (_: any, index: number) => `${eventName}-${index}` === over?.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedCommands = arrayMove(eventCommands, oldIndex, newIndex);
        setValue(`${EVENT_KEY}.${eventName}.commands`, reorderedCommands, { shouldDirty: true });
      }
    }
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={eventCommands.map((_: any, index: number) => `${eventName}-${index}`)}
            strategy={verticalListSortingStrategy}
          >
            <div
              style={{
                display: 'flex',
                flexFlow: 'column',
                width: isMobileDevice ? '100%' : undefined,
                height: isMobileDevice ? undefined : '100%',
                gap: '8px',
              }}
            >
              {eventCommands.map((command: any, index: number) => {
                const id = `${eventName}-${index}`;
                return (
                  <SortableEventCommand
                    key={id}
                    id={id}
                    eventName={eventName}
                    command={command}
                    index={index}
                    isMobileDevice={isMobileDevice}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <EventAddCommand eventName={eventName} />
    </Stack>
  );
}
