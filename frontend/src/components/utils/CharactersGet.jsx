import api from "../../api";

function CharactersGet({id, setCharacters}) {
    api.get(`/api/stories/${id}/characters/`)
            .then((res) => res.data)
            .then((data) => {
                const sortedCharacters = [...data].sort((a, b) => a.position - b.position);
                setCharacters(sortedCharacters);
            })
            .catch((err) => alert(err));
}

export default CharactersGet