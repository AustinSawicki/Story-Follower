import api from "../../api";

function StoryDelete({id, onClose}) {
    api.delete(`/api/stories/${id}/delete/`)
            .then((res) => {
                if (res.status === 204) {
                    onClose(); // Close the popup on success
                } else {
                    console.log('Failed to delete story.');
                }
            })
            .catch((err) => alert(err));
}

export default StoryDelete