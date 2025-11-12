import BasicDragDrop from './components/Dnd'
import './App.css'

export default function App() {
  return (
    <>
      <BasicDragDrop>
        <div className='relative bg-stone-100 w-[200px] h-[300px]'>chat</div>
        <div className='relative bg-stone-100 w-[200px] h-[500px]'>pdf1</div>
        <div>pdf2</div>
      </BasicDragDrop>
    </>
  )
}