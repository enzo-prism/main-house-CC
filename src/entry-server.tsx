import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'

import App from './App.tsx'

/** Used at build time only: scripts/prerender.mjs writes this into dist/index.html. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
