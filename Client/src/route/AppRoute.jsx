import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MessengerUI from '../components/messenger/MessengerUI'
import Post from '../components/home/Post';
import Watch from '../components/home/Watch';
import Login from '../components/common/Login';
import Register from '../components/common/Register';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../components/HomePage';

const AppRoute = () => {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<HomePage/>}>
          <Route path="/home" element={<Post />} />
          <Route path="/watch" element={<Watch />} />
        </Route>
        <Route path="/messenger" element={<MessengerUI />} />
      </Route>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoute;
