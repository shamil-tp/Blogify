import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@coreui/coreui/dist/css/coreui.min.css'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RouterProvider } from 'react-router-dom'
import route from './router/index.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider>
      <RouterProvider router={route}/>
    </GoogleOAuthProvider>
  </StrictMode>
)
