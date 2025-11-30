// UsersManagement.jsx
import React, { useState, useEffect } from 'react';
import './usersmanagement.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      // Filtrar usuarios admin
      const nonAdminUsers = data.users.filter(user => user.role !== 'admin');
      setUsers(nonAdminUsers);
    } else {
      setError(data.message || 'Error al cargar usuarios');
    }
  } catch (error) {
    console.error('Error:', error);
    setError('Error de conexión con el servidor');
  } finally {
    setLoading(false);
  }
};

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (id) => {
    const user = users.find(u => u._id === id);
    const action = user.status === 'active' ? 'desactivar' : 'activar';
    
    if (window.confirm(`¿Estás seguro de ${action} a este usuario?`)) {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:5000/api/users/${id}/toggle-status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          // Actualizar el estado local
          setUsers(users.map(u => 
            u._id === id 
              ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
              : u
          ));
          
          // Si el usuario seleccionado es el que se actualizó, actualizar también
          if (selectedUser && selectedUser._id === id) {
            setSelectedUser({
              ...selectedUser,
              status: selectedUser.status === 'active' ? 'inactive' : 'active'
            });
          }
          
          alert(data.message);
        } else {
          alert(data.message || 'Error al cambiar estado del usuario');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar permanentemente a este usuario? Esta acción no se puede deshacer.')) {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setUsers(users.filter(u => u._id !== id));
          setSelectedUser(null);
          alert(data.message);
        } else {
          alert(data.message || 'Error al eliminar usuario');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
      }
    }
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;

  // Estado de carga
  if (loading) {
    return (
      <div className="users-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="users-management">
        <div className="error-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Error al cargar usuarios</h3>
          <p>{error}</p>
          <button onClick={fetchUsers} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-management">
      <div className="section-header">
        <h2>Gestión de Usuarios</h2>
        <span className="badge">{users.length}</span>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Usuarios Activos</span>
            <span className="stat-value">{activeUsers}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inactive">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="18" y1="8" x2="23" y2="13"></line>
              <line x1="23" y1="8" x2="18" y2="13"></line>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Usuarios Inactivos</span>
            <span className="stat-value">{inactiveUsers}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total de Usuarios</span>
            <span className="stat-value">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="filters-section">
        <div className="search-bar-admin">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filters">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Todos
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Activos
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilterStatus('inactive')}
          >
            Inactivos
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Fecha Registro</th>
              <th>Ubicaciones</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.nombre.charAt(0)}
                    </div>
                    <span className="user-name">{user.nombre}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{new Date(user.fechaRegistro).toLocaleDateString('es-MX')}</td>
                <td>
                  <span className="locations-badge">{user.ubicacionesAgregadas}</span>
                </td>
                <td>
                  <span className={`status-pill ${user.status}`}>
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-action view"
                      onClick={() => setSelectedUser(user)}
                      title="Ver detalles"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button 
                      className={`btn-action ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                      onClick={() => handleToggleStatus(user._id)}
                      title={user.status === 'active' ? 'Desactivar' : 'Activar'}
                    >
                      {user.status === 'active' ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                    <button 
                      className="btn-action delete"
                      onClick={() => handleDeleteUser(user._id)}
                      title="Eliminar usuario"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>No se encontraron usuarios</h3>
          <p>Intenta cambiar los filtros de búsqueda</p>
        </div>
      )}

      {/* Modal de detalles de usuario */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Usuario</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedUser(null)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <div className="user-profile">
                <div className="profile-avatar">
                  {selectedUser.nombre.charAt(0)}
                </div>
                <h3>{selectedUser.nombre}</h3>
                <span className={`status-pill ${selectedUser.status}`}>
                  {selectedUser.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="user-details">
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="detail-row">
                  <label>Fecha de Registro:</label>
                  <span>{new Date(selectedUser.fechaRegistro).toLocaleDateString('es-MX')}</span>
                </div>
                <div className="detail-row">
                  <label>Ubicaciones Agregadas:</label>
                  <span>{selectedUser.ubicacionesAgregadas}</span>
                </div>
                <div className="detail-row">
                  <label>ID:</label>
                  <span>{selectedUser._id}</span>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-modal-action"
                  onClick={() => handleToggleStatus(selectedUser._id)}
                >
                  {selectedUser.status === 'active' ? 'Desactivar Usuario' : 'Activar Usuario'}
                </button>
                <button 
                  className="btn-modal-delete"
                  onClick={() => handleDeleteUser(selectedUser._id)}
                >
                  Eliminar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
