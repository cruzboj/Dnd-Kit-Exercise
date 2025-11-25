
export default function ItemOverlay({children}: { children: React.ReactNode}) {

  return (
    <div
      style = {{zoom : 0.25 }}
      className="
        cursor-grab 
        touch-none 
        rounded border 
        p-3 
        dark:border-gray-700 
        dark:bg-red-500 
        z-20 
        opacity-90
        w-max h-max
        "
    >
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  )
}