import api from "../../api";

function CharacterUpdate({ids, onClose, updateData}) {
    api.patch(`/api/stories/${ids[0]}/characters/${ids[1]}/update/`, updateData)
            .then((res) => {
                if (res.status === 200) {
                    console.log('Character updated!');
                    onClose(); // Close the popup on success
                } else {
                    console.log('Failed to update character.');
                }
            })
            .catch((err) => alert(err));
}

export default CharacterUpdate