import BasicDragDrop from './components/Dnd'
import './App.css'

export default function App() {
  return (
    <>
    <main className="relative flex-1 p-6 ml-64 bg-gray-100 h-screen">
      <BasicDragDrop>
        {/* <div className='bg-stone-100 w-[350px] h-[400px]'>chat</div>
        <div className='bg-stone-100 w-[400px] h-[600px]'>pdf1</div>
        <div className='bg-stone-100 w-[400px] h-[600px]'>pdf2</div> */}
        <div>tester</div>
      </BasicDragDrop>
      {/* <div className='relative flex flex center bg-pink-500 h-100'>
        <div className='relative bg-stone-100 w-[10%] h-[50%]'>
          <div className='bg-blue-300 w-full h-full'>
            test
          </div>
        </div>
      </div> */}
      </main>
    </>
  )
}