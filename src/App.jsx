/**
 * Componente principal App con React Router
 * Integra autenticación con API REST y navegación
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Toast, ToastContainer, Spinner } from 'react-bootstrap';

// Componentes de autenticación
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Consultar from './components/Consultar';
import ProtectedRoute from './components/ProtectedRoute';

// Componentes principales
import Navbar from './components/Navbar';
import EditModal from './components/EditModal';
import VideoModal from './components/VideoModal';
import ConfirmModal from './components/ConfirmModal';

// Páginas
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Admin from './pages/Admin';

// Servicios
import { constructionsAPI } from './services/apiService';

function App() {
  // Estados principales
  const [user, setUser] = useState(null);
  const [constructions, setConstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de modales
  const [editModal, setEditModal] = useState({ show: false, construction: null });
  const [videoModal, setVideoModal] = useState({ show: false, construction: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  
  // Estados de notificaciones
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // Inicialización
  useEffect(() => {
    // Verifica si hay un usuario autenticado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        loadConstructions();
      } catch (e) {
        console.error('Error al parsear usuario:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Carga las construcciones desde la API
  const loadConstructions = async () => {
    try {
      setLoading(true);
      const data = await constructionsAPI.getAll();
      setConstructions(data);
    } catch (error) {
      console.error('Error al cargar construcciones:', error);
      showToast('Error al cargar construcciones', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Muestra un toast
  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
  };

  // --- Manejo de autenticación ---

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setConstructions([]);
    showToast('Sesión cerrada correctamente', 'info');
  };

  // --- Manejo de construcciones ---

  const handleToggleFavorite = async (id) => {
    try {
      const response = await constructionsAPI.toggleFavorite(id);
      await loadConstructions(); // Recargar para actualizar el estado de favoritos
      showToast(response.message, 'info');
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      showToast('Error al actualizar favorito', 'danger');
    }
  };

  const handleCreateConstruction = async (construction) => {
    try {
      await constructionsAPI.create(construction);
      await loadConstructions();
      showToast('Construcción creada exitosamente');
    } catch (error) {
      console.error('Error al crear construcción:', error);
      showToast('Error al crear construcción', 'danger');
    }
  };

  const handleUpdateConstruction = async (id, updatedData) => {
    try {
      await constructionsAPI.update(id, updatedData);
      await loadConstructions();
      setEditModal({ show: false, construction: null });
      showToast('Construcción actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar construcción:', error);
      showToast('Error al actualizar construcción', 'danger');
    }
  };

  const handleDeleteConstruction = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.id) {
      try {
        await constructionsAPI.delete(deleteConfirm.id);
        await loadConstructions();
        showToast('Construcción eliminada', 'warning');
      } catch (error) {
        console.error('Error al eliminar construcción:', error);
        showToast('Error al eliminar construcción', 'danger');
      }
    }
    setDeleteConfirm({ show: false, id: null });
  };

  // --- Manejo de modales ---

  const handleEditModal = (construction) => {
    setEditModal({ show: true, construction });
  };

  const handleVideoModal = (construction) => {
    setVideoModal({ show: true, construction });
  };

  // Verifica si el usuario es admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Muestra spinner mientras carga
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Cargando...</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* Navbar - se muestra siempre si hay usuario */}
        {user && (
          <Navbar 
            user={user} 
            onLogout={handleLogout}
          />
        )}

        {/* Rutas */}
        <div className="flex-grow-1">
          <Routes>
            {/* Ruta de Login */}
            <Route 
              path="/" 
              element={
                user ? <Navigate to="/home" replace /> : <LoginForm />
              } 
            />
            
            {/* Ruta de Registro */}
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/home" replace /> : <RegisterForm />
              } 
            />

            {/* Rutas protegidas */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home
                    constructions={constructions}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={handleEditModal}
                    onDelete={handleDeleteConstruction}
                    onViewVideo={handleVideoModal}
                    isAdmin={isAdmin()}
                    loading={loading}
                  />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute>
                  <Favorites
                    constructions={constructions}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={handleEditModal}
                    onDelete={handleDeleteConstruction}
                    onViewVideo={handleVideoModal}
                    isAdmin={isAdmin()}
                  />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  {isAdmin() ? (
                    <Admin
                      constructions={constructions}
                      onCreateConstruction={handleCreateConstruction}
                      onDeleteConstruction={handleDeleteConstruction}
                    />
                  ) : (
                    <Container className="mt-5 text-center">
                      <h2>🔒 Acceso Denegado</h2>
                      <p className="text-muted">
                        Solo los administradores pueden acceder a esta página
                      </p>
                    </Container>
                  )}
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/consultar" 
              element={
                <ProtectedRoute>
                  <Consultar />
                </ProtectedRoute>
              } 
            />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer - solo si hay usuario */}
        {user && (
          <footer className="bg-dark text-white text-center py-3 mt-auto">
            <Container>
              <p className="mb-0">
                🎮 Guía de Construcciones de Minecraft © 2024 | Desarrollado con React + Bootstrap + .NET API
              </p>
            </Container>
          </footer>
        )}

        {/* Modales */}
        <EditModal
          show={editModal.show}
          construction={editModal.construction}
          onClose={() => setEditModal({ show: false, construction: null })}
          onSave={handleUpdateConstruction}
        />

        <VideoModal
          show={videoModal.show}
          construction={videoModal.construction}
          onClose={() => setVideoModal({ show: false, construction: null })}
        />

        <ConfirmModal
          show={deleteConfirm.show}
          title="⚠️ Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar esta construcción? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, id: null })}
          variant="danger"
          confirmText="Sí, eliminar"
        />

        {/* Toast de notificaciones */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            delay={3000}
            autohide
            bg={toast.variant}
          >
            <Toast.Header>
              <strong className="me-auto">Notificación</strong>
            </Toast.Header>
            <Toast.Body className={toast.variant === 'success' || toast.variant === 'danger' ? 'text-white' : ''}>
              {toast.message}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </Router>
  );
}

export default App;