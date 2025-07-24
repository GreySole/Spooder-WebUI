import React from 'react';
import { useSortable, AnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  index: number;
  children?: React.ReactNode;
  handle?: boolean;
  animateLayoutChanges?: AnimateLayoutChanges;
}

export default function SortableItem(props: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } =
    useSortable({
      id: props.id,
      animateLayoutChanges: props.animateLayoutChanges,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // If handle is true, we'll pass the drag listeners and activator ref to children
  if (props.handle) {
    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              dragListeners: listeners,
              dragActivatorRef: setActivatorNodeRef,
            } as any);
          }
          return child;
        })}
      </div>
    );
  }

  // Default behavior - entire item is draggable
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}
