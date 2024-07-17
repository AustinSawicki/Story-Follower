import Chapter from "./Chapter";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
function SortableChapter({ storyId, chapter, onUpdate, activeId }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: chapter.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: activeId === chapter.id ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Chapter storyId={storyId} chapter={chapter} onUpdate={onUpdate} dragListeners={listeners} />
        </div>
    );
}

export default SortableChapter