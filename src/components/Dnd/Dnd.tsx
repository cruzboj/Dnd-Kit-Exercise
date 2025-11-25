import React from 'react'

import { 
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import type { Container } from "./types";
import { useContainers } from '../../hooks/useContainers';

import DroppableContainer from './DroppableContainer';
import ItemOverlay from './ItemOverlay';

export default function BasicDragDrop({children}: { children: React.ReactNode } ) {
  /*
    Take Children and render them as array of items in the OuterItems container
    will have two containers: 
    + OuterItems
    + innerItems
    
  */
  const childrenArray = React.Children.toArray(children);
  const initialContainers: Container[] = [
    {
      id: 'OuterItems',
      title: 'OuterItems',
      items: childrenArray.map((child, index) => ({
        id: `${index + 1}`,
        content: child,
      })),
    },
    {
      id: 'innerItems',
      title: 'innerItems',
      items: [],
    },
  ];
  
  const {
    containers,
    activeId,
    getActiveItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useContainers(initialContainers);

  const sensors = useSensors(
    useSensor(PointerSensor,
      {activationConstraint: {
        distance: 1 //8px of movement required
      },
      
    })
  )

  return (
    <div className="mx-auto w-full h-full bg-red-400/0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        
      >
      <div className="flex flex-col gap-4 h-full">
        {containers.map((container,index) => (
          <DroppableContainer
            key={container.id}
            id={container.id}
            title={container.title}
            items={container.items}
            index={index}
          />
        ))}
      </div>
      
    <DragOverlay
      dropAnimation={{
        duration: 250,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}
    >
      {activeId ? (
        <ItemOverlay>
          {getActiveItem()?.content}
        </ItemOverlay>
      ): null}
    </DragOverlay>
      </DndContext>
    </div>
  )
}
