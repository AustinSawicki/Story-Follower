import api from "../../api";

const StoryCreate = async ({e, title, StoriesGet, setStories}) => {
    e.preventDefault();
    try {
        const res = await api.post("/api/stories/", { title });
        if (res.status === 201) {
            await StoriesGet({setStories});
            return res.data;
        } else {
            alert("Failed to make story.");
        }
    } catch (err) {
        alert(err);
    }
    return null;
}

export default StoryCreate;