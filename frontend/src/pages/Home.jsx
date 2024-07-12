import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Popup from "../components/Popup";
import { StoriesGet, StoryCreate } from "../components/utils";
import StoryUpdate from "../components/utils/StoryUpdate";
import StoryDelete from "../components/utils/StoryDelete";

function Home() {
    const [stories, setStories] = useState([]);
    const [title, setTitle] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);

    useEffect(() => {
        StoriesGet({setStories});
    }, []);

    const openPopup = (story) => {
        setSelectedStory(story);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedStory(null);
        StoriesGet({setStories});
    };

    return (
        <div className="m-8">
            <div>
                <h1 className="text-2xl font-bold mb-4 " >Stories</h1>
                <ol>
                    {stories.map((story) => (
                        <li className="mt-2" key={story.id}>
                            <Link className="hover:underline" to={`/stories/${story.id}`}>{story.title}</Link>
                            <button onClick={() => openPopup(story)} className="ml-2 text-gray-600 hover:text-gray-800">⋮</button>
                        </li>
                    ))}
                </ol>
            </div>
            <h2 className="mt-10 mb-2 font-bold" >Create a Story</h2>
            <form onSubmit={(e) => {StoryCreate({e, title, StoriesGet, setStories})}}>
                <label htmlFor="title" className="mr-3">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <input type="submit" value="Submit" className="ml-3"></input>
            </form>
            {showPopup && selectedStory && (
                <Popup
                    ids={[selectedStory.id]}
                    name = "Story"
                    config={[{ "Title": selectedStory.title }]}
                    onClose={closePopup}
                    onUpdate={StoryUpdate}
                    onDelete={() => {StoryDelete({id: selectedStory.id, onClose: closePopup})}}
                />
            )}
        </div>
    );
}

export default Home;
