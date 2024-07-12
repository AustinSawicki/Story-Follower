import api from "../../api";

function StoriesGet({setStories}) {
    api.get("/api/stories/")
    .then((res) => res.data)
    .then((data) => {
        setStories(data);
    })
    .catch((err) => alert(err));
}

export default StoriesGet