import React, { useState, useEffect, useRef } from 'react';
import Settings from './Settings';
import Popup from './Popup';
import ChapterDelete from './utils/ChapterDelete';
import ChapterUpdate from './utils/ChapterUpdate';

function Chapter({ storyId, chapter, onUpdate, dragListeners }) {
    const [showPopup, setShowPopup] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        if (textRef.current) {
            textRef.current.style.height = 'auto';
            textRef.current.style.height = `${textRef.current.scrollHeight}px`;
        }
    }, [chapter.description]);

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
                    <p
                        ref={textRef}
                        className="w-full h-auto text-md rounded bg-theme-dark description-box"
                    >
                        {chapter.description || ""}
                    </p>
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
};

export default Chapter;