import api from "../../api";

function StoryUpdate({ids, onClose, updateData}) {
    api.patch(`/api/stories/${ids[0]}/update/`, updateData)
    .then((res) => {
        if (res.status === 200) {
            console.log('Story updated!');
        } else {
            console.log('Failed to update story.');
        }
    }).then(() => {
        onClose();
    })
    .catch((err) => alert(err));
}

export default StoryUpdate