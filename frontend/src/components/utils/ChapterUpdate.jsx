import api from "../../api";

function ChapterUpdate({ ids, onClose = null, updateData }) {
    api.patch(`/api/stories/${ids[0]}/chapters/${ids[1]}/update/`, updateData)
        .then((res) => {
            if (res.status === 200) {
                api.put(`/api/stories/chapters/${ids[1]}/`, updateData)
                    .then((updateRes) => {
                        if (updateRes.status === 200) {
                            if (onClose) {
                                onClose(); // Close the popup on success
                            }
                        } else {
                            console.log('Failed to run update_chapter.');
                        }
                    })
                    .catch((err) => alert(`Error running update_chapter: ${err}`));
            } else {
                console.log('Failed to update chapter.');
            }
        })
        .catch((err) => alert(`Error updating chapter: ${err}`));
}

export default ChapterUpdate;