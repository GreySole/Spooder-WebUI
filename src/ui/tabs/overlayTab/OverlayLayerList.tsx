import {
  Border,
  Box,
  BoolSwitch,
  Button,
  Columns,
  Stack,
  TypeFace,
} from '@spooder/webui-component-library';
import { faGripVertical, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { OverlayContainerEntry } from '../../../app/api/overlayContainerSlice';

function LayerRow({
  entry,
  locked,
  onToggle,
  onToggleLock,
}: {
  entry: OverlayContainerEntry;
  locked: boolean;
  onToggle: (enabled: boolean) => void;
  onToggleLock: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.pluginName,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Border>
        <Box
          padding="small"
          width="100%"
          flexFlow="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Columns spacing="small">
            <span
              {...attributes}
              {...listeners}
              style={{ cursor: 'grab', touchAction: 'none', display: 'flex', alignItems: 'center' }}
            >
              <FontAwesomeIcon icon={faGripVertical} />
            </span>
            <TypeFace fontSize="medium">{entry.displayName}</TypeFace>
          </Columns>
          <Columns spacing="small">
            <Button
              icon={locked ? faLock : faLockOpen}
              onClick={onToggleLock}
              tooltipText={
                locked
                  ? 'Locked - drag on the canvas passes through to overlays behind it'
                  : 'Lock so it stops catching drags on the canvas'
              }
            />
            <BoolSwitch
              value={entry.enabled}
              onChange={onToggle}
              tooltipText={entry.enabled ? 'Shown in the overlay container' : 'Hidden'}
            />
          </Columns>
        </Box>
      </Border>
    </div>
  );
}

// Drag-to-reorder list that doubles as the z-order: the top row renders in front on the canvas
// above, and enabling/disabling an overlay lives here too rather than as a separate control.
export default function OverlayLayerList({
  order,
  locked,
  onReorder,
  onToggle,
  onToggleLock,
}: {
  order: OverlayContainerEntry[];
  locked: Set<string>;
  onReorder: (order: OverlayContainerEntry[]) => void;
  onToggle: (pluginName: string, enabled: boolean) => void;
  onToggleLock: (pluginName: string) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = order.findIndex((e) => e.pluginName === active.id);
    const newIndex = order.findIndex((e) => e.pluginName === over.id);
    onReorder(arrayMove(order, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={order.map((e) => e.pluginName)}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing="small" width="100%">
          {order.map((entry) => (
            <LayerRow
              key={entry.pluginName}
              entry={entry}
              locked={locked.has(entry.pluginName)}
              onToggle={(enabled) => onToggle(entry.pluginName, enabled)}
              onToggleLock={() => onToggleLock(entry.pluginName)}
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
}
