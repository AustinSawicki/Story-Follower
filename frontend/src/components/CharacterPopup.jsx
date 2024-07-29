import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ColorPopup from './ColorPopup';
import { PLACEHOLDER_URL } from '../constants';
import { CharacterUpdate, CharacterDelete, ImageUpload, AffiliationDelete } from './utils';
import { useTheme } from './ThemeProvider';

function CharacterPopup({ story, character, onClose }) {
    const [inputs, setInputs] = useState({
        name: character.name,
        affiliation: character.affiliation,
        description: character.description,
        image: character.image,
    });
    const [image, setImage] = useState(null);
    const [affiliations, setAffiliations] = useState([]);
    const [currentAffiliationName, setCurrentAffiliationName] = useState("");
    const [showColorPopup, setShowColorPopup] = useState(false);
    const [edit, setEdit] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (story?.affiliations) {
            setAffiliations(story.affiliations.sort((a, b) => a.name.localeCompare(b.name)));
        }
    }, [story]);

    useEffect(() => {
        if (affiliations) {
            const name = affiliations.find(affil => affil.id === inputs.affiliation)?.name;
            setCurrentAffiliationName(name);
        }
    }, [affiliations, inputs]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (value === 'create-affiliation') {
            setShowColorPopup(true);
        } else {
            setInputs({ ...inputs, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setInputs({ ...inputs, image: URL.createObjectURL(e.target.files[0]) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, affiliation, description } = inputs;

        if (image) {
            await ImageUpload({
                url: `/api/stories/${story.id}/characters/${character.id}/update/`,
                name: "image",
                image
            });
        }
        CharacterUpdate({ ids: [story.id, character.id], onClose, updateData: { name, affiliation, description } });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleColorPopupSubmit = (affiliation) => {
        setAffiliations((prevAffiliations) => {
            const existingAffiliationIndex = prevAffiliations.findIndex((affil) => affil.id === affiliation.id);

            if (existingAffiliationIndex >= 0) {
                // Update existing affiliation
                const updatedAffiliations = [...prevAffiliations];
                updatedAffiliations[existingAffiliationIndex] = affiliation;
                return updatedAffiliations.sort((a, b) => a.name.localeCompare(b.name));
            } else {
                // Add new affiliation
                return [...prevAffiliations, affiliation].sort((a, b) => a.name.localeCompare(b.name));
            }
        });

        setInputs({ ...inputs, affiliation: affiliation.id });
        setEdit(null);
    };

    const handleDeleteAffiliation = (affiliation) => {
        AffiliationDelete({ ids: [story.id, affiliation.id], affiliations, setAffiliations, setInputs, inputs });
    };

    const handleEdit = (affiliation) => {
        setEdit(affiliation);
        setShowColorPopup(true);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-theme-dark p-4 rounded shadow-lg w-full max-w-md md:max-w-md lg:max-w-md h-full max-h-full overflow-y-auto md:h-auto relative mx-4 md:mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="absolute inset-x-0 top-3 flex justify-center text-xl">
                        <input
                            type="text"
                            name="name"
                            className="bg-theme rounded-md text-center text-xl font-bold w-2/3 focus:outline-none focus:border-button-dark border-2 border-button shadow-inner-dark"
                            maxLength={20}
                            value={inputs.name}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">&times;</button>

                    <div className="border-2 border-button rounded-2xl h-64 w-64 flex items-center justify-center mx-auto mt-8">
                        {inputs.image ? (
                            <img src={inputs.image} alt="Character" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <img src={`${PLACEHOLDER_URL}placehold-character.jpg`} alt="Character" className="w-full h-full object-cover rounded-xl" />
                        )}
                    </div>
                    <div className="flex justify-center text-sm mt-2 mb-3">
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
                            {currentAffiliationName ? currentAffiliationName : 'Select Affiliation'}
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            MenuListProps={{
                                sx: {
                                    backgroundColor: theme.theme_default,
                                    border: 2,
                                    borderColor: theme.button_default,
                                    boxShadow: 5,
                                }
                            }}
                        >
                            <MenuItem onClick={() => { setInputs({ ...inputs, affiliation: null }); handleClose(); }}>
                                <div className="flex justify-between items-center w-full">
                                    <span>Select Affiliation</span>
                                </div>
                            </MenuItem>
                            {affiliations.map(affiliation => (
                                <MenuItem key={affiliation.id} onClick={() => { setInputs({ ...inputs, affiliation: affiliation.id }); handleClose(); }}>
                                    <div className="flex justify-between items-center w-full">
                                        <span>{affiliation.name}</span>
                                        <div>
                                            <button
                                                type="button"
                                                className="text-button hover:text-button-dark mx-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(affiliation);
                                                    handleClose();
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAffiliation(affiliation);
                                                    handleClose();
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </MenuItem>
                            ))}
                            <MenuItem onClick={() => { setShowColorPopup(true); handleClose(); }}><span>Create Affiliation</span></MenuItem>
                        </Menu>
                    </div>
                    <div className="mb-4 flex justify-center">
                        <input type="file" className="bg-theme border-2 border-button hover:border-button-dark p-1 rounded-md cursor-pointer shadow-inner-dark" onChange={handleImageChange} />
                    </div>
                    <div className="mb-4">
                        <textarea
                            name="description"
                            className="p-1 bg-theme w-full resize-none h-80 focus:ring-0 focus:outline-none border-2 border-button focus:border-button-dark shadow-inner-dark custom-scrollbar"
                            value={inputs.description}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder='Description...'
                            maxLength={1000}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button type="submit" className="bg-button text-white p-2 rounded">Save</button>
                        <button type="button" onClick={(e) => {
                            CharacterDelete({ ids: [story.id, character.id], onClose: onClose });
                        }
                        }
                            className="bg-red-500 text-white p-2 rounded"
                        >Delete</button>
                    </div>
                </form>
            </div>
            {showColorPopup && (
                <ColorPopup
                    ids={[story.id, edit?.id]}
                    title={"Affiliation"}
                    itemList={affiliations}
                    edit={edit}
                    onClose={() => {
                        setShowColorPopup(false);
                        setEdit(null);
                    }}
                    popupSubmit={handleColorPopupSubmit}
                />
            )}
        </div>
    );
}

export default CharacterPopup;
