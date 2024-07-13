import api from "../../api";

const UserGet = async ({ setUser }) => {
  try {
    const response = await api.get(`/api/user/me/`);
    const userData = response.data;
    setUser(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

export default UserGet;