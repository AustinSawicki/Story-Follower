import React, { useState, useEffect } from 'react';
import Settings from './Settings';
import Popup from './Popup';
import ChapterDelete from './utils/ChapterDelete';
import ChapterUpdate from './utils/ChapterUpdate';

function Chapter({ storyId, chapter, onUpdate, dragListeners }) {
    const [showPopup, setShowPopup] = useState(false);

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
        <div className="p-4 w-full relative bg-theme-dark rounded-xl mt-3">
            <div className="drag-handle" {...dragListeners}>
                <div className="mb-2">
                    <strong>{chapter.title}</strong>
                </div>
                <div className="mb-2">
                    <strong>Description:</strong> {chapter.description}
                </div>
            </div>
            <Settings openPopup={openPopup} size={"2xl"} />
            {showPopup && (
                <Popup
                    ids={[storyId, chapter.id]}
                    name="Chapter"
                    config={[
                        { "Title": chapter.title },
                        { "Description": chapter.description }
                    ]}
                    onClose={closePopup}
                    onUpdate={ChapterUpdate}
                    onDelete={() => { ChapterDelete({ ids: [storyId, chapter.id], onClose: closePopup }) }}
                />
            )}
        </div>
    );
}

export default Chapter;