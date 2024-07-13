import api from "../../api";

const UsernameReset = async ({newUsername, setNewUsername, setUsernameSuccess, setUsernameError}) => {
    setUsernameError('');
    setUsernameSuccess('');
    try {
      await api.patch('/api/user/update-username/', { username: newUsername });
      setUsernameSuccess('Username updated successfully!');
      setNewUsername(newUsername);
    } catch (error) {
      setUsernameError('Error updating username.');
      console.error('Error updating username:', error);
    }
}

export default UsernameReset