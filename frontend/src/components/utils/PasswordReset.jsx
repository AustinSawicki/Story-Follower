import api from "../../api";

const PasswordReset = async ({newPassword, reenteredPassword, setNewPassword, setReenteredPassword, setPasswordSuccess, setPasswordError}) => {
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== reenteredPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      await api.patch('/api/user/update-password/', { new_password: newPassword });
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setReenteredPassword('');
    } catch (error) {
      setPasswordError('Error resetting password.');
      console.error('Error resetting password:', error);
    }
}

export default PasswordReset