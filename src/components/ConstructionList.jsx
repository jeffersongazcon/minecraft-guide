/**
 * Componente ConstructionList
 * Lista de todas las construcciones con filtros y búsqueda
 */

import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Alert } from 'react-bootstrap';
import ConstructionCard from './ConstructionCard';

const ConstructionList = ({ 
  constructions, 
  onToggleFavorite, 
  onEdit, 
  onDelete, 
  onViewVideo,
  isAdmin 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  // Filtra las construcciones según búsqueda y dificultad
  const filteredConstructions = constructions.filter(construction => {
    const matchesSearch = construction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         construction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = filterDifficulty === 'all' || 
                             construction.difficulty === filterDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  return (
    <Container>
      {/* Encabezado */}
      <div className="mb-4">
        <h2>📚 Guía de Construcciones</h2>
        <p className="text-muted">
          Explora y aprende a construir increíbles estructuras en Minecraft
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar construcciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">Todas las dificultades</option>
            <option value="Fácil">Fácil</option>
            <option value="Media">Media</option>
            <option value="Difícil">Difícil</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Resultados */}
      {filteredConstructions.length === 0 ? (
        <Alert variant="info">
          <Alert.Heading>😕 No se encontraron construcciones</Alert.Heading>
          <p>
            Intenta ajustar los filtros o términos de búsqueda.
          </p>
        </Alert>
      ) : (
        <>
          <div className="mb-3 text-muted">
            Mostrando {filteredConstructions.length} de {constructions.length} construcciones
          </div>
          
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredConstructions.map(construction => (
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
  );
};

export default ConstructionList;