// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import RootLayout from './app/layout/RootLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RootLayout />   {/* ← Just RootLayout — no <App /> inside! */}
    </BrowserRouter>
  </StrictMode>
)