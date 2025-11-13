import React , { useState, type ReactNode } from 'react'

import { 
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  type UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'

import {CSS} from '@dnd-kit/utilities'

interface Item {
  id: string
  content: ReactNode
}

interface Container {
  id: string
  title: string
  items: Item[]
}

function DroppableContainer({ id, title, items, index}: { id: string; title: string; items: Item[]; index: number}) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`relative flex ${index === 0 ? 'h-[80%]' : 'h-[20%]'} flex-col rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 bg-red-800 `}
    >
      <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200">
        {title}
      </h3>
      
      <div className="h-full flex-1 bg-green-300/0">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={horizontalListSortingStrategy}
        >
          <ul className="relative h-full flex flex-row gap-2 bg-blue-500 m-0 p-0 list-none">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} content={item.content} index={index}/>
            ))}


            {items.length === 0 && (
              <div className="flex w-full h-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drop items here
                </p>
              </div>
            )}
          </ul>
        </SortableContext>
      </div>
    </div>
  )
}

function SortableItem({id,content,index}: {id: UniqueIdentifier , content: ReactNode , index: number}){
  const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
  } = useSortable({id})
  
  // If index is 1 (innerItems), apply smaller scale
  // const isInnerContainer = index === 1;
  
const style = {
  transform: CSS.Transform.toString({ 
    x: transform?.x ?? 0,
    y: transform?.y ?? 0, 
    scaleX: 1, 
    scaleY: 1, 
  }),

  transition,                           
};

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={
        `cursor-grab
        toutch-none 
        rounded 
        border 
        bg-white 
        p-3 
        dark:border-gray-700 
        dark:bg-green-500
        ${isDragging ? 'z-10 opacity-85 ' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="dark:text-gray-200">{content}</span>
      </div>
    </li>
  )
}

export default function BasicDragDrop({children}: { children: React.ReactNode } ) {
  const childrenArray = React.Children.toArray(children);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  void activeId; //remove the active id warning
  const [containers, setContainers] = useState<Container[]>([
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
    }
    // {
    //   id: 'outerItems',
    //   title: 'outerItems',
    //   items: [
    //     { id: 'task-1', content: 'item1' },
    //     { id: 'task-2', content: 'item2' },
    //     { id: 'task-3', content: 'item3' },
    //     { id: 'task-4', content: 'item4' },
    //   ],
    // },
    // {
    //   id: 'innerItems',
    //   title: 'innerItems',
    //   items: [
    //     { id: 'task-6', content: 'item6' },
    //     { id: 'task-7', content: 'item7' },
    //   ],
    // },
  ])
  void setContainers
  
  function findContainerId(itemId: UniqueIdentifier) : UniqueIdentifier | undefined {
    if(containers.some((container) => container.id === itemId)) { return itemId}
    return containers.find((container) => container.items.some((item) => item.id === itemId),)?.id
  }

  function handleDragStart(event: DragStartEvent){
    setActiveId(event.active.id)
  }
  
  function handleDragOver(event: DragOverEvent){
    const {active , over} = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeContainerId = findContainerId(activeId)
    const overContainerId = findContainerId(overId)

    if(!activeContainerId || !overContainerId) return

    if(activeContainerId === overContainerId) return
    
    setContainers((prev) => {
      const activeContainer = prev.find((c) => c.id === activeContainerId)
      if(!activeContainer) return prev

      const activeItem = activeContainer.items.find((item) => item.id === activeId)
      if(!activeItem) return prev

      const newContainer = prev.map((container) => {
        if(container.id === activeContainerId) {
          //remove item from its old container
          
          return {
            ...container,
            items: container.items.filter((item) => item.id !== activeId)
          }
        }

        if (container.id === overContainerId){
          if(overId === overContainerId) {
            return {
              ...container,
              items:[...container.items,activeItem],
            }
          }
        }

        const overItemIndex = container.items.findIndex((item) => item.id === overId)
        if(overItemIndex !== -1){
           // insert the item into the new container
          return {
            ...container,
            items: [
              ...container.items.slice(0,overItemIndex + 1),
              activeItem,
              ...container.items.slice(overItemIndex + 1)
            ],
          }
        }
        return container
      })
      // console.log("moved container (newContainer): ",newContainer);
      return newContainer
    })

  }


  function handleDragEnd(event: DragEndEvent){
    const { active , over} = event

    if(!over){
      setActiveId(null)
      return
    }

    const activateContainerId = findContainerId(active.id)
    const overContainerId = findContainerId(over.id)

    if(!activateContainerId || !overContainerId){
      setActiveId(null)
      return
    }

    if(activateContainerId === overContainerId && active.id !== over.id){
      const containerIndex = containers.findIndex((c) => c.id === activateContainerId, )

      if(containerIndex === -1){
        setActiveId(null)
        return
      }
      const container = containers[containerIndex]
      const activeIndex = container.items.findIndex((item) => item.id === active.id)
      const overIndex =  container.items.findIndex((item) => item.id === over.id)

      if(activeIndex !== -1 && overIndex !== -1){
        const newItems = arrayMove(container.items,activeIndex,overIndex)

        setContainers((containers) => {
          return containers.map((c,i) => {
            if(i === containerIndex){
              return {...c , items: newItems}
            }
            return c
          })
        })
      }
    }
    setActiveId(null)
  }

  const sensors = useSensors(
    useSensor(PointerSensor,
      {activationConstraint: {
        distance: 2 //8px of movement required
      },
      
    })
  )

    return (
    <div className="mx-auto w-full h-full bg-red-400/0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
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
      </DndContext>
    </div>
  )
}
