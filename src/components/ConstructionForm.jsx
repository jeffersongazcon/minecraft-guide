/**
 * Componente ConstructionForm
 * Formulario para crear nuevas construcciones (solo administradores)
 */

import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const ConstructionForm = ({ onSubmit }) => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    difficulty: 'Media',
    materials: '',
    videoUrl: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpia el error del campo al escribir
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
    } else if (!formData.image.match(/^https?:\/\/.+/)) {
      newErrors.image = 'Debe ser una URL válida (http:// o https://)';
    }

    if (!formData.materials.trim()) {
      newErrors.materials = 'Debe ingresar al menos un material';
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'La URL del video es obligatoria';
    } else if (!formData.videoUrl.includes('youtube.com') && !formData.videoUrl.includes('youtu.be')) {
      newErrors.videoUrl = 'Debe ser una URL válida de YouTube';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    return newErrors;
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Procesa los materiales (separados por coma)
    const materialsArray = formData.materials
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    // Crea el objeto de construcción
    const construction = {
      title: formData.title.trim(),
      image: formData.image.trim(),
      difficulty: formData.difficulty,
      materials: materialsArray,
      videoUrl: formData.videoUrl.trim(),
      description: formData.description.trim()
    };

    // Envía los datos
    onSubmit(construction);

    // Resetea el formulario
    setFormData({
      title: '',
      image: '',
      difficulty: 'Media',
      materials: '',
      videoUrl: '',
      description: ''
    });
    setErrors({});
    setShowSuccess(true);

    // Oculta el mensaje de éxito después de 3 segundos
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card className="shadow">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">➕ Registrar Nueva Construcción</h5>
      </Card.Header>
      
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
            ✅ Construcción registrada exitosamente
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Título */}
          <Form.Group className="mb-3">
            <Form.Label>Título *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Casa Medieval"
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
              placeholder="https://example.com/image.jpg"
              isInvalid={!!errors.image}
            />
            <Form.Control.Feedback type="invalid">
              {errors.image}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              URL completa de la imagen de la construcción
            </Form.Text>
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
              placeholder="Madera, Piedra, Cristal, Hierro"
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
              placeholder="https://www.youtube.com/watch?v=..."
              isInvalid={!!errors.videoUrl}
            />
            <Form.Control.Feedback type="invalid">
              {errors.videoUrl}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              URL completa del video tutorial de YouTube
            </Form.Text>
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
              placeholder="Describe la construcción y sus características..."
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Botón de envío */}
          <div className="d-grid">
            <Button variant="primary" type="submit" size="lg">
              💾 Guardar Construcción
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ConstructionForm;