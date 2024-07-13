import api from "../../api";

function CharacterDelete({ids, onClose}) {
    api.delete(`/api/stories/${ids[0]}/characters/${ids[1]}/delete/`)
            .then((res) => {
                if (res.status === 204) {
                    onClose(); // Close the popup on success
                } else {
                    console.log('Failed to delete character.');
                }
            })
            .catch((err) => alert(err));
}

export default CharacterDelete