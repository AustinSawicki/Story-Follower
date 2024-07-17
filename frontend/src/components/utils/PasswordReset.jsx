import api from "../../api";

const PasswordReset = async ({newPassword, reenteredPassword, setNewPassword, setReenteredPassword, setPasswordSuccess, setPasswordError, setIsLoading = null}) => {
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== reenteredPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if(setIsLoading) {
      setIsLoading(true)
      console.log("Set Loading True")
    }

    try {
      await api.patch('/api/user/update-password/', { new_password: newPassword });
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setReenteredPassword('');
      if(setIsLoading) {
        setIsLoading(false)
        console.log("Set Loading False")
      }
    } catch (error) {
      setPasswordError('Error resetting password.');
      console.error('Error resetting password:', error);
    }
}

export default PasswordReset