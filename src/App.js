import './styles/App.scss';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protected-route';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Templates from './components/templates/templates';
import Home from './components/common/home';
import PoolShow from './components/templates/poolShow';
import Navbar from './components/common/navBar';

function App() {


  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/templates/:id" element={<PoolShow /> } />
          <Route element={<ProtectedRoute />}>
            <Route path="/templates" element={<Templates />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
