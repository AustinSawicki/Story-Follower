import api from "../../api";

function StoriesGet({setStories, setIsLoading = null}) {
    api.get("/api/stories/")
    .then((res) => res.data)
    .then((data) => {
        setStories(data);
        if(setIsLoading) {
            setIsLoading(false);
        }
    })
    .catch((err) => alert(err));
}

export default StoriesGet