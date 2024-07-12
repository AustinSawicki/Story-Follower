import api from "../../api";

function StoryGet({id, setStory}) {
    api.get(`/api/stories/${id}`)
            .then((res) => res.data)
            .then((data) => {
                console.log("Getting Story Data!", data)
                setStory(data);
            })
            .catch((err) => alert(err));
}

export default StoryGet