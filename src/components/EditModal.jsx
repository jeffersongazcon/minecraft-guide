/**
 * Componente EditModal
 * Modal para editar construcciones existentes
 */

import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

const EditModal = ({ show, construction, onClose, onSave }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    difficulty: 'Media',
    materials: '',
    videoUrl: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // Carga los datos de la construcción cuando cambia
  useEffect(() => {
    if (construction) {
      setFormData({
        title: construction.title || '',
        image: construction.image || '',
        difficulty: construction.difficulty || 'Media',
        materials: Array.isArray(construction.materials) 
          ? construction.materials.join(', ') 
          : construction.materials || '',
        videoUrl: construction.videoUrl || '',
        description: construction.description || ''
      });
    }
  }, [construction]);

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'La URL de la imagen es obligatoria';
    }

    if (!formData.materials.trim()) {
      newErrors.materials = 'Debe ingresar al menos un material';
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'La URL del video es obligatoria';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    return newErrors;
  };

  // Maneja el guardado
  const handleSave = () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Procesa los materiales
    const materialsArray = formData.materials
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    // Crea el objeto actualizado
    const updatedConstruction = {
      title: formData.title.trim(),
      image: formData.image.trim(),
      difficulty: formData.difficulty,
      materials: materialsArray,
      videoUrl: formData.videoUrl.trim(),
      description: formData.description.trim()
    };

    onSave(construction.id, updatedConstruction);
    setErrors({});
  };

  // Maneja el cierre
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>✏️ Editar Construcción</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Título */}
          <Form.Group className="mb-3">
            <Form.Label>Título *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          {/* URL de imagen */}
          <Form.Group className="mb-3">
            <Form.Label>URL de Imagen *</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              isInvalid={!!errors.image}
            />
            <Form.Control.Feedback type="invalid">
              {errors.image}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Dificultad */}
          <Form.Group className="mb-3">
            <Form.Label>Dificultad *</Form.Label>
            <Form.Select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Fácil">Fácil</option>
              <option value="Media">Media</option>
              <option value="Difícil">Difícil</option>
            </Form.Select>
          </Form.Group>

          {/* Materiales */}
          <Form.Group className="mb-3">
            <Form.Label>Materiales *</Form.Label>
            <Form.Control
              type="text"
              name="materials"
              value={formData.materials}
              onChange={handleChange}
              isInvalid={!!errors.materials}
            />
            <Form.Control.Feedback type="invalid">
              {errors.materials}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Separar materiales con comas
            </Form.Text>
          </Form.Group>

          {/* URL de video */}
          <Form.Group className="mb-3">
            <Form.Label>URL de Video (YouTube) *</Form.Label>
            <Form.Control
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              isInvalid={!!errors.videoUrl}
            />
            <Form.Control.Feedback type="invalid">
              {errors.videoUrl}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          💾 Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;