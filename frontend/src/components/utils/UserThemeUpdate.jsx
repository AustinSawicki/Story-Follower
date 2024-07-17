import api from "../../api";

const UserThemeUpdate = async ({newTheme, updateThemeExternal, setTheme}) => {
    try {
      await api.patch('api/user/update-user-theme/', { theme: newTheme })
      .then((res) =>{
        updateThemeExternal();
        setTheme(newTheme);
      }) 
    }catch (error) {
      console.error('Error updating theme:', error);
    }
  };

export default UserThemeUpdate