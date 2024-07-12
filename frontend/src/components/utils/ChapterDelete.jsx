import api from "../../api";

function ChapterDelete({ids, onClose}) {
    api.delete(`/api/stories/${ids[0]}/chapters/${ids[1]}/delete/`)
            .then((res) => {
                if (res.status === 204) {
                    console.log('Chapter deleted!');
                    onClose(); // Close the popup on success
                } else {
                    console.log('Failed to delete chapter.');
                }
            })
            .catch((err) => alert(err));
}

export default ChapterDelete