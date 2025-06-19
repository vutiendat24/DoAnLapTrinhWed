import React from 'react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import MessengerUI from '../components/messenger/MessengerUI'
import Post from '../components/home/Post';
import Watch from '../components/home/Watch';
import Login from '../components/common/Login';
import Register from '../components/common/Register';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../components/HomePage';
import UserProfile from '../components/profile/UserProfile';

const AppRoute = () => {
    const storedUser = localStorage.getItem("user");
    const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
    

    const userId = user?.id;
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<HomePage/>}>
          <Route path="/home" element={<Post />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/userProfile" element={<UserProfile userId ={userId} />} />

        </Route>
        <Route path="/messenger" element={<MessengerUI user={user}/>} />
      </Route>

      {/* Public Routes */}
      <Route path="/login" element={<Login onLogin={setUser} />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoute;
