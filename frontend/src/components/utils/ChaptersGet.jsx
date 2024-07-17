import api from "../../api";

function ChaptersGet({id, setChapters}) {
    api.get(`/api/stories/${id}/chapters/`)
            .then((res) => res.data)
            .then((data) => {
                const sortedChapters = [...data].sort((a, b) => a.position - b.position);
                setChapters(sortedChapters);
                console.log("OG CHAPTERS",sortedChapters)
            })
            .catch((err) => alert(err));
}

export default ChaptersGet