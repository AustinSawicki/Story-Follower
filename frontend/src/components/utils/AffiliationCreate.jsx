import api from "../../api";

function AffiliationCreate({ids, name, color, onClose, popupSubmit}) {  
    api.post(`/api/stories/${ids[0]}/affiliations/`, { story: ids[0], name, color })
                .then(response => {
                    popupSubmit(response.data);
                    onClose();
                })
                .catch(error => {
                    console.error('Error creating affiliation:', error);
                });
}

export default AffiliationCreate