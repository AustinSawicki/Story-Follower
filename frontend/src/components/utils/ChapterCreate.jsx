import api from "../../api";
import ChaptersGet from "./ChaptersGet";

function ChapterCreate({e, id, setChapters, data}) {
    e.preventDefault();
        api.post(`/api/stories/${id}/chapters/`, data)
        .then((res) => {
            if (res.status === 201) {
                ChaptersGet({id, setChapters});
            } else {
                alert("Failed to create chapter.");
            }
        })
        .catch((err) => alert(err));
}

export default ChapterCreate