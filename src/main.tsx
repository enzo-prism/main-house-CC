import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import App from './App.tsx'
import './styles.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered (scripts/prerender.mjs); the dev server
// serves an empty root.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
