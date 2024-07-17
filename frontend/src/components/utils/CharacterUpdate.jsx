import api from "../../api";

function CharacterUpdate({ ids, onClose = null, updateData, onUpdate = null }) {
    return api.patch(`/api/stories/${ids[0]}/characters/${ids[1]}/update/`, updateData)
        .then((res) => {
            if (res.status === 200) {
                if (onClose) {
                    onClose();
                }
                if (onUpdate) {
                    onUpdate();
                }
            } else {
                console.log('Failed to update character.');
            }
        })
        .catch((err) => {
            alert(err);
            return Promise.reject(err);
        });
}

export default CharacterUpdate;