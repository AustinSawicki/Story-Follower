import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Settings from '../components/Settings';
import CharacterCard from '../components/CharacterCard';
import Chapter from '../components/Chapter';
import Popup from '../components/Popup';
import { UserGet, StoryGet, StoryUpdate, StoryDelete, CharactersGet, CharacterCreate, ChaptersGet, ChapterCreate } from '../components/utils/index';
import { PLACEHOLDER_URL } from '../constants';
import SyncLoader from 'react-spinners/SyncLoader';
import { useTheme } from '../components/ThemeProvider';
import { useNavigate } from 'react-router-dom';

function Story() {
    const { id } = useParams();
    const { updateTheme, updateThemeExternal, theme } = useTheme();
    const [story, setStory] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isSortingEnabled, setIsSortingEnabled] = useState(true); // State variable to toggle sorting
    const [user, setUser] = useState({});
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
            setIsSortingEnabled(story.sorting_enabled);
        }
    }, [story]);

    // if story's theme is deleted in user settings
    useEffect(() => {
        if(user?.themes && story) {
            if(!user.themes.find(theme => theme.name === story.theme)) {
                story.theme = user.theme
                StoryUpdate({ids: [id], story})
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

    const getSortedAffiliations = () => {
        if (!story || !story.affiliations) return [];

        const affiliationCounts = story.affiliations.map(affiliation => ({
            ...affiliation,
            count: characters.filter(character => character.affiliation === affiliation.id).length
        }));

        // Special group for characters with no affiliation
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
        StoryUpdate({ ids: [id], updateData: story });
    };

    if (!story) {
        return (
            <div className="m-5 flex items-center justify-center">
                    <SyncLoader color="#cd7f4f"/>
            </div>
        );
    }

    const sortedAffiliations = getSortedAffiliations();

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
                            className="w-full font-bold h-40 md:h-80 p-2 text-sm md:text-xl rounded resize-none bg-theme  hover:ring-button-dark"
                            value={story.description || ""}
                            disabled
                            placeholder=""
                        />
                    </div>
                </div>

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
                                className="mr-2"
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
                                                <CharacterCard key={character.id} story={story} character={character}
                                                    onUpdate={() => {
                                                        StoryGet({ id, setStory });
                                                    }} />
                                            ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="inline-flex space-x-4">
                                {characters.map(character => (
                                    <CharacterCard key={character.id} story={story} character={character}
                                        onUpdate={() => {
                                            StoryGet({ id, setStory });
                                        }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <h2 className="text-2xl md:text-3xl font-bold">Chapters</h2>
                            <button
                                onClick={(e) => { ChapterCreate({ e, id, setChapters, data: { title: "Title", description: "" } }) }}
                                className="ml-5 bg-button text-white p-2 rounded hover:bg-button-dark transition-colors duration-300"
                            >
                                Create Chapter
                            </button>
                        </div>
                        <Link to={`/stories/${id}/tree`} className="bg-button hover:bg-button-dark text-white p-2 rounded text-center ml-3">
                            View Tree
                        </Link>
                    </div>
                    {chapters.map(chapter => (
                        <Chapter key={chapter.id} storyId={id} chapter={chapter} onUpdate={() => { ChaptersGet({ id, setChapters }) }} />
                    ))}
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
                            closePopup(false)
                            UserGet({ setUser });
                        }}
                        onUpdate={StoryUpdate}
                        onDelete={() => { StoryDelete({ id: id, onClose: () => closePopup(true) }) }}
                        imageChange={true}
                        bannerChange={true}
                        safeDelete={true}
                        user = {user}
                    />
                )}
            </div>
        </div>
    );
}

export default Story;
