import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Popup from "../components/Popup";
import { StoriesGet, StoryCreate, UserGet } from "../components/utils";
import StoryUpdate from "../components/utils/StoryUpdate";
import StoryDelete from "../components/utils/StoryDelete";
import { useTheme } from '../components/ThemeProvider';

function Home() {
    const { updateTheme } = useTheme();
    const [user, setUser] = useState({});
    const [stories, setStories] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        StoriesGet({ setStories });
        UserGet({ setUser });
    }, []);

    useEffect(() => {
        if (user && user.theme) {
          updateTheme(user.theme);
        }
      }, [user]);

    useEffect(() => {
        const handleResize = () => {
            const container = containerRef.current;
            const items = Array.from(container.children);
            const navbarHeight = document.querySelector('nav').offsetHeight;
            const footerHeight = document.querySelector('footer').offsetHeight;
            const offset = 150;
            const columnHeight = window.innerHeight - navbarHeight - footerHeight - offset;
            let currentColumnHeight = 0;
            let currentColumn = 1;

            items.forEach(item => {
                if (currentColumnHeight + item.clientHeight > columnHeight) {
                    currentColumn++;
                    currentColumnHeight = 0;
                }
                item.style.gridColumnStart = currentColumn;
                currentColumnHeight += item.clientHeight;
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [stories]);

    const openPopup = (story) => {
        setSelectedStory(story);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedStory(null);
        StoriesGet({ setStories });
    };

    // Sort and group stories by their starting letter
    const groupedStories = stories
    .sort((a, b) => a.title.localeCompare(b.title))
    .reduce((groups, story) => {
        const firstChar = story.title[0].toUpperCase();
        const letter = firstChar.match(/\p{L}/u) ? firstChar : '#'; // Check if it's a letter in any language, else use '#'
        if (!groups[letter]) {
            groups[letter] = [];
        }
        groups[letter].push(story);
        return groups;
    }, {});

    return (
        <div className="m-8">
            <div>
                <div className="flex items-center">
                    <h2 className="text-3xl font-bold">Stories</h2>
                    <button
                        onClick={async (e) => {
                            const story =  await StoryCreate({e, title: "New Story", StoriesGet, setStories})
                            openPopup(story)
                        }}
                        className="ml-5 bg-button text-white p-2 rounded hover:bg-button-dark transition-colors duration-300"
                    >
                        Create Story
                    </button>
                </div>
                <div className="grid" ref={containerRef}>
                    {Object.keys(groupedStories).sort().map(letter => (
                        <div key={letter} className="grid-item">
                            <h2 className="text-xl font-bold mt-6">{letter}</h2>
                            <ol>
                                {groupedStories[letter].map((story) => (
                                    <li className="mt-2" key={story.id}>
                                        <Link className="hover:underline" to={`/stories/${story.id}`}>{story.title}</Link>
                                        <button onClick={() => openPopup(story)} className="ml-2 text-gray-600 hover:text-gray-800">⋮</button>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            </div>
            {showPopup && selectedStory && (
                <Popup
                    ids={[selectedStory.id]}
                    name="Story"
                    config={[{ "Title": selectedStory.title }]}
                    onClose={closePopup}
                    onUpdate={StoryUpdate}
                    onDelete={() => { StoryDelete({ id: selectedStory.id, onClose: closePopup }) }}
                />
            )}
        </div>
    );
}

export default Home;