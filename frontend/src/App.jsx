import DiceCanvas from './DiceCanvas'
import './App.css'

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-3xl mb-4">Three.js Dice</h1>
      <div className="w-screen h-screen">
        <DiceCanvas />
      </div>
    </div>
  )
}

export default App
