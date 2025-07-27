import React from 'react';
import { useSortable, AnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface DragHandleProps {
  ref: (node: HTMLElement | null) => void;
  onPointerDown: React.PointerEventHandler;
  onKeyDown: React.KeyboardEventHandler;
}
interface SortableItemProps {
  id: string;
  index: number;
  children: React.ReactElement<{ index: number; dragHandleProps: DragHandleProps }>;
  handle?: boolean;
  animateLayoutChanges?: AnimateLayoutChanges;
}

export default function SortableItem({
  id,
  index,
  children,
  handle = false,
  animateLayoutChanges,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } =
    useSortable({
      id,
      animateLayoutChanges,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const childWithProps = React.cloneElement(children, {
    index,
    ...(handle && {
      dragHandleProps: {
        ref: setActivatorNodeRef,
        ...((listeners as any) ?? {}),
      },
    }),
  });

  // Default behavior - entire item is draggable
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {childWithProps}
    </div>
  );
}
