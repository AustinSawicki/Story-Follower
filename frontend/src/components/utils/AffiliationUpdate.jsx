import api from "../../api";

function AffiliationUpdate({ids, name, color, onClose, popupSubmit}) {  
    api.patch(`/api/stories/${ids[0]}/affiliations/${ids[1]}/update/`, { id: ids[1], story: ids[0], name, color })
    .then(response => {
        popupSubmit(response.data);
        onClose();
    })
    .catch(error => {
        console.error('Error updating affiliation:', error);
    });
}

export default AffiliationUpdate