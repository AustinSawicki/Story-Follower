// SortableCharacterCard.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CharacterCard from './CharacterCard';

const SortableCharacterCard = ({ character, story, onUpdate, isSortingEnabled }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: character.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <CharacterCard character={character} story={story} onUpdate={onUpdate} dragListeners={listeners} isSortingEnabled={isSortingEnabled} />
        </div>
        
    );
};

export default SortableCharacterCard;
