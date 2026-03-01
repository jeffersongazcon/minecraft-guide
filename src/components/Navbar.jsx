/**
 * Componente Navbar
 * Barra de navegación principal con React Router
 */

import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow">
      <Container>
        <BSNavbar.Brand as={Link} to="/home" className="fw-bold">
          🎮 Minecraft Guide
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/home">
                  🏠 Inicio
                </Nav.Link>
                
                <Nav.Link as={Link} to="/favorites">
                  ⭐ Favoritos
                </Nav.Link>
                
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin">
                    ⚙️ Administración
                  </Nav.Link>
                )}

              </>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">
                  👤 <strong>{user.username}</strong>
                  {user.role === 'admin' && (
                    <span className="badge bg-warning text-dark ms-2">Admin</span>
                  )}
                </span>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : null}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;