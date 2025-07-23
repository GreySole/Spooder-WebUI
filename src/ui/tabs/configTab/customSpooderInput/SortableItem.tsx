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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id,
    animateLayoutChanges: props.animateLayoutChanges,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.handle && <span className='handle'>::</span>}
      {props.children}
    </div>
  );
}
