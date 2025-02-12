import './styles/App.scss';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protected-route';
import Login from './components/auth/login';
import Register from './components/auth/register';
import CreateTemplate from './components/templates/createTemplate';
import Home from './components/common/home';
import NotFound from './components/common/notFound';
import PoolShow from './components/templates/poolShow';
import AdminPoolResponses from './components/templates/adminPoolResponses';
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
          <Route path="/completed-templates/admin/:id" element={<AdminPoolResponses /> } />
          <Route element={<ProtectedRoute />}>
            <Route path="/templates" element={<CreateTemplate />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
