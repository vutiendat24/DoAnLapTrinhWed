import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
 <StrictMode>
  {/*Render giao diện của trang web */}
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </StrictMode>
)
