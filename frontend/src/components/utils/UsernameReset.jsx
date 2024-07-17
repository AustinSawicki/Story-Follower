import api from "../../api";

const UsernameReset = async ({newUsername, setNewUsername, setUsernameSuccess, setUsernameError, setIsLoading = null}) => {
    setUsernameError('');
    setUsernameSuccess('');
    if(setIsLoading) {
      setIsLoading(true)
    }
    try {
      await api.patch('/api/user/update-username/', { username: newUsername });
      setUsernameSuccess('Username updated successfully!');
      setNewUsername(newUsername);
      if(setIsLoading) {
        setIsLoading(false)
      }
    } catch (error) {
      setUsernameError('Error updating username.');
      console.error('Error updating username:', error);
    }
}

export default UsernameReset