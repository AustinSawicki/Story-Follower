import api from "../../api";

function ThemeDelete({id, theme, customThemes, setCustomThemes}) {
    api.delete(`/api/user/themes/${id}/delete/`)
        .then(() => {
            setCustomThemes(customThemes.filter((t) => t.id !== theme.id));
        })
        .catch((error) => {
            console.error('Error deleting theme:', error);
        });
};

export default ThemeDelete