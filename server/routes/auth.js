import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, settings } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/logger.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Buscar administrador
    const [admins] = await pool.execute(
      'SELECT * FROM administradores WHERE email = ? AND ativo = 1',
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const admin = admins[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { adminId: admin.codigo, email: admin.email },
      settings.JWT.SECRET,
      { expiresIn: settings.JWT.EXPIRES_IN }
    );

    // Salvar sessão no banco
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await pool.execute(
      'INSERT INTO admin_sessions (admin_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [
        admin.codigo,
        token,
        req.ip || req.connection.remoteAddress,
        req.get('User-Agent') || '',
        expiresAt
      ]
    );

    // Atualizar último acesso
    await pool.execute(
      'UPDATE administradores SET ultimo_acesso = NOW() WHERE codigo = ?',
      [admin.codigo]
    );

    // Log da ação
    await logAdminAction(admin.codigo, 'login', 'administradores', admin.codigo, null, null, req);

    // Remover senha da resposta
    const { senha: _, ...adminData } = admin;

    res.json({
      admin: adminData,
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Validar token
router.get('/validate', authenticateToken, async (req, res) => {
  res.json(req.admin);
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Remover sessão do banco
    await pool.execute(
      'DELETE FROM admin_sessions WHERE token = ?',
      [req.token]
    );

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;