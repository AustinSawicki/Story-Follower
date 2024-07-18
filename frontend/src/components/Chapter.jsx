import React, { useState, useEffect, useRef } from 'react';
import Settings from './Settings';
import Popup from './Popup';
import ChapterDelete from './utils/ChapterDelete';
import ChapterUpdate from './utils/ChapterUpdate';

function Chapter({ storyId, chapter, onUpdate, dragListeners }) {
    const [showPopup, setShowPopup] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [chapter.description]);

    const handleOpenPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    return (
        <div className="p-4 w-full relative bg-theme-dark rounded-xl mt-3">
            <div className="drag-handle" {...dragListeners}>
                <div className="mb-2">
                    <strong>{chapter.title}</strong>
                </div>
                <div className="mb-2">
                    <textarea
                        ref={textareaRef}
                        className="w-full h-auto text-md rounded resize-none bg-theme-dark"
                        value={chapter.description || ""}
                        disabled
                    />
                </div>
            </div>
            <Settings openPopup={handleOpenPopup} size={"2xl"} />
            {showPopup && (
                <Popup
                    ids={[storyId, chapter.id]}
                    name="Chapter"
                    config={[
                        { "Title": chapter.title },
                        { "Description": chapter.description }
                    ]}
                    onClose={handleClosePopup}
                    onUpdate={ChapterUpdate}
                    onDelete={() => { ChapterDelete({ ids: [storyId, chapter.id], onClose: handleClosePopup }) }}
                />
            )}
        </div>
    );
};

export default Chapter;