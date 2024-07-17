import React, { useState, useEffect } from 'react';
import Settings from './Settings';
import CharacterPopup from './CharacterPopup';
import { PLACEHOLDER_URL } from '../constants';

function CharacterCard({ story, character, onUpdate }) {
    const [showPopup, setShowPopup] = useState(false);
    const [affiliation, setAffiliation] = useState("")
    const [borderColor, setBorderColor] = useState("")

    useEffect(() => {
        if (story && story.affiliations) {
            const affiliation = story.affiliations.find(affil => affil.id === character.affiliation);
            if(affiliation){
                setAffiliation(affiliation.name);
                setBorderColor(affiliation.color);
            }
            else {
                setAffiliation("");
                setBorderColor("")
            }
            
        }
    }, [story, character]);
    

    useEffect(() => {
        if (showPopup) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [showPopup]);

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        onUpdate();
    };

    return (
        <div className={`${borderColor ? "border-2" : ""}  p-4 w-64 h-128 relative bg-theme-dark rounded-xl`}
             style={{ borderColor: borderColor }}
        >   
            <div className="absolute inset-x-0 top-0 flex justify-center text-lg">
                 <strong>{character.name}</strong>
            </div>
            <Settings openPopup={openPopup} size={"2xl"}/>
            <div className="border-2 border-button rounded-2xl h-32 ml-12 w-32 flex items-center justify-center mx-auto mt-2 ">
                {character.image ? (
                    <img src={character.image} alt="Character" className="w-full h-full object-cover rounded-xl" />
                ) : (
                    <img src={`${PLACEHOLDER_URL}placehold-character.jpg`} alt="Character" className="w-full h-full object-cover rounded-xl" />
                )}
            </div>
            <div className="flex justify-center text-sm mt--2 mb-3">
                {affiliation}
            </div>

            <strong>Description: </strong>
            <p className="text-sm break-words text-overflow-ellipsis overflow-ellipsis overflow-hidden">{character.description}</p>


            {showPopup && (
                <CharacterPopup
                    story={story}
                    character={character}
                    onClose={closePopup}
                />
            )}
        </div>
    );
}

export default CharacterCard;