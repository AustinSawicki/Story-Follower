import React, { useState } from 'react';
import CharacterDelete from './utils/CharacterDelete';
import api from '../api';
import { PLACEHOLDER_URL } from '../constants';

function CharacterPopup({ storyId, character, onClose, onUpdate }) {
    const [inputs, setInputs] = useState({
        name: character.name,
        group: character.group,
        description: character.description,
        image: character.image,
    });
    const [image, setImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setInputs({ ...inputs, image: URL.createObjectURL(e.target.files[0]) });
    };

    const handleImageUpload = () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('image', image);
        return api.patch(`/api/stories/${storyId}/characters/${character.id}/update/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, group, description } = inputs;

        Promise.all([
            api.patch(`/api/stories/${storyId}/characters/${character.id}/update/`, { name, group, description }),
            handleImageUpload()
        ])
        .then((responses) => {
            if (responses[0].status === 200) {
                onUpdate();
                onClose();
            } else {
                console.log("Failed to update character.");
            }
        })
        .catch((err) => alert(err));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-theme-dark p-4 rounded shadow-lg w-256 h-512 relative">
            <form onSubmit={handleSubmit}>
                <div className="absolute inset-x-0 top-3 flex justify-center text-xl">
                    <input
                        type="text"
                        name="name"
                        className="rounded-md bg-transparent text-center text-xl font-bold w-2/3 focus:ring-0 focus:outline-none focus:border-button focus:border-2 shadow-inner-dark"
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
                        <input
                            type="text"
                            name="group"
                            className="p-1 rounded-sm bg-transparent text-center text-sm focus:ring-0 focus:outline-none focus:border-button focus:border-2 shadow-inner-dark"
                            value={inputs.group}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            maxLength={30}
                        />
                    </div>
                    <div className="mb-4 flex justify-center">
                        <input type="file" className=" p-2 rounded cursor-pointer" onChange={handleImageChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description"><strong>Description: </strong></label>
                    <textarea
                            name="description"
                            className="p-1 w-full bg-transparent resize-none h-80 focus:ring-0 focus:outline-none focus:border-button focus:border-2 shadow-inner-dark custom-scrollbar" 
                            value={inputs.description}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            rows="4"
                            maxLength={1000}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button type="submit" className="bg-button text-white p-2 rounded">Save</button>
                        <button type="button" onClick={(e) => {
                                CharacterDelete({ids: [storyId, character.id], onClose: onClose})
                            }
                        } 
                            className="bg-red-500 text-white p-2 rounded"
                        >Delete</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CharacterPopup;