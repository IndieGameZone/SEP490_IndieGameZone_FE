import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";

import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DragDropStringSorterProps {
  items: string[];
  onSorted?: (sorted: string[]) => void;
}

function DragDropStringSorter({
  items: initialItems,
  onSorted,
}: DragDropStringSorterProps) {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onSorted?.(newItems);
    }
  };

  return (
    <div className="mx-auto mt-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <ul className="grid grid-cols-4 gap-3">
            {items.map((item) => (
              <SortableItem key={item} id={item} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({ id }: { id: string }) {
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
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="bg-zinc-800 border shadow rounded cursor-grab active:cursor-grabbing select-none overflow-hidden">
        <img src={id} alt="" className="aspect-video" />
      </div>
    </li>
  );
}
export default DragDropStringSorter;
