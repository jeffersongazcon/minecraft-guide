/**
 * Componente ConstructionCard
 * Tarjeta individual que muestra información de una construcción
 */

import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const ConstructionCard = ({ 
  construction, 
  onToggleFavorite, 
  onEdit, 
  onDelete, 
  onViewVideo,
  isAdmin 
}) => {
  // Obtiene el color según la dificultad
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Fácil': 'success',
      'Media': 'warning',
      'Difícil': 'danger'
    };
    return colors[difficulty] || 'secondary';
  };

  return (
    <Card className="h-100 shadow-sm construction-card">
      {/* Imagen de la construcción */}
      <Card.Img 
        variant="top" 
        src={construction.image} 
        alt={construction.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      
      {/* Badge de favorito */}
      {construction.isFavorite && (
        <div className="position-absolute top-0 end-0 m-2">
          <Badge bg="warning" className="fs-5">⭐</Badge>
        </div>
      )}

      <Card.Body className="d-flex flex-column">
        {/* Título y dificultad */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{construction.title}</Card.Title>
          <Badge bg={getDifficultyColor(construction.difficulty)}>
            {construction.difficulty}
          </Badge>
        </div>

        {/* Descripción */}
        <Card.Text className="text-muted small mb-3">
          {construction.description}
        </Card.Text>

        {/* Materiales */}
        <div className="mb-3">
          <strong className="small">📦 Materiales:</strong>
          <div className="mt-1">
            {construction.materials.map((material, index) => (
              <Badge 
                key={index} 
                bg="secondary" 
                className="me-1 mb-1"
              >
                {material}
              </Badge>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-auto">
          <div className="d-grid gap-2">
            {/* Botón de favorito */}
            <Button
              variant={construction.isFavorite ? "warning" : "outline-warning"}
              size="sm"
              onClick={() => onToggleFavorite(construction.id)}
            >
              {construction.isFavorite ? '⭐ Quitar de Favoritos' : '☆ Agregar a Favoritos'}
            </Button>

            {/* Botón de video */}
            <Button
              variant="danger"
              size="sm"
              onClick={() => onViewVideo(construction)}
            >
              ▶️ Ver Tutorial
            </Button>

            {/* Botones de administrador */}
            {isAdmin && (
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-fill"
                  onClick={() => onEdit(construction)}
                >
                  ✏️ Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-fill"
                  onClick={() => onDelete(construction.id)}
                >
                  🗑️ Eliminar
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card.Body>

      {/* Footer con fecha */}
      <Card.Footer className="text-muted small">
        Creada: {new Date(construction.createdAt).toLocaleDateString()}
      </Card.Footer>
    </Card>
  );
};

export default ConstructionCard;