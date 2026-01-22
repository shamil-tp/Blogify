import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RouterProvider } from 'react-router-dom'
import route from './router/index.jsx'

const CLIENT_ID ="368508150878-avbfk5su027p2ltqtkm80babv65pggo7.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <RouterProvider router={route}/>
    </GoogleOAuthProvider>
  </StrictMode>,
)
