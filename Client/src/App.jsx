import React from 'react'
import { Routes } from 'react-router-dom'
import AppRoute from './route/AppRoute.jsx';
import HomePage from './components/HomePage.jsx';
import { useState } from 'react';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
   <>
    <AppRoute/>
   </>
  )
}

export default App;