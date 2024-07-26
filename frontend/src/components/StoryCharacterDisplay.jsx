// StoryCharacterDisplay.jsx
import React, { useState } from 'react';
import CharacterCard from './CharacterCard';
import { StoryGet, StoryUpdate, CharactersGet, CharacterCreate, CharacterUpdate } from './utils';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import SortableCharacterCard from './SortableCharacterCard';

const StoryCharacterDisplay = ({ story, characters, setCharacters, id, setStory }) => {
    const [isSortingEnabled, setIsSortingEnabled] = useState(true);
    const [activeId, setActiveId] = useState(null);

    React.useEffect(() => {
        if (story) {
            setIsSortingEnabled(story.sorting_enabled);
        }
    }, [story]);

    const getSortedAffiliations = () => {
        if (!story || !story.affiliations) return [];

        const affiliationCounts = story.affiliations.map(affiliation => ({
            ...affiliation,
            count: characters.filter(character => character.affiliation === affiliation.id).length
        }));

        const noAffiliationGroup = {
            id: null,
            name: 'No Affiliation',
            count: characters.filter(character => !character.affiliation).length,
        };

        return [...affiliationCounts, noAffiliationGroup].sort((a, b) => b.count - a.count);
    };

    const handleSortToggle = () => {
        setIsSortingEnabled(!isSortingEnabled);
        story.sorting_enabled = !isSortingEnabled;
        StoryUpdate({ ids: [id], updateData: { sorting_enabled: !isSortingEnabled } });
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setCharacters((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update the position on the server
                newItems.forEach(async (character, index) => {
                    await CharacterUpdate({ ids: [id, character.id], updateData: { position: index } });
                });

                return newItems;
            });
        }
        setActiveId(null);
    };

    const sortedAffiliations = getSortedAffiliations();

    return (
        <div className="mb-4 p-4 rounded-xl bg-theme">
            <div className="flex items-center mb-4">
                <h2 className="text-2xl md:text-3xl font-bold">Characters</h2>
                <button
                    onClick={(e) => CharacterCreate({ e, id, setCharacters })}
                    className="ml-5 bg-button text-white p-2 rounded hover:bg-button-dark transition-colors duration-300"
                >
                    Create Character
                </button>
                <label className="ml-5">
                    <input
                        type="checkbox"
                        checked={isSortingEnabled}
                        onChange={handleSortToggle}
                        className="mr-2 accent-button"
                    />
                    Sort by Affiliation
                </label>
            </div>
            <div className="overflow-x-auto whitespace-nowrap mb-4">
                {isSortingEnabled ? (
                    sortedAffiliations.map(affiliation => (
                        <div key={affiliation.id} className="inline-block mb-4 ml-4">
                            {affiliation.count > 0 && <h3 className="text-xl md:text-2xl font-semibold">{affiliation.name}</h3>}
                            <div className="inline-flex space-x-4">
                                {characters
                                    .filter(character => character.affiliation === affiliation.id || (!character.affiliation && affiliation.id === null))
                                    .map(character => (
                                        <CharacterCard key={character.id} story={story} character={character} isSortingEnabled={isSortingEnabled}
                                            onUpdate={() => {
                                                StoryGet({ id, setStory });
                                            }} />
                                    ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={characters.map(character => character.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="inline-flex space-x-4">
                                {characters.map(character => (
                                    <SortableCharacterCard
                                        key={character.id}
                                        story={story}
                                        character={character}
                                        onUpdate={() => {
                                            StoryGet({ id, setStory });
                                        }}
                                        isSortingEnabled={isSortingEnabled}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                        <DragOverlay>
                            {activeId ? (
                                <CharacterCard story = {story} character={characters.find(character => character.id === activeId)} />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>
        </div>
    );
};

export default StoryCharacterDisplay;
