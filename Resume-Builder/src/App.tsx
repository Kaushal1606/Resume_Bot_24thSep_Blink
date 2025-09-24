import React from 'react'
import { Toaster } from 'react-hot-toast'
import { ResumeOptimizer } from './components/ResumeOptimizer'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ResumeOptimizer />
      <Toaster position="top-right" />
    </div>
  )
}

export default App