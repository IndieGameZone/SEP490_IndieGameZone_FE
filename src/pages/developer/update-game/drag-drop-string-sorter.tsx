import { SortableImage } from "@/types/game";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DragDropStringSorterProps {
  items: SortableImage[];
  onSorted?: (sorted: SortableImage[]) => void;
  onRemove?: (id: string) => void;
}

function DragDropStringSorter({
  items,
  onSorted,
  onRemove,
}: DragDropStringSorterProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onSorted?.(newItems);
    }
  };

  return (
    <div className="mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <ul className="grid grid-cols-4 gap-3">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                url={item.url}
                onRemove={onRemove}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({
  id,
  url,
  onRemove,
}: {
  id: string;
  url: string;
  onRemove?: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="relative">
      <div
        className="bg-zinc-800 border shadow rounded cursor-grab active:cursor-grabbing select-none overflow-hidden"
        {...attributes}
        {...listeners}
      >
        <img src={url} alt="" className="aspect-video" />
      </div>
      <button
        onClick={() => onRemove?.(id)}
        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded hover:bg-red-700 cursor-pointer "
      >
        ✕
      </button>
    </li>
  );
}
export default DragDropStringSorter;
