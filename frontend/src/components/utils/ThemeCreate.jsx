import api from "../../api";

function ThemeCreate({themeData, onClose, popupSubmit}) {  
    api.post(`/api/user/themes/`, themeData)
                .then(response => {
                    popupSubmit(response.data);
                    onClose();
                })
                .catch(error => {
                    console.error('Error creating affiliation:', error);
                });
}

export default ThemeCreate