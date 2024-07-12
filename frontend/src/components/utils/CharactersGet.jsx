import api from "../../api";

function CharactersGet({id, setCharacters}) {
    api.get(`/api/stories/${id}/characters/`)
            .then((res) => res.data)
            .then((data) => {
                setCharacters(data);
            })
            .catch((err) => alert(err));
}

export default CharactersGet