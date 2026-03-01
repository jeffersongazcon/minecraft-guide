/**
 * Componente VideoModal
 * Modal para reproducir videos de YouTube embebidos
 */

import React from 'react';
import { Modal, Badge } from 'react-bootstrap';

const VideoModal = ({ show, construction, onClose }) => {
  // Extrae el ID del video de YouTube
  const getYouTubeId = (url) => {
    if (!url) return null;
    
    // Diferentes formatos de URL de YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const videoId = construction ? getYouTubeId(construction.videoUrl) : null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          ▶️ {construction?.title || 'Video Tutorial'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        {videoId ? (
          <div className="ratio ratio-16x9">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={construction?.title}
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-danger">❌ No se pudo cargar el video</p>
            <p className="text-muted">Verifica que la URL sea válida</p>
          </div>
        )}
      </Modal.Body>

      {construction && (
        <Modal.Footer className="d-block">
          <div className="mb-2">
            <strong>📝 Descripción:</strong>
            <p className="mb-2">{construction.description}</p>
          </div>
          
          <div className="mb-2">
            <strong>⚡ Dificultad:</strong>{' '}
            <Badge 
              bg={
                construction.difficulty === 'Fácil' ? 'success' :
                construction.difficulty === 'Media' ? 'warning' : 'danger'
              }
            >
              {construction.difficulty}
            </Badge>
          </div>

          <div>
            <strong>📦 Materiales necesarios:</strong>
            <div className="mt-1">
              {construction.materials?.map((material, index) => (
                <Badge key={index} bg="secondary" className="me-1">
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default VideoModal;