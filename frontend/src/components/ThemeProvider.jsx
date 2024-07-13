import React, { useEffect, useState, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { themesDictionary } from '../assets/themes';
import { UserGet, StoryGet } from './utils';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState(localStorage.getItem(ACCESS_TOKEN));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem(REFRESH_TOKEN));
  const [user, setUser] = useState({});
  const [story, setStory] = useState({});
  const [themeString, setThemeString] = useState("beige");
  const [theme, setTheme] = useState(themesDictionary.beige);


  useEffect(() => {
    setAccessToken(localStorage.getItem(ACCESS_TOKEN));
    setRefreshToken(localStorage.getItem(REFRESH_TOKEN));
  }, [location]);

  useEffect(() => {
    if (accessToken && refreshToken) {
      UserGet({ setUser });
    }
    else {
      updateTheme("beige");
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (user && user.theme) {
      updateTheme(user.theme);
    }
  }, [user]);


  const updateTheme = (newTheme) => {
    setThemeString(newTheme);
    setTheme(themesDictionary[newTheme]);
  };


  return (
    <ThemeContext.Provider value={{ theme, themeString, updateTheme }}>
      <div style={{
        '--theme-default': theme.theme_default,
        '--theme-dark': theme.theme_dark,
        '--button-default': theme.button_default,
        '--button-dark': theme.button_dark,
        '--text-color': theme.text_color 
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;