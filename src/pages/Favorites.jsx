/**
 * Página Favorites
 * Muestra solo las construcciones marcadas como favoritas
 * TODOS los usuarios pueden ver sus favoritos
 */

import React from 'react';
import { Container, Alert, Row, Col } from 'react-bootstrap';
import ConstructionCard from '../components/ConstructionCard';

const Favorites = ({ 
  constructions, 
  onToggleFavorite, 
  onEdit, 
  onDelete, 
  onViewVideo,
  isAdmin 
}) => {
  // Filtra solo las construcciones favoritas
  const favorites = constructions.filter(c => c.isFavorite);

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Encabezado */}
      <div className="bg-warning py-4 mb-4">
        <Container>
          <div className="text-center">
            <h1 className="display-5 fw-bold mb-2">
              ⭐ Mis Construcciones Favoritas
            </h1>
            <p className="mb-0">
              Aquí están todas las construcciones que has marcado como favoritas
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {favorites.length === 0 ? (
          <Alert variant="info" className="text-center">
            <Alert.Heading>😊 Aún no tienes favoritos</Alert.Heading>
            <p className="mb-3">
              Explora las construcciones y marca tus favoritas usando el botón ⭐
            </p>
            <small className="text-muted">
              Los favoritos se guardan automáticamente en tu navegador
            </small>
          </Alert>
        ) : (
          <>
            <div className="mb-4">
              <h4>
                📌 {favorites.length} construcción{favorites.length !== 1 ? 'es' : ''} favorita{favorites.length !== 1 ? 's' : ''}
              </h4>
              <p className="text-muted">
                Todas tus construcciones favoritas en un solo lugar
              </p>
            </div>

            <Row xs={1} md={2} lg={3} className="g-4">
              {favorites.map(construction => (
                <Col key={construction.id}>
                  <ConstructionCard
                    construction={construction}
                    onToggleFavorite={onToggleFavorite}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewVideo={onViewVideo}
                    isAdmin={isAdmin}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Favorites;