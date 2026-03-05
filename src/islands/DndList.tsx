import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { useComputed, useSignal } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { type ReactNode } from "preact/compat";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableCardProps {
  id: string;
  children: ReactNode;
}
function SortableCard({ id, children }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    cursor: "grab",
  };

  return (
    // @ts-ignore role?
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

const INITIAL_ITEMS = [
  {
    id: "1",
    title: "Redesign the onboarding flow for mobile users",
    tag: "Design",
    avatar: { initials: "AL", bg: "#DBEAFE", text: "#1D4ED8" },
  },
  {
    id: "2",
    title: "Audit API rate limiting across all endpoints",
    tag: "Dev",
    avatar: { initials: "MK", bg: "#D1FAE5", text: "#065F46" },
  },
  {
    id: "3",
    title: "Conduct user interviews for the new dashboard",
    tag: "Research",
    avatar: { initials: "SP", bg: "#FCE7F3", text: "#9D174D" },
  },
  {
    id: "4",
    title: "Review PR #284 — auth middleware refactor",
    tag: "Review",
    avatar: { initials: "JR", bg: "#FEF3C7", text: "#92400E" },
  },
  {
    id: "5",
    title: "Write integration tests for checkout flow",
    tag: "QA",
    avatar: { initials: "TW", bg: "#EDE9FE", text: "#5B21B6" },
  },
  {
    id: "6",
    title: "Update component library to v3 tokens",
    tag: "Design",
    avatar: { initials: "AL", bg: "#DBEAFE", text: "#1D4ED8" },
  },
];

export default function DndList() {
  const items = useSignal(INITIAL_ITEMS);
  const activeId = useSignal<string | null>(null);

  const activeItem = useComputed(() =>
    items.value.find((i) => i.id === activeId.value),
  );

  const ids = useComputed(() => items.value.map((i) => i.id));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart({ active }: any) {
    activeId.value = active.id;
  }

  function handleDragEnd({ active, over }: any) {
    activeId.value = null;
    if (!over || active.id === over.id) return;
    const prev = items.value;
    const oldIndex = prev.findIndex((i) => i.id === active.id);
    const newIndex = prev.findIndex((i) => i.id === over.id);

    items.value = arrayMove(prev, oldIndex, newIndex);
  }

  return (
    <div class="flex flex-col w-30 bg-content-200">
      {/* Cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ids.value}
          strategy={verticalListSortingStrategy}
        >
          <div class="flex flex-col gap-2">
            <For each={items}>
              {(item: any) => (
                <SortableCard id={item.id} key={item.id}>
                  {item.title}
                </SortableCard>
              )}
            </For>
          </div>
        </SortableContext>

        {/* Drag Overlay: renders a "floating" clone while dragging */}
        <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
          {activeItem ? (
            <div
              style={{
                transform: "rotate(2deg)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                borderRadius: 10,
              }}
            >
              {activeItem.value?.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
