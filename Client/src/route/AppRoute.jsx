import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MessengerUI from '../components/messenger/MessengerUI'

const AppRoute = () => {
  return (
    <Routes>
      {/* Add your routes here */}
      <Route path="/messenger" element={<MessengerUI/>} />
    </Routes>
  );
}

export default AppRoute;