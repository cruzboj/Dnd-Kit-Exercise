import { useState } from "react";
import type { Item, Container } from "../components/Dnd/types";

import type { 
  DragStartEvent,
  DragOverEvent, 
  DragEndEvent, 
  DragCancelEvent, 
  UniqueIdentifier 
} from "@dnd-kit/core";

import { arrayMove } from "@dnd-kit/sortable";

export function useContainers(initial: Container[]) {
  const [containers, setContainers] = useState<Container[]>(initial);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // --------------------------------------------
  // FIND CONTAINER BY ITEM OR CONTAINER ID
  // --------------------------------------------
  function findContainerId(itemId: UniqueIdentifier): UniqueIdentifier | undefined {
    // if it's a container itself
    if (containers.some((c) => c.id === itemId)) {
      return itemId;
    }
    // else find which container holds the item
    return containers.find((c) => c.items.some((item) => item.id === itemId))?.id;
  }

  // --------------------------------------------
  // GET ACTIVE ITEM OBJECT
  // --------------------------------------------
  function getActiveItem(): Item | undefined {
    if (!activeId) return undefined;

    const containerId = findContainerId(activeId);
    if (!containerId) return undefined;

    const container = containers.find((c) => c.id === containerId);
    return container?.items.find((item) => item.id === activeId);
  }

  // --------------------------------------------
  // DRAG START
  // --------------------------------------------
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  // --------------------------------------------
  // DRAG CANCEL
  // --------------------------------------------
  function handleDragCancel(_event: DragCancelEvent) {
    setActiveId(null);
  }

  // --------------------------------------------
  // DRAG OVER (ITEM MOVING BETWEEN CONTAINERS)
  // --------------------------------------------
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeContainerId = findContainerId(active.id);
    const overContainerId = findContainerId(over.id);

    if (!activeContainerId || !overContainerId) return;
    if (activeContainerId === overContainerId) return; // same container, no cross-move

    setContainers((prev) => {
      const activeContainer = prev.find((c) => c.id === activeContainerId)!;
      const overContainer = prev.find((c) => c.id === overContainerId)!;

      const activeIndex = activeContainer.items.findIndex((i) => i.id === active.id);

      // remove from active container
      const activeItem = activeContainer.items[activeIndex];
      const newActiveItems = [...activeContainer.items];
      newActiveItems.splice(activeIndex, 1);

      // insert into over container
      const newOverItems = [...overContainer.items];
      const overIndex = overContainer.items.findIndex((i) => i.id === over.id);

      newOverItems.splice(overIndex + 1, 0, activeItem);

      return prev.map((c) => {
        if (c.id === activeContainerId) {
          return { ...c, items: newActiveItems };
        }
        if (c.id === overContainerId) {
          return { ...c, items: newOverItems };
        }
        return c;
      });
    });
  }

  // --------------------------------------------
  // DRAG END (REORDERING IN SAME CONTAINER)
  // --------------------------------------------
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeContainerId = findContainerId(active.id);
    const overContainerId = findContainerId(over.id);
    if (!activeContainerId || !overContainerId) return;

    // same container reorder
    if (activeContainerId === overContainerId) {
      setContainers((prev) =>
        prev.map((c) => {
          if (c.id !== activeContainerId) return c;

          const oldIndex = c.items.findIndex((i) => i.id === active.id);
          const newIndex = c.items.findIndex((i) => i.id === over.id);

          return {
            ...c,
            items: arrayMove(c.items, oldIndex, newIndex),
          };
        })
      );
    }

    setActiveId(null);
  }

  return {
    containers,
    activeId,
    getActiveItem,
    findContainerId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    setContainers,
  };
}