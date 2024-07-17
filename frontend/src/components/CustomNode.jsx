import React from 'react';
import { Handle } from 'react-flow-renderer';
import Settings from './Settings';
import { RiSettings4Fill } from "react-icons/ri";

const CustomNode = ({ data }) => {
    return (
        <div className="bg-theme p-2 rounded border-2 border-button relative" style={{ width: '200px' }}>
            <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-center">{data.label}</p>
            <p>{data.description}</p>
            <RiSettings4Fill onClick={data.onClick} className="absolute font-bold text-sm top-3 right-2 text-button rounded-full hover:text-button-dark cursor-pointer" />
            <Handle type="target" position="top" />
            <Handle type="source" position="bottom" />
        </div>
    );
};

export default CustomNode;
