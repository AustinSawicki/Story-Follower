import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ColorPopup from './ColorPopup';
import { UserThemeUpdate, ThemeDelete } from './utils';
import { useTheme } from './ThemeProvider';

const ThemeDropdown = ({ type, user, customThemes, setCustomThemes, theme, setTheme }) => {
  const { updateTheme, updateThemeExternal } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showThemePopup, setShowThemePopup] = useState(false);
  const [editTheme, setEditTheme] = useState(null);

  const handleMenuItemClick = (t) => {
    if (type === "user") {
      UserThemeUpdate({ newTheme: t.name, updateThemeExternal, setTheme });
    } else {
      setTheme(t.name);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemePopupSubmit = (newTheme) => {
    const updatedThemes = editTheme
      ? customThemes.map((theme) => (theme.id === newTheme.id ? newTheme : theme))
      : [...customThemes, newTheme];

    setCustomThemes(updatedThemes);
    setShowThemePopup(false);
    setEditTheme(null);
    if (type === "user") {
      UserThemeUpdate({ newTheme: newTheme.name, updateThemeExternal, setTheme });
    } else {
      setTheme(newTheme.name);
    }
  };

  const handleEditTheme = (theme) => {
    setEditTheme(theme);
    setShowThemePopup(true);
  };

  const handleDeleteTheme = async (deleteTheme) => {
    ThemeDelete({ id: deleteTheme.id, theme: deleteTheme, customThemes, setCustomThemes });
    if (deleteTheme.name === theme) {
      if (type === "user") {
        UserThemeUpdate({ newTheme: "beige", updateThemeExternal, setTheme });
      } else {
        setTheme(user.theme);
      }
    }
  };

  // Ensure "beige" theme is the first in the list and the rest are sorted alphabetically
  //const sortedThemes = [{ id: beigeTheme.id, name: 'beige' }, ...customThemes.filter(t => t.name !== 'beige').sort((a, b) => a.name.localeCompare(b.name))];


  let beigeTheme;

  beigeTheme = customThemes.find(t => t.name.toLowerCase() === 'beige')

  const sortedThemes = [beigeTheme || { id: '1', name: 'beige' }, ...customThemes.filter(t => t.name !== 'beige').sort((a, b) => a.name.localeCompare(b.name))]

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{
          backgroundColor: 'var(--theme-default)',
          border: '2px solid',
          borderColor: 'var(--button-default)',
          display: 'block',
          textAlign: 'center',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)', // equivalent to shadow-inner-dark in Tailwind
          outline: 'none',
          textTransform: 'none',
          color: 'inherit',
          fontFamily: 'sans',
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--button-dark)'; // equivalent to focus:border-button-dark in Tailwind
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--button-default)';
        }}
      >
        {theme ? theme : 'Select Theme'}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          sx: {
            backgroundColor: 'var(--theme-default)',
            border: 2,
            borderColor: 'var(--button-default)',
            boxShadow: 5,
          }
        }}
      >
        {sortedThemes.map((t) => (
          <MenuItem key={t.id} onClick={() => { handleMenuItemClick(t); handleClose(); }}>
            <div className="flex justify-between items-center w-full">
              <span>{t.name}</span>
              {t.name !== 'beige' && (
                <div>
                  <button
                    type="button"
                    className="text-button hover:text-button-dark mx-1"
                    onClick={(e) => { e.stopPropagation(); handleEditTheme(t); handleClose(); }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={(e) => { e.stopPropagation(); handleDeleteTheme(t); handleClose(); }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </MenuItem>
        ))}
        <MenuItem onClick={() => { setShowThemePopup(true); handleClose(); }}><span>Create Theme</span></MenuItem>
      </Menu>
      {showThemePopup && (
        <ColorPopup
          title={"Theme"}
          ids={editTheme ? [editTheme.id] : []}
          itemList={customThemes}
          edit={editTheme}
          onClose={() => {
            setShowThemePopup(false);
            setEditTheme(null);
          }}
          popupSubmit={handleThemePopupSubmit}
        />
      )}
    </div>
  );
};

export default ThemeDropdown;
