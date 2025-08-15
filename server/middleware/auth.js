import jwt from 'jsonwebtoken';
import { pool, settings } from '../config/database.js';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  try {
    const decoded = jwt.verify(token, settings.JWT.SECRET);
    
    // Verificar se o token ainda é válido no banco
    const [sessions] = await pool.execute(
      'SELECT * FROM admin_sessions WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    if (sessions.length === 0) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    // Buscar dados do admin
    const [admins] = await pool.execute(
      'SELECT codigo, nome, usuario, email, nivel_acesso, ativo FROM administradores WHERE codigo = ? AND ativo = 1',
      [decoded.adminId]
    );

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Administrador não encontrado ou inativo' });
    }

    req.admin = admins[0];
    req.token = token;
    
    // Atualizar última atividade
    await pool.execute(
      'UPDATE admin_sessions SET last_activity = NOW() WHERE token = ?',
      [token]
    );

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(403).json({ message: 'Token inválido' });
  }
};

const requireLevel = (requiredLevels) => {
  return (req, res, next) => {
    if (!requiredLevels.includes(req.admin.nivel_acesso)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
};

export { authenticateToken, requireLevel };