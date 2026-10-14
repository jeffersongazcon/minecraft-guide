import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ConstructionCard from '../src/components/ConstructionCard';
import ConstructionForm from '../src/components/ConstructionForm';
import Favorites from '../src/pages/Favorites';
import LoginForm from '../src/components/LoginForm';
import RegisterForm from '../src/components/RegisterForm';
import { authAPI } from '../src/services/apiService';

const mockNavigate = jest.fn();

jest.mock('../src/services/apiService', () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const construction = {
  id: 17,
  title: 'Casa del bosque',
  image: 'https://example.com/casa.jpg',
  difficulty: 'Media',
  materials: ['Madera'],
  videoUrl: 'https://youtube.com/watch?v=abc123',
  description: 'Una casa junto al bosque',
  createdAt: '2025-01-01T00:00:00.000Z',
  isFavorite: false,
};

beforeEach(() => {
  window.localStorage.clear();
  jest.clearAllMocks();
});

describe('inicio de sesión', () => {
  it('muestra un error y no llama a la API si faltan las credenciales', async () => {
    const { container } = render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(await screen.findByText(/complete todos los campos/i)).not.toBeNull();
    expect(authAPI.login).not.toHaveBeenCalled();
    expect(container.querySelector('[name="username"]')).not.toBeNull();
  });

  it('guarda la sesión y navega al inicio cuando las credenciales son válidas', async () => {
    const user = { id: 3, username: 'jugador', role: 'user' };
    authAPI.login.mockResolvedValue({ token: 'token-de-prueba', user });
    const originalConsoleError = console.error;
    const consoleError = jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (args[0]?.type !== 'not implemented' || !args[0].message.includes('navigation')) {
        originalConsoleError(...args);
      }
    });

    const { container } = render(<LoginForm />);
    fireEvent.change(container.querySelector('[name="username"]'), {
      target: { value: 'jugador' },
    });
    fireEvent.change(container.querySelector('[name="password"]'), {
      target: { value: 'clave-segura' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('jugador', 'clave-segura');
      expect(window.localStorage.getItem('token')).toBe('token-de-prueba');
      expect(JSON.parse(window.localStorage.getItem('user'))).toEqual(user);
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
    consoleError.mockRestore();
  });
});

describe('registro', () => {
  it('rechaza contraseñas que no coinciden sin llamar a la API', async () => {
    const { container } = render(<RegisterForm />);
    fireEvent.change(container.querySelector('[name="username"]'), {
      target: { value: 'jugador' },
    });
    fireEvent.change(container.querySelector('[name="email"]'), {
      target: { value: 'jugador@example.com' },
    });
    fireEvent.change(container.querySelector('[name="password"]'), {
      target: { value: 'clave-segura' },
    });
    fireEvent.change(container.querySelector('[name="confirmPassword"]'), {
      target: { value: 'otra-clave' },
    });
    fireEvent.click(screen.getByRole('button', { name: /registrar|crear cuenta/i }));

    expect(await screen.findByText(/no coinciden/i)).not.toBeNull();
    expect(authAPI.register).not.toHaveBeenCalled();
  });

  it('registra los datos válidos y muestra confirmación', async () => {
    authAPI.register.mockResolvedValue({});
    const { container } = render(<RegisterForm />);
    fireEvent.change(container.querySelector('[name="username"]'), {
      target: { value: 'jugador' },
    });
    fireEvent.change(container.querySelector('[name="email"]'), {
      target: { value: 'jugador@example.com' },
    });
    fireEvent.change(container.querySelector('[name="password"]'), {
      target: { value: 'clave-segura' },
    });
    fireEvent.change(container.querySelector('[name="confirmPassword"]'), {
      target: { value: 'clave-segura' },
    });
    fireEvent.click(screen.getByRole('button', { name: /registrar|crear cuenta/i }));

    await waitFor(() => {
      expect(authAPI.register).toHaveBeenCalledWith({
        username: 'jugador',
        email: 'jugador@example.com',
        password: 'clave-segura',
      });
    });
    expect(await screen.findByText(/Registro Exitoso/i)).not.toBeNull();
  });
});

describe('creación de construcciones', () => {
  it('valida los campos requeridos antes de crear una construcción', async () => {
    const onSubmit = jest.fn();
    render(<ConstructionForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /guardar construcción/i }));

    expect(await screen.findByText(/El título es obligatorio/i)).not.toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envía los datos y separa los materiales por coma', async () => {
    const onSubmit = jest.fn();
    const { container } = render(<ConstructionForm onSubmit={onSubmit} />);
    const values = {
      title: '  Casa del bosque  ',
      image: 'https://example.com/casa.jpg',
      difficulty: 'Difícil',
      materials: 'Madera, Piedra, , Cristal',
      videoUrl: ' https://youtube.com/watch?v=abc123 ',
      description: '  Una casa junto al bosque  ',
    };

    Object.entries(values).forEach(([name, value]) => {
      fireEvent.change(container.querySelector(`[name="${name}"]`), {
        target: { value },
      });
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar construcción/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Casa del bosque',
      image: 'https://example.com/casa.jpg',
      difficulty: 'Difícil',
      materials: ['Madera', 'Piedra', 'Cristal'],
      videoUrl: 'https://youtube.com/watch?v=abc123',
      description: 'Una casa junto al bosque',
    });
    expect(await screen.findByText(/Construcción registrada exitosamente/i)).not.toBeNull();
  });
});

describe('favoritos', () => {
  it('marca una construcción como favorita al pulsar el botón', () => {
    const onToggleFavorite = jest.fn();

    render(
      <ConstructionCard
        construction={construction}
        onToggleFavorite={onToggleFavorite}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onViewVideo={jest.fn()}
        isAdmin={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /agregar a favoritos/i }));

    expect(onToggleFavorite).toHaveBeenCalledWith(construction.id);
  });

  it('muestra solo las construcciones favoritas', () => {
    render(
      <Favorites
        constructions={[
          { ...construction, isFavorite: true },
          { ...construction, id: 18, title: 'Torre sin marcar', isFavorite: false },
        ]}
        onToggleFavorite={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onViewVideo={jest.fn()}
        isAdmin={false}
      />,
    );

    expect(screen.getByText('Casa del bosque')).not.toBeNull();
    expect(screen.queryByText('Torre sin marcar')).toBeNull();
  });
});
