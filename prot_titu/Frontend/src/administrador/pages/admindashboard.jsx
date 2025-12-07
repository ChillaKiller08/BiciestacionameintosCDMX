// AdminDashboard.jsx
import React, { useState } from 'react';
import AdminSidebar from '../components/adminsidebar';
import UsersManagement from '../components/usersmanagement';
import LocationsManagement from '../components/locationsmanagement';
import AddBiciestacionamiento from '../components/AddBiciestacionamiento';
import AdminPropuestas from '../components/adminpropuestas';
import './admindashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('propuestas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddBiciModal, setShowAddBiciModal] = useState(false);

  const renderContent = () => {
    switch(activeSection) {
      case 'propuestas':
        return <AdminPropuestas />;
      case 'locations':
        return <LocationsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'add-location':
        return (
          <div className="add-location-section">
            <div className="section-header">
              <h2>Registrar Biciestacionamiento</h2>
            </div>
            <div className="add-location-card">
              <div className="add-location-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Agregar Nuevo Biciestacionamiento</h3>
              <p>Registra un nuevo biciestacionamiento en el sistema con toda la información necesaria.</p>
              <button 
                className="btn-add-location"
                onClick={() => setShowAddBiciModal(true)}
              >
                Comenzar Registro
              </button>
            </div>
          </div>
        );
      default:
        return <AdminPropuestas />;
    }
  };

  return (
    <>
      <div className="admin-dashboard">
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <div className="admin-main">
          <div className="admin-header">
            <button 
              className="sidebar-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1>Panel de Administración</h1>
          </div>

          <div className="admin-content">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modal de agregar biciestacionamiento */}
      {showAddBiciModal && (
        <AddBiciestacionamiento
          onClose={() => setShowAddBiciModal(false)}
          onSuccess={() => {
            setShowAddBiciModal(false);
          }}
        />
      )}
    </>
  );
};

export default AdminDashboard;