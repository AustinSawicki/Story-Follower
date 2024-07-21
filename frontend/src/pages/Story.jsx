import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Settings from '../components/Settings';
import Chapter from '../components/Chapter';
import SortableChapter from '../components/SortableChapter';
import Popup from '../components/Popup';
import { UserGet, StoryGet, StoryUpdate, StoryDelete, CharactersGet, ChapterCreate, CharacterUpdate, ChaptersGet, ChapterUpdate } from '../components/utils/index';
import { PLACEHOLDER_URL } from '../constants';
import SyncLoader from 'react-spinners/SyncLoader';
import { useTheme } from '../components/ThemeProvider';
import StoryCharacterDisplay from '../components/StoryCharacterDisplay';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

function Story() {
    const { id } = useParams();
    const { updateThemeExternal, theme } = useTheme();
    const [story, setStory] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [user, setUser] = useState({});
    const [activeId, setActiveId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        UserGet({ setUser });
    }, []);

    useEffect(() => {
        StoryGet({ id, setStory });
    }, [id]);

    useEffect(() => {
        if (story) {
            updateThemeExternal();
            CharactersGet({ id, setCharacters });
            ChaptersGet({ id, setChapters });
        }
    }, [story]);

    useEffect(() => {
        if(user?.themes && story) {
            if(!user.themes.find(theme => theme.name === story.theme)) {
                story.theme = user.theme;
                StoryUpdate({ ids: [id], updateData: { theme: user.theme } });
            }
        }
    }, [story]);

    useEffect(() => {
        if (showPopup) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [showPopup]);

    useEffect(() => {
        const updateCharacters = async () => {
            if (characters.length > 0 && story) {
                let charactersToUpdate = [];
                characters.map(character => {
                    if (character.affiliation && !story.affiliations.find(affiliation => affiliation.id === character.affiliation)) {
                        charactersToUpdate.push(character.id);
                    }
                });
    
                if (charactersToUpdate.length > 0) {
                    await Promise.all(charactersToUpdate.map(character => {
                        return CharacterUpdate({ ids: [id, character], updateData: { affiliation: null } });
                    }));
                    CharactersGet({ id, setCharacters });
                }
            }
        };
    
        updateCharacters();

    }, [characters, story]);

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = (deleted = false) => {
        setShowPopup(false);
        if (deleted) {
            navigate('/');
        } else {
            StoryGet({ id, setStory });
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);
    
        if (active.id !== over.id) {
            setChapters((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
    
                const newItems = arrayMove(items, oldIndex, newIndex);
    
                // Swap x and y values of the chapters
                const oldChapter = newItems[oldIndex];
                const newChapter = newItems[newIndex];
    
                if (oldChapter && newChapter) {
                    const tempX = oldChapter.x;
                    const tempY = oldChapter.y;
    
                    oldChapter.x = newChapter.x;
                    oldChapter.y = newChapter.y;
    
                    newChapter.x = tempX;
                    newChapter.y = tempY;
                }
    
                // Update the position locally
                newItems.forEach((chapter, index) => {
                    chapter.position = index;
                });
    
                // Update the position on the server if it has changed
                newItems.forEach(async (chapter, index) => {
                    await ChapterUpdate({ ids: [id, chapter.id], updateData: { position: index, x: chapter.x, y: chapter.y } });
                });
    
                return newItems;
            });
        }
    };

    if (!story) {
        return (
            <div className="m-5 flex items-center justify-center">
                <SyncLoader color={theme.button_dark}/>
            </div>
        );
    }

    return (
        <div>
            <div>
                <div className="bg-theme-dark flex flex-col md:flex-row justify-between items-center relative max-h-100"
                    style={{ backgroundImage: `url('${story.banner ? story.banner : `${PLACEHOLDER_URL}placehold-banner.jpg`}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                        {story.image ? (
                            <img src={story.image} alt="Story" className="max-h-96 w-full h-full p-4 object-contain rounded-xl" />
                        ) : (
                            <img src={`${PLACEHOLDER_URL}placehold-image.jpg`} alt="Story" className="max-h-96 w-full h-full p-4 object-contain rounded-xl" />
                        )}
                        <Settings openPopup={openPopup} size={"3xl"} />
                    </div>
                    <div className="text-center w-full md:w-1/2 p-4 rounded flex flex-col justify-center items-center ">
                        <h1 className="text-2xl text-5xl truncate font-semibold w-fit description-border rounded-xl mb-2 p-1 ">{story.title}</h1>
                        <textarea
                            className="w-full font-bold h-40 md:h-80 p-2 text-sm md:text-xl rounded resize-none bg-theme hover:ring-button-dark"
                            value={story.description || ""}
                            disabled
                            placeholder=""
                        />
                    </div>
                </div>

                <StoryCharacterDisplay
                    story={story}
                    characters={characters}
                    setCharacters={setCharacters}
                    id={id}
                    setStory={setStory}
                />

                <div className="p-4">
                    <div className="flex justify-between">
                        <h2 className="text-2xl md:text-3xl font-bold">Chapters</h2>
                        <Link to={`/stories/${id}/tree`} className="bg-button hover:bg-button-dark text-white p-2 rounded text-center ml-3">
                            View Tree
                        </Link>
                    </div>
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={chapters.map(chapter => chapter.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {chapters.map(chapter => (
                                <SortableChapter
                                    key={chapter.id}
                                    storyId={id}
                                    chapter={chapter}
                                    onUpdate={() => { StoryGet({ id, setStory }) }}
                                    activeId={activeId}
                                />
                            ))}
                        </SortableContext>
                        <DragOverlay>
                            {activeId ? (
                                <Chapter chapter={chapters.find(chapter => chapter.id === activeId)} />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                    <div className="flex justify-center mt-5">
                        <button
                            onClick={(e) => { ChapterCreate({ e, id, setChapters, data: { title: "Title", description: "" } }) }}
                            className="bg-button text-white p-2 rounded hover:bg-button-dark transition-colors duration-300"
                        >
                            Create Chapter
                        </button>
                    </div>
                </div>
                {showPopup && (
                    <Popup
                        ids={[id]}
                        name="Story"
                        config={[
                            { "Title": story.title },
                            { "Description": story.description },
                            { "Theme": story.theme }
                        ]}
                        onClose={() => {
                            closePopup(false);
                            UserGet({ setUser });
                        }}
                        onUpdate={StoryUpdate}
                        onDelete={() => { StoryDelete({ id: id, onClose: () => closePopup(true) }) }}
                        imageChange={true}
                        bannerChange={true}
                        safeDelete={true}
                        user={user}
                    />
                )}
            </div>
        </div>
    );
}


export default Story;
