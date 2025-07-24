import React, { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableProps {
    id: string;
    children: ReactNode;
    className?: string;
}

export default function Draggable({ id, children, className }: DraggableProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    });

    const style = transform
        ? {
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : 1,
            }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={className}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    );
};