/**
 * Componente Consultar
 * Página para consumir y probar endpoints de la API
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { constructionsAPI } from '../services/apiService';

const Consultar = () => {
  const [constructions, setConstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carga las construcciones al montar el componente
  useEffect(() => {
    fetchConstructions();
  }, []);

  // Obtiene todas las construcciones de la API
  const fetchConstructions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await constructionsAPI.getAll();
      setConstructions(data);
      setSuccess('Construcciones cargadas exitosamente desde la API');
    } catch (err) {
      console.error('Error al consultar API:', err);
      setError('Error al conectar con la API: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Prueba de conexión simple
  const testConnection = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('https://localhost:7001/api/health', {
        method: 'GET',
      });
      
      if (response.ok) {
        setSuccess('✅ Conexión exitosa con la API');
      } else {
        setError('⚠️ La API respondió pero con errores');
      }
    } catch (err) {
      setError('❌ No se pudo conectar con la API. Verifica que esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  // Obtiene el color del badge según la dificultad
  const getDifficultyBadge = (difficulty) => {
    const variants = {
      'Fácil': 'success',
      'Media': 'warning',
      'Difícil': 'danger'
    };
    return variants[difficulty] || 'secondary';
  };

  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="mb-4">
        <h2>🔌 Consumir API REST</h2>
        <p className="text-muted">
          Prueba la conexión con tu API de Visual Studio (.NET)
        </p>
      </div>

      {/* Mensajes */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Card de acciones */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">⚙️ Acciones de Prueba</h5>
          <div className="d-flex gap-2 flex-wrap">
            <Button 
              variant="primary" 
              onClick={testConnection}
              disabled={loading}
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" className="me-2" />
              ) : (
                '🔍 '
              )}
              Probar Conexión
            </Button>

            <Button 
              variant="success" 
              onClick={fetchConstructions}
              disabled={loading}
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" className="me-2" />
              ) : (
                '📥 '
              )}
              Obtener Construcciones
            </Button>

            <Button 
              variant="info" 
              onClick={() => {
                setConstructions([]);
                setError('');
                setSuccess('');
              }}
              disabled={loading}
            >
              🗑️ Limpiar
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Información de la API */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-info text-white">
          <strong>📋 Información de la API</strong>
        </Card.Header>
        <Card.Body>
          <Table borderless size="sm">
            <tbody>
              <tr>
                <td><strong>URL Base:</strong></td>
                <td><code>https://localhost:7001/api</code></td>
              </tr>
              <tr>
                <td><strong>Endpoints disponibles:</strong></td>
                <td>
                  <ul className="mb-0">
                    <li><code>POST /Auth/login</code> - Iniciar sesión</li>
                    <li><code>POST /Auth/register</code> - Registrar usuario</li>
                    <li><code>GET /Constructions</code> - Listar construcciones</li>
                    <li><code>GET /Constructions/:id</code> - Obtener una construcción</li>
                    <li><code>POST /Constructions</code> - Crear construcción</li>
                    <li><code>PUT /Constructions/:id</code> - Actualizar construcción</li>
                    <li><code>DELETE /Constructions/:id</code> - Eliminar construcción</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td><strong>Autenticación:</strong></td>
                <td>Bearer Token (JWT)</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Resultados */}
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white">
          <strong>📊 Resultados de la Consulta</strong>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Consultando API...</p>
            </div>
          ) : constructions.length === 0 ? (
            <div className="text-center text-muted py-4">
              <p>No hay datos para mostrar</p>
              <small>Haz clic en "Obtener Construcciones" para cargar datos</small>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <Badge bg="primary">
                  {constructions.length} construcción{constructions.length !== 1 ? 'es' : ''} encontrada{constructions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Dificultad</th>
                      <th>Materiales</th>
                      <th>Favorito</th>
                    </tr>
                  </thead>
                  <tbody>
                    {constructions.map((construction, index) => (
                      <tr key={construction.id || index}>
                        <td>{construction.id}</td>
                        <td>{construction.title}</td>
                        <td>
                          <Badge bg={getDifficultyBadge(construction.difficulty)}>
                            {construction.difficulty}
                          </Badge>
                        </td>
                        <td>
                          {Array.isArray(construction.materials) 
                            ? construction.materials.join(', ')
                            : construction.materials}
                        </td>
                        <td className="text-center">
                          {construction.isFavorite ? '⭐' : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Instrucciones */}
      <Card className="mt-4 shadow-sm border-warning">
        <Card.Header className="bg-warning">
          <strong>⚠️ Instrucciones</strong>
        </Card.Header>
        <Card.Body>
          <ol>
            <li>Asegúrate de que tu API de Visual Studio esté ejecutándose</li>
            <li>Verifica que la URL en <code>src/services/apiService.js</code> sea correcta</li>
            <li>Habilita CORS en tu API de .NET si tienes errores de CORS</li>
            <li>Si usas HTTPS con certificado autofirmado, acepta el certificado en el navegador</li>
          </ol>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Consultar;