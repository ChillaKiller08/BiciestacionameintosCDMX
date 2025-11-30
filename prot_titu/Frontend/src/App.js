import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Home from './pages/main.jsx';
import AdminDashboard from './administrador/pages/admindashboard.jsx';

function App() {
  return (
    <div className="App">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* Ruta para registrar usuarios */}
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}