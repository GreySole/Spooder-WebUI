import React, { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableProps {
  id: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dragListeners?: any;
  dragActivatorRef?: (element: HTMLElement | null) => void;
}

export default function Draggable({
  id,
  children,
  className,
  style,
  dragListeners,
  dragActivatorRef,
}: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const draggableStyle = transform
    ? {
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }
    : { cursor: 'grab' };

  // If we have drag listeners from a sortable parent, use those instead
  const finalListeners = dragListeners || listeners;
  const finalRef = dragActivatorRef || setNodeRef;

  return (
    <div
      ref={finalRef}
      style={{ ...style, ...draggableStyle }}
      className={className}
      {...finalListeners}
      {...(dragListeners ? {} : attributes)}
    >
      {children}
    </div>
  );
}
