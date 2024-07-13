import React, { useEffect, useState } from 'react';
import { themesDictionary } from '../assets/themes';
import { UserGet, UserThemeUpdate ,UsernameReset, PasswordReset} from './utils';
import { useTheme } from './ThemeProvider';

const UserSettings = () => {
  const { updateTheme } = useTheme();
  const [user, setUser] = useState({});
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');
  const [theme, setTheme] = useState(themesDictionary.beige);
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  

  const themes = Object.keys(themesDictionary)

  useEffect(() => {
    const fetchData = async () => {
      await UserGet({ setUser });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user.theme) {
      setTheme(themesDictionary[user.theme]);
      updateTheme(user.theme)
    }
    if (user.username) {
      setNewUsername(user.username);
    }
  }, [user]);

  return (
    <div className="mt-10 mb-10 p-4 max-w-md mx-auto bg-theme-dark rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">User Settings</h2>
      <div className="space-y-2">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 rounded-md focus:ring-0 focus:outline-none focus:border-button focus:border-2 shadow-inner-dark sm:text-sm"
          />
        {usernameError && <p className="mt-2 text-red-600">{usernameError}</p>}
        {usernameSuccess && <p className="mt-2 text-green-600">{usernameSuccess}</p>}
          <button
            onClick={() => UsernameReset({newUsername, setNewUsername, setUsernameSuccess, setUsernameError})}
            className="mt-2 px-4 py-2 bg-button text-white rounded-md hover:bg-button-dark"
          >
            Reset Username
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 rounded-md focus:ring-0 focus:outline-none focus:border-button focus:border-2 shadow-inner-dark sm:text-sm"
          />
          <label className="block text-sm font-medium text-gray-700">Re-enter Password</label>
          <input
            type="password"
            value={reenteredPassword}
            onChange={(e) => setReenteredPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 rounded-md focus:ring-0 focus:outline-none focus:border-button focus:border-2 shadow-inner-dark sm:text-sm"
          />
            {passwordError && <p className="mt-2 text-red-600">{passwordError}</p>}
            {passwordSuccess && <p className="mt-2 text-green-600">{passwordSuccess}</p>}
          <button
            onClick={() => PasswordReset({newPassword, reenteredPassword, setNewPassword, setReenteredPassword, setPasswordSuccess, setPasswordError})}
            className="mb-5 mt-2 px-4 py-2 bg-button text-white rounded-md hover:bg-button-dark"
          >
            Reset Password
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Theme</label>
          <select
            value={theme ? Object.keys(themesDictionary).find(key => themesDictionary[key] === theme) : 'beige'}
            onChange={(e) => UserThemeUpdate({newTheme: e.target.value, updateTheme, setTheme})}
            className="bg-button text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-button-dark focus:border-button-dark sm:text-sm"
          >
            {themes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;