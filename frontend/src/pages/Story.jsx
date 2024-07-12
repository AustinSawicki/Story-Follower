import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Settings from '../components/Settings';
import CharacterCard from '../components/CharacterCard';
import Chapter from '../components/Chapter';
import Popup from '../components/Popup';
import { StoryGet,StoryUpdate, StoryDelete, CharactersGet, CharacterCreate, ChaptersGet, ChapterCreate, DescriptionGet ,DescriptionUpdate } from '../components/utils/index';

function Story() {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [description, setDescription] = useState("");
    const [characters, setCharacters] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        StoryGet({id, setStory});
        CharactersGet({id, setCharacters})
        ChaptersGet({id, setChapters})
        DescriptionGet({id, setDescription})
    }, [id]);

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        StoryGet({id, setStory});
        console.log(story)
        DescriptionGet({id, setDescription})
    };

    if (!story) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <div className="flex justify-between items-center relative max-h-256" 
                     style={{ backgroundImage: `url('${story.banner ? story.banner : `${import.meta.env.VITE_API_URL}static/placeholder/placehold-banner.jpg`}')`, backgroundSize: 'cover', backgroundPosition: 'center'  }}>
                        <div className="w-1/2 flex justify-center items-center p-4">
                            {story.image ? (
                                <img src={story.image} alt="Story" className="max-h-96 w-full h-full p-4 object-contain rounded-xl" />
                            ) : (
                                <img src={`${import.meta.env.VITE_API_URL}static/placeholder/placehold-image.JPG`} alt="Story" className="max-h-96 w-full h-full p-4 object-contain rounded-xl" />
                            )}
                            <Settings openPopup={openPopup} size={"3xl"}/>
                        </div>
                        <div className="text-center w-1/2 p-4 rounded">
                            <h1 className="text-5xl font-bold mb-4 text-white description-border">{story.title}</h1>
                            <textarea
                                className="w-full h-80 p-2 text-xl rounded resize-none bg-transparent description-border text-white"
                                value={story.description}
                                disabled
                                placeholder="Enter description..."
                            />
                        </div>
                    </div>
                    <div className="mb-4 p-4 rounded-xl bg-beige">
                        <div className="flex items-center mb-4">
                            <h2 className="text-3xl font-bold">Characters</h2>
                            <button
                                onClick={(e) => CharacterCreate({e, id, setCharacters})}
                                className="ml-5 bg-oak text-white p-2 rounded hover:bg-oak-dark transition-colors duration-300"
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
                    
                    <div className="border p-4">
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <h2 className="text-3xl font-bold">Chapters</h2>
                                <button
                                    onClick={(e) => {ChapterCreate({e, id, setChapters})}}
                                    className="ml-5 bg-oak text-white p-2 rounded hover:bg-oak-dark transition-colors duration-300"
                                >
                                    Create Chapter
                                </button>
                            </div>
                            <Link to={`/stories/${id}/tree`} className="bg-oak hover:bg-oak-dark text-white p-2 rounded">
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
                            { "Description": story.description}
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