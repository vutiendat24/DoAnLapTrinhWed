import React from 'react'
import { Routes } from 'react-router-dom'
import AppRoute from './route/AppRoute.jsx';
import Header from './components/common/Header/Header.jsx';


const App = () => {


  {/*Nơi quản lý route và bố trí các trang cố định như sidebar, header, footer*/}
  return (
   <>
    <Header/>
    <AppRoute/>
   </>
  )
}

export default App;