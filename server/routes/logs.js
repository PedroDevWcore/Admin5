import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', acao = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (a.nome LIKE ? OR al.tabela_afetada LIKE ? OR al.ip_address LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (acao) {
      whereClause += ' AND al.acao = ?';
      params.push(acao);
    }

    // Contar total
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM admin_logs al 
       JOIN administradores a ON al.admin_id = a.codigo 
       ${whereClause}`,
      params
    );

    // Buscar logs
    const [logs] = await pool.execute(
      `SELECT al.*, a.nome as admin_nome
       FROM admin_logs al 
       JOIN administradores a ON al.admin_id = a.codigo 
       ${whereClause}
       ORDER BY al.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      logs,
      total: countResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;