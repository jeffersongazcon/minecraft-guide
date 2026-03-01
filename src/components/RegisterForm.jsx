/**
 * Componente RegisterForm
 * Formulario de registro de nuevos usuarios conectado a la API
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { authAPI } from '../services/apiService';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpia el error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Valida el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es obligatorio';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Valida el formulario
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Llama a la API
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setSuccess(true);
      
      // Redirige al login después de 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      console.error('Error al registrar:', err);
      setErrors({
        general: err.message || 'Error al registrar usuario. Intente nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <Card className="shadow-lg">
            <Card.Body className="p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold text-success">📝 Registro</h2>
                <p className="text-muted">Crea tu cuenta en Minecraft Guide</p>
              </div>

              {/* Mensaje de éxito */}
              {success && (
                <Alert variant="success">
                  <Alert.Heading>✅ ¡Registro Exitoso!</Alert.Heading>
                  <p>Tu cuenta ha sido creada. Redirigiendo al login...</p>
                </Alert>
              )}

              {/* Mensaje de error general */}
              {errors.general && (
                <Alert variant="danger" dismissible onClose={() => setErrors({})}>
                  {errors.general}
                </Alert>
              )}

              {/* Formulario */}
              <Form onSubmit={handleSubmit}>
                {/* Usuario */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>👤 Usuario</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Ej: jugador123"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    disabled={loading || success}
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>📧 Email</strong>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    disabled={loading || success}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>🔒 Contraseña</strong>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    disabled={loading || success}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirmar Contraseña */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>🔒 Confirmar Contraseña</strong>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    disabled={loading || success}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="success" 
                    type="submit" 
                    size="lg"
                    disabled={loading || success}
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
                        Registrando...
                      </>
                    ) : (
                      '✨ Crear Cuenta'
                    )}
                  </Button>

                  <Button 
                    variant="outline-secondary"
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    ← Volver al Login
                  </Button>
                </div>
              </Form>

              {/* Información adicional */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>📋 Requisitos:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Usuario mínimo 3 caracteres</li>
                    <li>Email válido</li>
                    <li>Contraseña mínimo 6 caracteres</li>
                  </ul>
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default RegisterForm;