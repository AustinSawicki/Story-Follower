import api from "../../api";

function DescriptionGet({id, setDescription}) {
    api.get(`/api/stories/${id}/`)
            .then((res) => res.data)
            .then((data) => {
                setDescription(data.about);
            })
            .catch((err) => alert(err));
}

export default DescriptionGet