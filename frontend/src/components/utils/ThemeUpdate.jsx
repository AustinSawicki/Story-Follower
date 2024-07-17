import api from "../../api";

function ThemeUpdate({id, themeData, onClose, popupSubmit}) {  
    api.patch(`/api/user/themes/${id}/update/`, themeData)
    .then(response => {
        popupSubmit(response.data);
        onClose();
    })
    .catch(error => {
        console.error('Error updating affiliation:', error);
    });
}

export default ThemeUpdate