import api from "../../api";

function DescriptionUpdate({e, id, description}) {
    e.preventDefault();
    api.patch(`/api/stories/${id}/update/`, { "about": description })
        .then((res) => {
            if (res.status === 200) {
                console.log("Description updated!");
            } else {
                console.log("Failed to update description.");
            }
        })
        .catch((err) => alert(err));
}

export default DescriptionUpdate