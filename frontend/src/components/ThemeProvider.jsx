import React, { useEffect, useState, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { UserGet, StoryGet } from './utils';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const beige = {
    theme_default: "#f5f5dc",
    theme_dark: "#e5e5c2",
    button_default: "#cd7f4f",
    button_dark: "#a0522d",
    text_color: "#000000"
  }

  const location = useLocation();
  const [accessToken, setAccessToken] = useState(localStorage.getItem(ACCESS_TOKEN));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem(REFRESH_TOKEN));
  const [user, setUser] = useState({});
  const [themes, setThemes] = useState([]);
  const [theme, setTheme] = useState(beige);
  const [story, setStory]= useState(null)

  function storyCheck(){
    const path = location.pathname;
    const match = path.match(/\/stories\/(\d+)/);
    if (match) {
      const storyId = match[1];
      StoryGet({ id: storyId, setStory });
    }
    else{
      setStory(null)
    }
  }


  function getUserandStory() {
    if (accessToken && refreshToken) {
      UserGet({ setUser });
      storyCheck();
    } else {
      updateTheme("beige");
    }
  }

  useEffect(() => {
    setAccessToken(localStorage.getItem(ACCESS_TOKEN));
    setRefreshToken(localStorage.getItem(REFRESH_TOKEN));
  }, [location]);

  useEffect(() => {
    getUserandStory()
  }, [accessToken, refreshToken, location]);


  useEffect(() => {
    if (user) {
      setThemes(user.themes || []);
    }
  }, [user]);

  useEffect(() => {
    if (themes) {
      if(story){
        updateTheme(story.theme)
      }
      else {
        updateTheme(user.theme)
      }
    }
  }, [themes,story]);

  const updateTheme = (newTheme) => {
    const selectedTheme = themes.find(theme => theme.name === newTheme);
    if (selectedTheme) {
      setTheme(selectedTheme);
      updateCSSVariables(selectedTheme);
    } else {
      setTheme(beige);
    }

  };

  const updateThemeExternal = () => {
    getUserandStory()
  }

  const invertColor = (hex) => {
    const color = hex.startsWith('#') ? hex.slice(1) : hex;
    const invertedColor = `#${(Number(`0x1${color}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()}`;
    return invertedColor;
  };

  const updateCSSVariables = (theme) => {
    const root = document.documentElement;
    root.style.setProperty('--theme-default', theme.theme_default);
    root.style.setProperty('--theme-dark', theme.theme_dark);
    root.style.setProperty('--button-default', theme.button_default);
    root.style.setProperty('--button-dark', theme.button_dark);
    root.style.setProperty('--text-color', theme.text_color);
    root.style.setProperty('--text-color-inverse', invertColor(theme.text_color));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, updateThemeExternal }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
