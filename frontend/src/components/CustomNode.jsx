import React, { useEffect, useRef } from 'react';
import { Handle } from 'react-flow-renderer';
import Settings from './Settings';
import { RiSettings4Fill } from "react-icons/ri";

const CustomNode = ({ data }) => {
    const textareaRef = useRef(null);
    const nodeRef = useRef(null);

    useEffect(() => {
        const adjustHeight = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
            if (nodeRef.current) {
                nodeRef.current.style.height = 'auto';
                nodeRef.current.style.height = `${textareaRef.current.scrollHeight + 40}px`; // Adjust 50px based on other contents height
            }
        };
        
        adjustHeight();
    }, [data.description]);

    return (
        <div
            ref={nodeRef}
            className="bg-theme p-2 rounded border-2 border-button relative h-auto"
            style={{ width: '200px' }}
        >
            <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-center">
                {data.label}
            </p>
            <textarea
                ref={textareaRef}
                className="w-full h-auto font-semibold text-sm rounded resize-none bg-theme"
                value={data.description || ""}
                disabled
                placeholder=""
            />
            <RiSettings4Fill
                onClick={data.onClick}
                className="absolute font-bold text-sm top-3 right-2 text-button rounded-full hover:text-button-dark cursor-pointer"
            />
            <Handle type="target" position="top" />
            <Handle type="source" position="bottom" />
        </div>
    );
};

export default CustomNode;
