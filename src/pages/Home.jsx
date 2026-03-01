/**
 * Página Home
 * Página principal que muestra todas las construcciones
 */

import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import ConstructionList from '../components/ConstructionList';

const Home = ({ 
  constructions, 
  onToggleFavorite, 
  onEdit, 
  onDelete, 
  onViewVideo,
  isAdmin 
}) => {
  return (
    <div className="home-full-screen">
      {/* Banner de bienvenida */}
      <div className="bg-primary text-white py-4 mb-4 w-100 px-3">

        <div className="container-fluid">
          <div className="text-center">
            <h1 className="display-5 fw-bold mb-3">
              🎮 Guía de Construcciones de Minecraft
            </h1>
            <p className="lead mb-0">
              Descubre, aprende y construye increíbles estructuras paso a paso
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <Container className="mb-4">
        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded shadow-sm">
              <h3 className="text-primary mb-1">{constructions.length}</h3>
              <p className="mb-0 text-muted small">Construcciones Totales</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded shadow-sm">
              <h3 className="text-warning mb-1">
                {constructions.filter(c => c.isFavorite).length}
              </h3>
              <p className="mb-0 text-muted small">Favoritos</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded shadow-sm">
              <h3 className="text-success mb-1">
                {constructions.filter(c => c.difficulty === 'Fácil').length}
              </h3>
              <p className="mb-0 text-muted small">Construcciones Fáciles</p>
            </div>
          </div>
        </div>
      </Container>

      {/* Lista de construcciones */}
      {constructions.length === 0 ? (
        <Container>
          <Alert variant="warning">
            <Alert.Heading>📭 No hay construcciones registradas</Alert.Heading>
            <p>
              Parece que aún no hay construcciones en la guía. 
              {isAdmin && ' Usa el panel de administración para agregar nuevas construcciones.'}
            </p>
          </Alert>
        </Container>
      ) : (
        <ConstructionList
          constructions={constructions}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewVideo={onViewVideo}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};


export default Home;