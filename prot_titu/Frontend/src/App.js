import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Home from './pages/main.jsx';
import AdminDashboard from './administrador/pages/admindashboard.jsx';
import UserProfile from './components/userprofile.jsx';

import ProtectedRoute from './components/protectedroute.jsx';
import PublicRoute from './components/publicroute.jsx';

function App() {
  return (
    <div className="App">
      <div className="main-content">
        <Routes>
          {/* Rutas Públicas (solo si NO estás autenticado) */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />

          {/* Rutas Protegidas (solo si estás autenticado) */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />

          {/* Rutas de Admin (solo si eres admin) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Ruta 404 */}
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