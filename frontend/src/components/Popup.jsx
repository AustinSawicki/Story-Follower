import { useState, useEffect, useRef } from "react";
import ImageUpload from './utils/ImageUpload';
import SyncLoader from 'react-spinners/SyncLoader';
import { useTheme } from './ThemeProvider';
import ThemeDropdown from './ThemeDropdown';

const isFirefox = () => {
  return typeof InstallTrigger !== 'undefined';
};

const Popup = ({ ids, name, config, onClose, onUpdate, onDelete, imageChange = false, bannerChange = false, safeDelete = false, user = null }) => {
  const [inputs, setInputs] = useState(config);
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [firstDeleteClick, setFirstDeleteClick] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);
  const [titleError, setTitleError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const labelRefs = useRef([]);
  const [customThemes, setCustomThemes] = useState([]);

  useEffect(() => {
    if (user) {
      setCustomThemes(user.themes);
    }
  }, [user]);

  useEffect(() => {
    let maxWidth = 0;
    labelRefs.current.forEach(label => {
      if (label) {
        const width = label.getBoundingClientRect().width;
        if (width > maxWidth) {
          maxWidth = width;
        }
      }
    });
    setLabelWidth(maxWidth);
  }, [inputs, imageChange, bannerChange]);

  const formatKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleInputChange = (key, value) => {
    const newInputs = inputs.map(input =>
      input.hasOwnProperty(key) ? { [key]: value } : input
    );
    setInputs(newInputs);
    setTitleError(false);
  };

  const handleImageChange = (image) => {
    setImage(image);
  };

  const handleBannerChange = (banner) => {
    setBanner(banner);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const titleInput = inputs.find(input => input.hasOwnProperty('Title'));
    if (!titleInput || !titleInput.Title.trim()) {
      setTitleError(true);
      setLoading(false);
      return;
    }

    const lowerInputs = inputs.map(input => {
      const key = Object.keys(input)[0].toLowerCase();
      const value = Object.values(input)[0];
      return { [key]: value };
    });

    const updateData = lowerInputs.reduce((acc, curr) => {
      const key = Object.keys(curr)[0];
      acc[key] = curr[key];
      return acc;
    }, {});

    try {
      if (image) {
        await ImageUpload({ url: `/api/stories/${ids[0]}/update/`, name: 'image', image });
      }
      if (banner) {
        await ImageUpload({ url: `/api/stories/${ids[0]}/update/`, name: 'banner', image: banner });
      }
      onUpdate({ ids, onClose, updateData, setLoading });
    } catch {
      console.alert("Could not save.");
    }
  };

  const handleDelete = () => {
    if (safeDelete && !firstDeleteClick) {
      setFirstDeleteClick(true);
    } else {
      if (safeDelete) {
        if (confirmTitle !== `Delete ${config[0].Title}`) {
          setDeleteError('Title does not match.');
          return;
        }
      }
      onDelete();
    }
  };

  const handleKeyDownDelete = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDelete();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-theme-dark p-4 rounded shadow-lg w-full max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex text-xl font-bold text-center">{`${name} Settings`}</h2>
          <button onClick={onClose} className="hover:text-gray-500">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {bannerChange && (
            <div className="mb-4 flex items-center">
              <label ref={el => labelRefs.current.push(el)} className="font-semibold mr-2" style={{ minWidth: `${labelWidth}px` }}>Banner: </label>
              <input type="file" className="p-1 rounded-md bg-theme ring-2 ring-button focus:ring-button-dark" onChange={(e) => handleBannerChange(e.target.files[0])} />
            </div>
          )}
          {imageChange && (
            <div className="mb-4 flex items-center">
              <label ref={el => labelRefs.current.push(el)} className="font-semibold mr-2" style={{ minWidth: `${labelWidth}px` }}>Image: </label>
              <input type="file" className="p-1 rounded-md bg-theme ring-2 ring-button focus:ring-button-dark" onChange={(e) => handleImageChange(e.target.files[0])} />
            </div>
          )}
          {inputs.map((input, index) => {
            const key = Object.keys(input)[0];
            const value = Object.values(input)[0];
            return (
              <div key={index} className="mb-4 flex items-center">
                <label ref={el => labelRefs.current[index + (imageChange ? 1 : 0) + (bannerChange ? 1 : 0)] = el} className="font-semibold mr-2" style={{ minWidth: `${labelWidth}px` }}>
                  {formatKey(key)}
                </label>
                {key.toLowerCase() === "description" ? (
                  <textarea
                    className="p-1 rounded-md w-3/4 bg-theme ring-2 ring-button focus:ring-button-dark focus:outline-none shadow-inner-dark custom-scrollbar"
                    value={value || ""}
                    maxLength="5000"
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    rows="4"
                  />
                ) : key.toLowerCase() === "short_description" ? (
                  <textarea
                    className="p-1 rounded-md w-3/4 bg-theme ring-2 ring-button focus:ring-button-dark focus:outline-none shadow-inner-dark custom-scrollbar"
                    value={value || ""}
                    maxLength="200"
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    rows="4"
                  />
                ) : key.toLowerCase() === "theme" ? (
                  <ThemeDropdown
                    type={"story"}
                    user={user}
                    customThemes={customThemes}
                    setCustomThemes={setCustomThemes}
                    theme={value}
                    setTheme={(newTheme) => { handleInputChange(key, newTheme) }}
                  />
                ) : key.toLowerCase() === "title" ? (
                  <div>
                    <input
                      type="text"
                      className="p-1 rounded-md w-3/4 bg-theme ring-2 ring-button focus:ring-button-dark focus:outline-none shadow-inner-dark"
                      value={value}
                      maxLength="30"
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                    {titleError && <p className="text-red-600 black-border">Title is required.</p>}
                  </div>
                ) : key.toLowerCase() === "rating" ? (
                  <div className="flex items-center">
                    <input
                      type="range"
                      className={`w-3/4 appearance-none rounded-lg overflow-hidden ${!isFirefox() ? 'ring-2 ring-button focus:ring-button-dark bg-theme' : 'bg-theme-dark'}`}
                      min="0"
                      max="10"
                      step="0.1"
                      value={value || 0}
                      onChange={(e) => handleInputChange(key, parseFloat(e.target.value).toFixed(1))}
                    />
                     <span className="ml-2 font-semibold">{isNaN(parseFloat(value)) ? '0.0' : parseFloat(value).toFixed(1)}</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    className="p-1 rounded-md w-3/4 bg-theme ring-2 ring-button focus:ring-button-dark focus:outline-none shadow-inner-dark"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                )}
              </div>
            );
          })}
          {safeDelete && firstDeleteClick && (
            <div className="mb-4 flex flex-col items-center text-red-600">
              <label className="font-bold text-center black-border">
                {`CAUTION: Are you sure you want to delete?`}
                <br />
                {`Enter, 'Delete ${config[0].Title}', to delete:`}
              </label>
              <input
                type="text"
                className="p-1 rounded-md bg-theme focus:ring-button-dark ring-2 ring-button focus:outline-none shadow-inner-dark mt-2 "
                value={confirmTitle}
                onChange={(e) => {
                  setConfirmTitle(e.target.value);
                  setDeleteError('');
                }}
                onKeyDown={handleKeyDownDelete}
              />
              {deleteError && <p className="text-red-600">{deleteError}</p>}
            </div>
          )}
          {loading && (
            <div className="flex justify-center mt-4">
              <SyncLoader color={theme.button_dark} />
            </div>
          )}
          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-button hover:bg-button-dark text-white p-2 rounded mt-4" disabled={loading}>Save Settings</button>
            {handleDelete && (
              <button type="button" onClick={() => handleDelete()} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded mt-4">Delete</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
