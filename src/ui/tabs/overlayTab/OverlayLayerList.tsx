import {
  Border,
  Box,
  Button,
  Columns,
  Stack,
  TypeFace,
} from '@spooder/webui-component-library';
import {
  faGripVertical,
  faLock,
  faLockOpen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
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
import { OverlayLayer, layerDisplayName } from '../../../app/api/overlayContainerSlice';
import { CascadeMenuButton, MenuCategory, MenuOption } from '../eventsTab/eventNodes/palette/CascadeMenu';

function LayerRow({
  entry,
  locked,
  selected,
  onSelect,
  onRemove,
  onToggleLock,
}: {
  entry: OverlayLayer;
  locked: boolean;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onToggleLock: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onSelect}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        outline: selected ? '2px solid #ffd24d' : undefined,
        borderRadius: 4,
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
            <TypeFace fontSize="medium">{layerDisplayName(entry)}</TypeFace>
          </Columns>
          <Columns spacing="small">
            <Button
              icon={locked ? faLock : faLockOpen}
              onClick={onToggleLock}
              tooltipText={
                locked
                  ? 'Locked - drag on the canvas passes through to layers behind it'
                  : 'Lock so it stops catching drags on the canvas'
              }
            />
            <Button icon={faTrash} onClick={onRemove} tooltipText="Remove this layer" />
          </Columns>
        </Box>
      </Border>
    </div>
  );
}

// Drag-to-reorder list that doubles as the z-order: the top row renders in front on the canvas
// above. Layers are added from the picker here and removed with the row's trash button.
export default function OverlayLayerList({
  order,
  locked,
  selectedId,
  addCategories,
  onAdd,
  onSelect,
  onReorder,
  onRemove,
  onToggleLock,
}: {
  order: OverlayLayer[];
  locked: Set<string>;
  selectedId: string | null;
  addCategories: MenuCategory<MenuOption>[];
  onAdd: (value: string) => void;
  onSelect: (id: string) => void;
  onReorder: (order: OverlayLayer[]) => void;
  onRemove: (id: string) => void;
  onToggleLock: (id: string) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = order.findIndex((e) => e.id === active.id);
    const newIndex = order.findIndex((e) => e.id === over.id);
    onReorder(arrayMove(order, oldIndex, newIndex));
  };

  return (
    <Stack spacing="small" width="100%">
      {/* Same cascade the node palette uses, so plugin overlays and widgets can be grouped. The
          canvas boxes and guides beside this list have z-indexes of their own, so the menu needs
          a stacking level above them or it opens underneath. */}
      <div style={{ position: 'relative', zIndex: 1100 }}>
        <CascadeMenuButton
          label="Add a layer"
          categories={addCategories}
          onSelect={(option) => onAdd(option.value)}
        />
      </div>
      {order.length === 0 ? (
        <TypeFace fontSize="medium">
          No layers yet. Add a plugin overlay or a widget to place it on the canvas.
        </TypeFace>
      ) : null}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <Stack spacing="small" width="100%">
            {order.map((entry) => (
              <LayerRow
                key={entry.id}
                entry={entry}
                locked={locked.has(entry.id)}
                selected={entry.id === selectedId}
                onSelect={() => onSelect(entry.id)}
                onRemove={() => onRemove(entry.id)}
                onToggleLock={() => onToggleLock(entry.id)}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
    </Stack>
  );
}
