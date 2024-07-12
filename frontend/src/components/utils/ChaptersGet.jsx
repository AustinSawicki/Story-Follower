import api from "../../api";

function ChaptersGet({id, setChapters}) {
    api.get(`/api/stories/${id}/chapters/`)
            .then((res) => res.data)
            .then((data) => {
                setChapters(data);
            })
            .catch((err) => alert(err));
}

export default ChaptersGet