import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlowProvider
  } from 'react-flow-renderer';
import api from '../api';
import { ChaptersGet, StoryGet, ChapterUpdate, ChapterDelete } from '../components/utils';
import Popup from '../components/Popup'; 
import { useTheme } from '../components/ThemeProvider';

function StoryTree() {
    const { id } = useParams();
    const { updateTheme } = useTheme();
    const [story, setStory] = useState({});
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);

    useEffect(() => {
        StoryGet({id, setStory});
        ChaptersGet({id, setChapters});
    }, [id]);

    useEffect(() => {
        if (chapters.length > 0) {
            getNodes();
        }
    }, [chapters]);

    useEffect(() => {
        if (story && story.theme) {
            updateTheme(story.theme);
        }
    }, [story]);

    const getNodes = () => {
        const nodes = chapters.map((chapter, index) => {
            let position = { x: index * 200, y: index * 100 };
            if (index > 0) {
                const prevChapter = chapters[index - 1];
                position = { x: (prevChapter.x || 0) + 200, y: (prevChapter.y || 0) + 100 };
            }
            return {
                id: chapter.id.toString(),
                data: {
                    label: (
                        <div className="relative">
                            <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">{chapter.title}</p>
                            <p>{chapter.short_description}</p>
                            <button
                                onClick={() => openPopup(chapter)}
                                className="absolute top-0 right-0 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-800 font-bold"
                            >
                                ⋮
                            </button>
                        </div>
                    ),
                    description: chapter.short_description,
                },
                position: { x: chapter.x || position.x, y: chapter.y || position.y },
            };
        });

        setNodes(nodes);

        const edges = chapters.slice(1).map((chapter, index) => ({
            id: `e${chapters[index].id}-${chapter.id}`,
            source: chapters[index].id.toString(),
            target: chapter.id.toString(),
            type: 'smoothstep',
        }));

        setEdges(edges);
    };

    const openPopup = (chapter) => {
        setSelectedChapter(chapter);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedChapter(null);
        ChaptersGet({id, setChapters});
    };

    const onNodeDragStop = (event, node) => {
        ChapterUpdate({ ids: [id, node.id], updateData: { x: node.position.x, y: node.position.y } });
    };

    return (
        <div className="relative h-[600px]">
            <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={onNodeDragStop}
            className="bg-theme-dark"
            fitView
            >
                <Controls />
                <Background color="#000" gap={16} />
            </ReactFlow>
            {showPopup && selectedChapter && (
                <Popup
                    ids={[id, selectedChapter.id]}
                    name={selectedChapter.title}
                    config={[
                        { "Title": selectedChapter.title },
                        { "Short_description": selectedChapter.short_description }
                    ]}
                    onClose={closePopup}
                    onUpdate={ChapterUpdate}
                    onDelete={ChapterDelete}
                />
            )}
        </div>
    );
}

export default StoryTree;