import api from "../../api";

function ChapterUpdate({ids, onClose, updateData}) {
    api.patch(`/api/stories/${ids[0]}/chapters/${ids[1]}/update/`, updateData)
            .then((res) => {
                if (res.status === 200) {
                    console.log('Chapter updated!');
                    onClose(); // Close the popup on success
                } else {
                    console.log('Failed to update chapter.');
                }
            })
            .catch((err) => alert(err));
}

export default ChapterUpdate