import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlowProvider
  } from 'react-flow-renderer';
import api from '../api';
import ChapterUpdate from '../components/utils/ChapterUpdate';
import ChapterDelete from '../components/utils/ChapterDelete';
import Popup from '../components/Popup'; 

function StoryTree() {
    const { id } = useParams();
    const [story, setStory] = useState({});
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);

    useEffect(() => {
        getStory()
        getChapters();
    }, [id]);

    useEffect(() => {
        if (chapters.length > 0) {
            getNodes();
        }
    }, [chapters]);

    const getStory = () => {
        api.get(`/api/stories/${id}`)
            .then((res) => res.data)
            .then((data) => {
                setStory(data);
                console.log(story)
            })
            .catch((err) => alert(err));
    };

    const getChapters = () => {
        api.get(`/api/stories/${id}/chapters/`)
            .then((res) => res.data)
            .then((data) => {
                setChapters(data);
            })
            .catch((err) => alert(err));
    };


    const getNodes = () => {
        const nodes = chapters.map((chapter, index) => ({
            id: chapter.id.toString(),
            data: {
                label: (
                    <div className="relative">
                        <p className="font-bold">{chapter.title}</p>
                        <p>{chapter.description}</p>
                        <button
                            onClick={() => openPopup(chapter)}
                            className="absolute top-0 right-0 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-800 font-bold"
                        >
                            ⋮
                        </button>
                    </div>
                ),
                description: chapter.description,
            },
            position: { x: index * 200, y: index * 100 },
        }));

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
        getChapters();
    };
    const onNodeDragStop = (event, node) => {
        console.log('Node dragged to:', node.position);
        // Optionally, you can update the node position in your backend or state here
      };

    return (
        <div className="relative h-[600px]">
            <Link to={`/stories/${id}`} className="text-m font-bold p-5">
                    ← {story.title}
            </Link>
            <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={onNodeDragStop}
            className="bg-[#e5e5c2]"
            fitView
            >
                <Controls />
                <Background color="#000" gap={16} />
            </ReactFlow>
            {showPopup && selectedChapter && (
                <Popup
                    ids={[id, selectedChapter.id]}
                    config={[
                        { "Title": selectedChapter.title },
                        { "Description": selectedChapter.description }
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