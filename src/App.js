import './styles/App.scss';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protected-route';
import AdminProtectedRoute from './components/admin-protected-route';
import Login from './components/auth/login';
import Register from './components/auth/register';
import CreatePoll from './components/templates/createPoll';
import Home from './components/common/home';
import NotFound from './components/common/notFound';
import PollShow from './components/templates/pollShow';
import AdminPollResponses from './components/templates/adminPollResponses';
import Navbar from './components/common/navBar';
import AdminIndex from './components/admin/adminIndex';
import CreateAdminForm from './components/admin/createAdminForm';
import EditPoll from './components/templates/editPoll';
import UserPolls from './components/templates/userPolls';

function App() {


  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/admin" element={<CreateAdminForm />} />
          <Route path="/templates/:id" element={<PollShow /> } />
          <Route path="/completed-templates/admin/:id" element={<AdminPollResponses /> } />
          <Route element={<ProtectedRoute />}>
            <Route path="/templates/admin/:id" element={<UserPolls />} />
            <Route path="/templates/create" element={<CreatePoll />} />
            <Route path="/template/:id/edit" element={<EditPoll />} />
          </Route>
          <Route element={<AdminProtectedRoute />}>
            <Route path="/users" element={<AdminIndex />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
