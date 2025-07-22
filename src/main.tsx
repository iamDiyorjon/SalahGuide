import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NamozApp from '../namoz-app.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NamozApp />
  </StrictMode>,
)