/**
 * Página Admin
 * Panel de administración para gestionar construcciones
 */

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table, Badge } from 'react-bootstrap';
import ConstructionForm from '../components/ConstructionForm';
import ConfirmModal from '../components/ConfirmModal';

const Admin = ({ 
  constructions, 
  onCreateConstruction, 
  onDeleteConstruction,
  onClearData,
  onResetData 
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Maneja la creación de construcción
  const handleCreate = (construction) => {
    onCreateConstruction(construction);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Maneja la limpieza de datos
  const handleClearData = () => {
    onClearData();
    setShowClearConfirm(false);
    alert('✅ Todos los datos han sido eliminados');
  };

  // Maneja el reseteo de datos
  const handleResetData = () => {
    onResetData();
    setShowResetConfirm(false);
    alert('✅ Datos restaurados a valores iniciales');
  };

  // Obtiene color según dificultad
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Fácil': 'success',
      'Media': 'warning',
      'Difícil': 'danger'
    };
    return colors[difficulty] || 'secondary';
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="bg-dark text-white py-4 mb-4">
        <Container>
          <div className="text-center">
            <h1 className="display-5 fw-bold mb-2">
              ⚙️ Panel de Administración
            </h1>
            <p className="mb-0">
              Gestiona las construcciones de la guía
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {showSuccess && (
          <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
            ✅ Acción completada exitosamente
          </Alert>
        )}

        <Row className="mb-4">
          {/* Estadísticas */}
          <Col md={12} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">📊 Estadísticas</h5>
                <Row className="text-center">
                  <Col>
                    <h3 className="text-primary">{constructions.length}</h3>
                    <small className="text-muted">Total</small>
                  </Col>
                  <Col>
                    <h3 className="text-success">
                      {constructions.filter(c => c.difficulty === 'Fácil').length}
                    </h3>
                    <small className="text-muted">Fáciles</small>
                  </Col>
                  <Col>
                    <h3 className="text-warning">
                      {constructions.filter(c => c.difficulty === 'Media').length}
                    </h3>
                    <small className="text-muted">Medias</small>
                  </Col>
                  <Col>
                    <h3 className="text-danger">
                      {constructions.filter(c => c.difficulty === 'Difícil').length}
                    </h3>
                    <small className="text-muted">Difíciles</small>
                  </Col>
                  <Col>
                    <h3 className="text-info">
                      {constructions.filter(c => c.isFavorite).length}
                    </h3>
                    <small className="text-muted">Favoritos</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Formulario de creación */}
          <Col md={6} className="mb-4">
            <ConstructionForm onSubmit={handleCreate} />
          </Col>

          {/* Panel de gestión */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm mb-3">
              <Card.Header className="bg-danger text-white">
                <h5 className="mb-0">🗑️ Gestión de Datos</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-danger"
                    onClick={() => setShowClearConfirm(true)}
                  >
                    🗑️ Limpiar Todo el localStorage
                  </Button>
                  <Button 
                    variant="outline-warning"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    🔄 Restaurar Datos Iniciales
                  </Button>
                </div>
                <Alert variant="warning" className="mt-3 mb-0 small">
                  ⚠️ Estas acciones son irreversibles. Asegúrate de lo que haces.
                </Alert>
              </Card.Body>
            </Card>

            {/* Lista de construcciones */}
            <Card className="shadow-sm">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">📋 Construcciones Registradas</h5>
              </Card.Header>
              <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {constructions.length === 0 ? (
                  <p className="text-muted text-center mb-0">
                    No hay construcciones registradas
                  </p>
                ) : (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Dificultad</th>
                        <th>Fav</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {constructions.map(construction => (
                        <tr key={construction.id}>
                          <td className="small">{construction.title}</td>
                          <td>
                            <Badge bg={getDifficultyColor(construction.difficulty)}>
                              {construction.difficulty}
                            </Badge>
                          </td>
                          <td className="text-center">
                            {construction.isFavorite ? '⭐' : '-'}
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => onDeleteConstruction(construction.id)}
                            >
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modales de confirmación */}
      <ConfirmModal
        show={showClearConfirm}
        title="⚠️ Confirmar Limpieza Total"
        message="Esto eliminará TODOS los datos del localStorage, incluyendo construcciones y sesión. ¿Estás seguro?"
        onConfirm={handleClearData}
        onCancel={() => setShowClearConfirm(false)}
        variant="danger"
        confirmText="Sí, limpiar todo"
      />

      <ConfirmModal
        show={showResetConfirm}
        title="🔄 Confirmar Restauración"
        message="Esto restaurará las construcciones a los datos iniciales, eliminando cualquier cambio que hayas hecho. ¿Continuar?"
        onConfirm={handleResetData}
        onCancel={() => setShowResetConfirm(false)}
        variant="warning"
        confirmText="Sí, restaurar"
      />
    </div>
  );
};

export default Admin;