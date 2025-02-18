import './styles/App.scss';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protected-route';
import AdminProtectedRoute from './components/admin-protected-route';
import Login from './components/auth/login';
import Register from './components/auth/register';
import CreateTemplate from './components/templates/createTemplate';
import Home from './components/common/home';
import NotFound from './components/common/notFound';
import PoolShow from './components/templates/poolShow';
import AdminPoolResponses from './components/templates/adminPoolResponses';
import Navbar from './components/common/navBar';
import AdminIndex from './components/admin/adminIndex';
import CreateAdminForm from './components/admin/createAdminForm';
import EditTemplate from './components/templates/editTempplate';

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
            <Route path="/template/:id/edit" element={<EditTemplate />} />
          </Route>
          <Route element={<AdminProtectedRoute />}>
            <Route path="/users" element={<AdminIndex />} />
            <Route path="/user" element={<CreateAdminForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
