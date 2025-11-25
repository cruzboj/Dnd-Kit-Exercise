
import {useSortable,} from '@dnd-kit/sortable'
import { type UniqueIdentifier,} from "@dnd-kit/core";
import { type ReactNode } from 'react'
import {CSS} from '@dnd-kit/utilities'

export default function SortableItem({id,content,index}: {id: UniqueIdentifier , content: ReactNode , index: number}){
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
    const zoomValue = index === 0 ? 1 : 0.25;
    const style = {
    transform: CSS.Transform.toString({ 
        x: transform?.x ?? 0,
        y: transform?.y ?? 0, 
        scaleX: 1, 
        scaleY: 1, 
    }),
    opacity: isDragging ? 0.85 : 1,
    transition,     
    zoom: zoomValue,                      
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
        origin-top-left
        w-max h-max
        ${isDragging ? 'z-10 ' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="dark:text-gray-200">{content}</span>
      </div>
    </li>
  )
}