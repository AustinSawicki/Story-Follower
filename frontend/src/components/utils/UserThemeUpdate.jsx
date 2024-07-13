import api from "../../api";
import { themesDictionary } from "../../assets/themes";

const UserThemeUpdate = async ({newTheme, updateTheme, setTheme}) => {
    try {
      await api.patch('api/user/update-theme/', { theme: newTheme });
      updateTheme(newTheme)
      setTheme(themesDictionary[newTheme]);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

export default UserThemeUpdate