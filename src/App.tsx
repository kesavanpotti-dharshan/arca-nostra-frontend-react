import { useState } from 'react'
import './App.css'
import { Route } from 'react-router-dom'
import SummaryPage from '@/app/summary/SummaryPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Route path="/" element={<SummaryPage />} />
    </>
  )
}

export default App
