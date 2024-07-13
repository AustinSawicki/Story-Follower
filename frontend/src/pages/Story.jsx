import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Settings from '../components/Settings';
import CharacterCard from '../components/CharacterCard';
import Chapter from '../components/Chapter';
import Popup from '../components/Popup';
import { StoryGet,StoryUpdate, StoryDelete, CharactersGet, CharacterCreate, ChaptersGet, ChapterCreate } from '../components/utils/index';
import { PLACEHOLDER_URL } from '../constants';
import SyncLoader from 'react-spinners/SyncLoader';
import { useTheme } from '../components/ThemeProvider';


function Story() {
    const { id } = useParams();
    const { updateTheme } = useTheme();
    const [story, setStory] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        StoryGet({id, setStory});
        CharactersGet({id, setCharacters})
        ChaptersGet({id, setChapters})
    }, [id]);

    useEffect(() => {
        if(story){
            updateTheme(story.theme);
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

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        StoryGet({id, setStory});
    };

    if (!story) {
        return (
            <div className="mb-5 mt-5">
                <SyncLoader color="#cd7f4f"/>
            </div>)
    }

    return (
        <div>
            <div>
                <div className="flex justify-between items-center relative max-h-256" 
                     style={{ backgroundImage: `url('${story.banner ? story.banner : `${PLACEHOLDER_URL}placehold-banner.jpg`}')`, backgroundSize: 'cover', backgroundPosition: 'center'  }}>
                        <div className="w-1/2 flex justify-center items-center p-4">
                            {story.image ? (
                                <img src={story.image} alt="Story" className="max-h-96 w-full h-full p-4 object-contain rounded-xl" />
                            ) : (
                                <img src={`${PLACEHOLDER_URL}placehold-image.jpg`} alt="Story" className="max-h-96 w-full h-full p-4 object-contain rounded-xl" />
                            )}
                            <Settings openPopup={openPopup} size={"3xl"}/>
                        </div>
                        <div className="text-center w-1/2 p-4 rounded">
                            <h1 className="text-5xl font-bold mb-4 text-white description-border">{story.title}</h1>
                            <textarea
                                className="w-full h-80 p-2 text-xl rounded resize-none bg-transparent description-border text-white custom-scrollbar"
                                value={story.description || ""}
                                disabled
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className="mb-4 p-4 rounded-xl bg-theme">
                        <div className="flex items-center mb-4">
                            <h2 className="text-3xl font-bold">Characters</h2>
                            <button
                                onClick={(e) => CharacterCreate({e, id, setCharacters})}
                                className="ml-5 bg-button text-white p-2 rounded hover:bg-button-dark transition-colors duration-300"
                            >
                                Create Character
                            </button>
                        </div>
                        <div className="flex space-x-4 overflow-x-auto mb-4">
                            {characters.map((character) => (
                                <CharacterCard key={character.id} storyId={id} character={character}
                                 onUpdate={() => {CharactersGet({id, setCharacters})}} />
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <h2 className="text-3xl font-bold">Chapters</h2>
                                <button
                                    onClick={(e) => {ChapterCreate({e, id, setChapters, data: {title: "Title", description: ""}})}}
                                    className="ml-5 bg-button text-white p-2 rounded hover:bg-button-dark transition-colors duration-300"
                                >
                                    Create Chapter
                                </button>
                            </div>
                            <Link to={`/stories/${id}/tree`} className="bg-button hover:bg-button-dark text-white p-2 rounded">
                                    View Tree
                            </Link>
                        </div>
                        {chapters.map((chapter) => (
                                <Chapter key={chapter.id} storyId = {id} chapter={chapter} onUpdate={() => {ChaptersGet({id, setChapters})}} />
                            ))}

                    </div>
                    {showPopup && (
                    <Popup
                        ids={[id]}
                        name = "Story"
                        config={[
                            { "Title": story.title },
                            { "Description": story.description},
                            { "Theme": story.theme}
                        ]}
                        onClose={closePopup}
                        onUpdate={StoryUpdate}
                        onDelete={() => {StoryDelete({id: id, onClose: closePopup})}}
                        imageChange = {true}
                        bannerChange = {true}
                    />
                )}
            </div>
        </div>
    );
}

export default Story;