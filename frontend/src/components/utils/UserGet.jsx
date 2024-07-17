import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

const UserGet = async ({ setUser }) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  if(accessToken && refreshToken) {
    try {
      const response = await api.get(`/api/user/me/`);
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
}


export default UserGet;