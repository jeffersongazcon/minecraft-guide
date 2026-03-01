/**
 * Componente LoginForm
 * Formulario de inicio de sesión conectado a la API REST
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { authAPI } from '../services/apiService';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones básicas
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }

    try {
      // Llama a la API
      const response = await authAPI.login(formData.username, formData.password);
      
      // Guarda el token y datos del usuario
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Redirige a la página principal
        navigate('/home');
        window.location.reload(); // Recargar para que App.jsx cargue las construcciones
      } else {
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-lg">
            <Card.Body className="p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">🎮 Minecraft Guide</h2>
                <h4 className="mb-3">Iniciar Sesión</h4>
                <p className="text-muted">Accede a tu guía de construcciones</p>
              </div>

              {/* Mensaje de error */}
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {/* Formulario */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>👤 Usuario</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Ingrese su usuario"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                    autoFocus
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>🔒 Contraseña</strong>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Ingrese su contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Iniciando sesión...
                      </>
                    ) : (
                      '🚀 Ingresar'
                    )}
                  </Button>
                </div>
              </Form>

              {/* Link de registro */}
              <div className="text-center mt-4">
                <p className="text-muted">
                  ¿No tienes cuenta?{' '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => navigate('/register')}
                  >
                    Regístrate aquí
                  </Button>
                </p>
              </div>

              {/* Información adicional */}
              <div className="mt-4 p-3 bg-light rounded">
                <strong className="text-success">✅ Credenciales de prueba:</strong>
                <div className="mt-2">
                  <code className="d-block">Usuario: admin</code>
                  <code className="d-block">Contraseña: admin123</code>
                </div>
                <small className="text-muted d-block mt-2">
                  💡 El sistema usa la API de .NET con base de datos
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default LoginForm;