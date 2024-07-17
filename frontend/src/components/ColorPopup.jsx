import React, { useState, useEffect } from 'react';
import { AffiliationCreate, AffiliationUpdate, ThemeCreate, ThemeUpdate } from './utils';
import getThemeData from './ThemeDataConversion';

function ColorPopup({ ids, title, itemList, edit, onClose, popupSubmit }) {
    const [name, setName] = useState(edit ? edit.name : '');
    const [color, setColor] = useState('#000000');
    const [buttonColor, setButtonColor] = useState('#000000');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (edit) {
            if (title === "Affiliation") {
                setColor(edit.name);
            } else {
                setColor(edit.theme_default);
                setButtonColor(edit.button_default);
            }
        }
    }, [edit, title]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setErrorMessage('Name is required.');
            return;
        }

        const isDuplicate = itemList.some(item => item.name.toLowerCase() === name.trim().toLowerCase() && item.id !== edit?.id);
        if (isDuplicate ) {
            setErrorMessage(`${title}'s cannot have two of the same name.`);
            return;
        }

        setErrorMessage('');
        if (title === "Affiliation") {
            if (edit) {
                AffiliationUpdate({ ids, name, color, onClose, popupSubmit });
            } else {
                AffiliationCreate({ ids, name, color, onClose, popupSubmit });
            }
        } else {
            const themeData = getThemeData({ name, color, buttonColor });
            if (edit) {
                ThemeUpdate({ id: edit.id, themeData, onClose, popupSubmit });
            } else {
                ThemeCreate({ themeData, onClose, popupSubmit });
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-theme-dark p-4 rounded shadow-lg w-256 relative">
                <div className="absolute inset-x-0 top-3 flex justify-center text-xl">
                    <strong>{edit ? "Edit" : "Create"} {title} </strong>
                </div>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">&times;</button>
                <div className="mt-8">
                    <label className="mr-4" htmlFor="name"><strong>Name: </strong></label>
                    <input
                        type="text"
                        id="name"
                        className="p-1 rounded-md bg-theme w-3/4 ring-2 ring-button focus:ring-button-dark focus:outline-none shadow-inner-dark"
                        value={name}
                        maxLength="25"
                        onChange={(e) => { setName(e.target.value); setErrorMessage(''); }}
                        onKeyPress={handleKeyDown}
                        required
                    />
                </div>
                {errorMessage && (
                    <div className="ml-20 text-red-500 text-sm mt-2 black-border">
                        {errorMessage}
                    </div>
                )}
                <div className="mt-4">
                    <label className="mr-4" htmlFor="color"><strong>Color: </strong></label>
                    <input
                        type="color"
                        id="color"
                        className="rounded-md bg-theme w-3/4 ring-2 ring-button focus:ring-button-dark"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        onKeyPress={handleKeyDown}
                        required
                    />
                </div>
                {title === "Theme" && (
                    <div className="mt-4">
                        <label className="mr-2" htmlFor="buttonColor"><strong>Button: </strong></label>
                        <input
                            type="color"
                            id="buttonColor"
                            className="rounded-md bg-theme w-3/4 ring-2 ring-button focus:ring-button-dark"
                            value={buttonColor}
                            onChange={(e) => setButtonColor(e.target.value)}
                            onKeyPress={handleKeyDown}
                            required
                        />
                    </div>)}
                <div className="mt-4 flex justify-between">
                    <button type="button" onClick={handleSubmit} className="bg-button text-white p-2 rounded">
                        {edit ? "Edit" : "Create"}
                    </button>
                    <button type="button" onClick={onClose} className="bg-red-500 text-white p-2 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ColorPopup;
