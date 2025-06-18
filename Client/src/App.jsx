import React from 'react'
import { Routes } from 'react-router-dom'
import AppRoute from './route/AppRoute.jsx';
import HomePage from './components/HomePage.jsx';
import { useState } from 'react';


const App = () => {

  {/*Nơi quản lý route và bố trí các trang cố định như sidebar, header, footer*/}

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
   <>
    <AppRoute/>
   </>
  )
}

export default App;