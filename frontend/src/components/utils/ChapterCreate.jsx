import api from "../../api";
import ChaptersGet from "./ChaptersGet";

function ChapterCreate({e, id, setChapters}) {
    e.preventDefault();
        api.post(`/api/stories/${id}/chapters/`, {})
        .then((res) => {
            if (res.status === 201) {
                console.log("Chapter created!");
                ChaptersGet({id, setChapters});
            } else {
                alert("Failed to create chapter.");
            }
        })
        .catch((err) => alert(err));
}

export default ChapterCreate