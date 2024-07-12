import api from "../../api";
import CharactersGet from "./CharactersGet";

function StoryCreate({e, title, StoriesGet, setStories}) {
    e.preventDefault();
    api.post("/api/stories/", { title })
        .then((res) => {
            if (res.status === 201) console.log("Story created!");
            else alert("Failed to make note.");
            StoriesGet({setStories});
        })
        .catch((err) => alert(err));
}

export default StoryCreate