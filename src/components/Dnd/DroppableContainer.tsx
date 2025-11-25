import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'

import SortableItem from './SortableItem'

import type { Item } from "./types";

export default function DroppableContainer({ id, title, items, index}: { id: string; title: string; items: Item[]; index: number}) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`relative flex ${index === 0 ? 'h-[80%]' : 'h-[20%] '} flex-col rounded-md border border-gray-200 bg-gray-900/30 p-3 dark:border-gray-700 overflow-x-auto overflow-y-hidden`}
    >
      {/* <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200">
        {title}
      </h3> */}
      
      <div className="h-full flex-1 bg-green-300/0">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={horizontalListSortingStrategy}
        >
          <ul className="relative h-full flex flex-row flex-shrink-0 bg-blue-500 m-0 p-0 list-none  overflow-y-hidden">
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