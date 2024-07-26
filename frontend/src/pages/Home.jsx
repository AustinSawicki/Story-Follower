import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Popup from "../components/Popup";
import { StoriesGet, StoryCreate, UserGet, UserSortOptionUpdate } from "../components/utils";
import StoryUpdate from "../components/utils/StoryUpdate";
import StoryDelete from "../components/utils/StoryDelete";
import { useTheme } from '../components/ThemeProvider';
import SyncLoader from 'react-spinners/SyncLoader';

function Home() {
    const { updateTheme, theme } = useTheme();
    const [user, setUser] = useState({});
    const [stories, setStories] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);
    const [groupedStories, setGroupedStories] = useState(null);
    const [chunkedGroupedStories, setChunkedGroupedStories] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState("alphabetical"); // Add state for sorting option
    const containerRef = useRef(null);

    useEffect(() => {
        StoriesGet({ setStories, setIsLoading });
        UserGet({ setUser });
    }, []);

    useEffect(() => {
        if (user) {
            if (user.theme) {
                updateTheme(user.theme);
            }
            if (user.sort_option) {
                setSortOption(user.sort_option)
            }
        }
    }, [user]);

    useEffect(() => {
        if (stories.length > 0) {
            if (sortOption === "alphabetical") {
                const groupedStories = stories
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .reduce((groups, story) => {
                        const firstChar = story.title[0].toUpperCase();
                        const letter = firstChar.match(/\p{L}/u) ? firstChar : '#'; // Check if it's a letter in any language, else use '#'
                        if (!groups[letter]) {
                            groups[letter] = [];
                        }
                        groups[letter].push(story);
                        groups[letter].sort((a, b) => b.title.length - a.title.length); // Sort by length of title
                        return groups;
                    }, {});
                setGroupedStories(groupedStories);
            } else if (sortOption === "rating") {
                const groupedByRating = stories.reduce((groups, story) => {
                    const rating = story.rating !== null ? Math.floor(story.rating) : "No Rating";
                    if (!groups[rating]) {
                        groups[rating] = [];
                    }
                    groups[rating].push(story);
                    return groups;
                }, {});
                setGroupedStories(groupedByRating);
            }
        } else {
            setGroupedStories({});
        }
    }, [stories, sortOption]);

    useEffect(() => {
        if (groupedStories && Object.keys(groupedStories).length > 0) {
            const chunkedGroupedStories = chunkArrayWithIndexing(groupedStories, 5);
            setChunkedGroupedStories(chunkedGroupedStories);
        } else {
            setChunkedGroupedStories({});
        }
    }, [groupedStories]);

    const openPopup = (story) => {
        setSelectedStory(story);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedStory(null);
        StoriesGet({ setStories });
    };

    // Helper function to chunk an array into smaller arrays of a specified size and add indexing
    const chunkArrayWithIndexing = (groupedStories, chunkSize) => {
        const chunked = {};
        Object.keys(groupedStories).forEach(letter => {
            const chunks = [];
            const stories = groupedStories[letter];
            for (let i = 0; i < stories.length; i += chunkSize) {
                const chunk = stories.slice(i, i + chunkSize);
                chunks.push(chunk);
            }
            chunked[letter] = chunks.map((chunk, index) => ({
                title: index === 0 ? letter : `${letter}-${index}`,
                stories: chunk,
            }));
        });
        return chunked;
    };

    const handleSortOptionChange = (option) => {
        UserSortOptionUpdate({option, setSortOption});

    };

    if (!user || !stories || groupedStories === null || chunkedGroupedStories === null) {
        return (
            <div className="m-5 flex items-center justify-center">
                <SyncLoader color={theme.button_default} />
            </div>
        );
    }

    return (
        <div className="m-8 overflow-x-auto">
            <div className="flex items-center mb-4">
                <h2 className="text-3xl font-bold">Stories</h2>
                <button
                    onClick={async (e) => {
                        const story = await StoryCreate({ e, title: "New Story", StoriesGet, setStories });
                        openPopup(story);
                    }}
                    className="ml-5 bg-button text-white p-2 rounded hover:bg-button-dark transition-colors duration-300"
                >
                    Create Story
                </button>
            </div>
            <div className="flex items-center mb-4">
                <label className="flex items-center mr-4">
                    <input
                        type="checkbox"
                        checked={sortOption === "alphabetical"}
                        onChange={() => handleSortOptionChange("alphabetical")}
                        className="form-checkbox accent-button"
                    />
                    <span className="ml-2">Alphabetical Sort</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={sortOption === "rating"}
                        onChange={() => handleSortOptionChange("rating")}
                        className="form-checkbox accent-button"
                    />
                    <span className="ml-2">Rating Sort</span>
                </label>
            </div>

            {showPopup && selectedStory && (
                <Popup
                    ids={[selectedStory.id]}
                    name="Story"
                    config={[{ "Title": selectedStory.title }]}
                    onClose={closePopup}
                    onUpdate={StoryUpdate}
                    onDelete={() => { StoryDelete({ id: selectedStory.id, onClose: closePopup }) }}
                    safeDelete={true}
                />
            )}
            <div className="flex flex-wrap gap-20">
                {Object.keys(chunkedGroupedStories).map(letter => (
                    chunkedGroupedStories[letter].map((group, index) => (
                        <div key={group.title} className="group m-4">
                            <h3 className="text-2xl font-semibold">{group.title}</h3>
                            <ul className="mb-4">
                                {group.stories.map(story => (
                                    <li key={story.id} className="mb-2 flex items-center text-center bg-button hover:bg-button-dark rounded-md w-fit p-1">
                                        <Link className="text-white p-1" to={`/stories/${story.id}`}>
                                            {story.title} {sortOption === "rating" && story.rating !== null ? `(${story.rating.toFixed(1)})` : ""}
                                        </Link>
                                        <button onClick={() => openPopup(story)} className="text-white hover:text-button">⋮</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ))}
                {isLoading && (
                    <div className="m-5 flex items-center justify-center">
                        <SyncLoader color={theme.button_default} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
