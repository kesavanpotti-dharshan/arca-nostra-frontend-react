import './App.css'
import { Route } from 'react-router-dom'
import SummaryPage from '@/app/summary/SummaryPage'

function App() {
  return (
    <>
      <Route path="/" element={<SummaryPage />} />
    </>
  )
}

export default App
