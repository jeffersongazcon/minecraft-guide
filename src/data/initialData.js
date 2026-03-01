/**
 * Datos iniciales para la aplicación
 * Se cargan automáticamente si no existen construcciones en localStorage
 */
export const initialConstructions = [
  {
    id: '1',
    title: 'Casa Medieval',
    image: 'https://images.unsplash.com/photo-1587653915936-5623ea0b949a?w=400',
    difficulty: 'Media',
    materials: ['Roble', 'Piedra', 'Cristal', 'Adoquín'],
    videoUrl: 'https://www.youtube.com/watch?v=LXhlnAYQM1g',
    description: 'Una hermosa casa medieval con detalles en madera y piedra.',
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Castillo Épico',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
    difficulty: 'Difícil',
    materials: ['Piedra', 'Ladrillo de piedra', 'Adoquín', 'Madera oscura'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Un impresionante castillo con torres y murallas defensivas.',
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Casa Moderna',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    difficulty: 'Media',
    materials: ['Cuarzo', 'Cristal', 'Hormigón blanco', 'Madera de abedul'],
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    description: 'Diseño minimalista y elegante con líneas limpias.',
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Granja Automática',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    difficulty: 'Fácil',
    materials: ['Madera', 'Redstone', 'Tolvas', 'Pistones'],
    videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    description: 'Sistema automático para cultivar recursos eficientemente.',
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Templo Japonés',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400',
    difficulty: 'Difícil',
    materials: ['Madera carmesí', 'Piedra', 'Linterna', 'Bambú'],
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    description: 'Arquitectura oriental con jardines zen y detalles tradicionales.',
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Base Submarina',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    difficulty: 'Difícil',
    materials: ['Cristal', 'Prismarino', 'Linterna marina', 'Hormigón'],
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    description: 'Refugio bajo el agua con vistas al océano.',
    isFavorite: false,
    createdAt: new Date().toISOString()
  }
];

/**
 * Usuario administrador por defecto
 */
export const defaultAdmin = {
  username: 'admin',
  password: 'admin123',
  role: 'admin'
};