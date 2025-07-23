import { useState } from 'react'
import DiceCanvas from './DiceCanvas'
import './App.css'

function App() {
  const [trigger, setTrigger] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-3xl mb-4">Three.js Dice</h1>
      <button
        type="button"
        className="mb-4 px-4 py-2 bg-blue-600 rounded"
        onClick={() => setTrigger((t) => t + 1)}
      >
        Roll Dice
      </button>
      <div className="w-80 h-80">
        <DiceCanvas trigger={trigger} />
      </div>
    </div>
  )
}

export default App
