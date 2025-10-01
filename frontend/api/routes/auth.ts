/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// Mock users database
const mockUsers = [
  {
    id: '1',
    email: 'player@jbest.com',
    password: '123456',
    name: 'Jogador Demo',
    role: 'jogador',
    isAuthenticated: true,
    balance: 1000.00,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'admin@jbest.com',
    password: '123456',
    name: 'Admin Demo',
    role: 'admin',
    isAuthenticated: true,
    balance: 0,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'jbest-demo-secret-key';

// Helper function to generate JWT token
const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Helper function to create user response (without password)
const createUserResponse = (user: any) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * User Registration
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, senha e nome são obrigatórios'
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Usuário já existe com este email'
      });
    }

    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      password,
      name,
      role: 'jogador',
      isAuthenticated: true,
      balance: 100.00, // Welcome bonus
      isActive: true,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: createUserResponse(newUser),
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o suporte.'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: createUserResponse(user),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    // In a real application, you would invalidate the token
    // For this mock implementation, we just return success
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * Get User Profile
 * GET /api/auth/profile
 */
router.get('/profile', async (req: Request, res: Response) => {
  try {
    // In a real application, you would verify the JWT token
    // For this mock implementation, we return the first user
    const user = mockUsers[0]; // Demo user
    
    res.json({
      success: true,
      data: {
        user: createUserResponse(user)
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
