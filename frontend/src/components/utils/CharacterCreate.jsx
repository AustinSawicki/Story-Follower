import api from "../../api";
import CharactersGet from "./CharactersGet";

function CharacterCreate({e, id, setCharacters}) {
    e.preventDefault();
        api.post(`/api/stories/${id}/characters/`, {
            name: "Name",
            group: "Affliation",
            description: ""
        })
        .then((res) => {
            if (res.status === 201) {
                CharactersGet({id, setCharacters});
            } else {
                alert("Failed to create character.");
            }
        })
        .catch((err) => alert(err));
}

export default CharacterCreate