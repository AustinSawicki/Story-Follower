import React, { useState, useEffect } from 'react';
import { UserGet, UsernameReset, PasswordReset } from './utils';
import { useTheme } from './ThemeProvider';
import ThemeDropdown from './ThemeDropdown'; 
import SyncLoader from 'react-spinners/SyncLoader';

const UserSettings = () => {
  const { updateTheme, updateThemeExternal, theme:t} = useTheme();
  const [user, setUser] = useState({});
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [theme, setTheme] = useState("");
  const [customThemes, setCustomThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      await UserGet({ setUser });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user.username) {
      setNewUsername(user.username);
    }
    if (user.themes) {
      setCustomThemes(user.themes);
    }
    if (user.theme) {
      setTheme(user.theme);
    }
    updateThemeExternal();
  }, [user]);

  return (
    <div className="mt-10 mb-10 p-4 max-w-md mx-auto bg-theme-dark rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">User Settings</h2>
      <div className="space-y-2">
        <div className="mb-5">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 rounded-md bg-theme ring-2 ring-button focus:ring-button-dark focus:outline-none shadow-inner-dark sm:text-sm"
          />
          {usernameError && <p className="mt-2 text-red-600">{usernameError}</p>}
          {usernameSuccess && <p className="mt-2 text-green-600">{usernameSuccess}</p>}
          <button
            onClick={() => UsernameReset({ newUsername, setNewUsername, setUsernameSuccess, setUsernameError, setIsLoading })}
            className="mt-2 px-4 py-2 bg-button text-white rounded-md hover:bg-button-dark"
          >
            Reset Username
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 rounded-md bg-theme ring-2 ring-button focus:ring-button-dark focus:outline-none shadow-inner-dark sm:text-sm"
          />
          <label className="block text-sm font-medium">Re-enter Password</label>
          <input
            type="password"
            value={reenteredPassword}
            onChange={(e) => setReenteredPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 rounded-md bg-theme ring-2 ring-button focus:ring-button-dark focus:outline-none shadow-inner-dark sm:text-sm"
          />
          {passwordError && <p className="mt-2 text-red-600">{passwordError}</p>}
          {passwordSuccess && <p className="mt-2 text-green-600">{passwordSuccess}</p>}
          <button
            onClick={() => PasswordReset({ newPassword, reenteredPassword, setNewPassword, setReenteredPassword, setPasswordSuccess, setPasswordError, setIsLoading })}
            className="mb-5 mt-2 px-4 py-2 bg-button text-white rounded-md hover:bg-button-dark"
          >
            Reset Password
          </button>
        </div>
        {isLoading && (
          <div className="m-5 flex items-center justify-center">
              <SyncLoader color={t.button_default} />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium">Theme</label>
          <ThemeDropdown
            type = {"user"}
            customThemes={customThemes}
            setCustomThemes={setCustomThemes}
            theme={theme}
            setTheme={setTheme}
          />
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
