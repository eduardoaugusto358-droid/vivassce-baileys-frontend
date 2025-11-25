// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Dashboard } from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        theme="dark"
        richColors
        closeButton
      />
    </BrowserRouter>
  )
}

export default App
