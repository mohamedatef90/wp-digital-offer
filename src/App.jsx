import { Routes, Route } from 'react-router-dom'
import ProposalPage from './pages/ProposalPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/q/:id" element={<ProposalPage />} />
      <Route path="/" element={<ProposalPage />} />
    </Routes>
  )
}

export default App
