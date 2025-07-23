import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function Droppable({
  id,
  children,
  className = '',
  disabled = false,
}: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled,
  });
  return (
    <div ref={setNodeRef} className={`droppable ${isOver ? 'droppable--over' : ''} ${className}`}>
      {children}
    </div>
  );
}
