import React, { useState } from 'react';
import Settings from './Settings';
import api from '../api';
import Popup from './Popup';
import CharacterPopup from './CharacterPopup';
import CharacterDelete from './utils/CharacterDelete';
import CharacterUpdate from './utils/CharacterUpdate';

function CharacterCard({ storyId, character, onUpdate }) {
    const [showPopup, setShowPopup] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleImageUpload = () => {
        const formData = new FormData();
        formData.append('image', image);
        api.patch(`/api/stories/${storyId}/characters/${character.id}/update/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            if (res.status === 200) {
                console.log("Image updated!");
                onUpdate();
                closePopup();
            } else {
                console.log("Failed to update image.");
            }
        })
        .catch((err) => alert(err));
    };

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        onUpdate();
    };

    return (
        <div className="border p-4 w-64 h-128 relative bg-dark_beige rounded-xl">
            <div className="absolute inset-x-0 top-0 flex justify-center text-lg">
                 <strong>{character.name}</strong>
            </div>
            <Settings openPopup={openPopup} size={"2xl"}/>
            <div className="border-2 border-oak rounded-2xl h-32 ml-12 w-32 flex items-center justify-center mx-auto mt-2 ">
                {character.image ? (
                    <img src={character.image} alt="Character" className="w-full h-full object-cover rounded-xl" />
                ) : (
                    <img src={`${import.meta.env.VITE_API_URL}media/placeholder/placehold-character.jpg`} alt="Character" className="w-full h-full object-cover rounded-xl" />
                )}
            </div>
            <div className="flex justify-center text-sm mt--2 mb-3">
                {character.group}
            </div>

            <strong>Description: </strong>
            <p className="text-sm break-words text-overflow-ellipsis overflow-ellipsis overflow-hidden">{character.description}</p>


            {showPopup && (
                <CharacterPopup
                    storyId={storyId}
                    character={character}
                    onClose={closePopup}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
}

export default CharacterCard;