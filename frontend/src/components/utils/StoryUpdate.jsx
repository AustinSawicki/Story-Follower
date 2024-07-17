import api from "../../api";

function StoryUpdate({ids, onClose=null, updateData}) {
    api.patch(`/api/stories/${ids[0]}/update/`, updateData)
    .then((res) => {
        if (res.status === 200) {
        } else {
            console.log('Failed to update story.');
        }
    }).then(() => {
        if(onClose) {
            onClose();
        }
    })
    .catch((err) => alert(err));
}

export default StoryUpdate