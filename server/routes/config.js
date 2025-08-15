import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireLevel } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/logger.js';

const router = express.Router();

// Obter configurações do sistema
router.get('/', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const [configs] = await pool.execute(
      `SELECT c.*, ws.nome as servidor_nome, ws.ip as servidor_ip
       FROM configuracoes c
       LEFT JOIN wowza_servers ws ON c.codigo_wowza_servidor_atual = ws.codigo
       WHERE c.codigo = 1`
    );

    if (configs.length === 0) {
      return res.status(404).json({ message: 'Configurações não encontradas' });
    }

    res.json(configs[0]);

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar configurações do sistema
router.put('/', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const { dominio_padrao, codigo_wowza_servidor_atual, manutencao } = req.body;

    // Buscar configurações anteriores
    const [configAnterior] = await pool.execute(
      'SELECT * FROM configuracoes WHERE codigo = 1'
    );

    // Verificar se o servidor existe
    if (codigo_wowza_servidor_atual) {
      const [servidor] = await pool.execute(
        'SELECT codigo FROM wowza_servers WHERE codigo = ? AND status = "ativo"',
        [codigo_wowza_servidor_atual]
      );

      if (servidor.length === 0) {
        return res.status(400).json({ message: 'Servidor selecionado não existe ou está inativo' });
      }
    }

    await pool.execute(
      `UPDATE configuracoes SET 
        dominio_padrao = ?, 
        codigo_wowza_servidor_atual = ?, 
        manutencao = ?
       WHERE codigo = 1`,
      [dominio_padrao, codigo_wowza_servidor_atual, manutencao]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'update', 'configuracoes', 1, configAnterior[0], req.body, req);

    res.json({ message: 'Configurações atualizadas com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar servidores disponíveis para seleção
router.get('/servers', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const [servers] = await pool.execute(
      'SELECT codigo, nome, ip, status FROM wowza_servers WHERE status = "ativo" ORDER BY nome'
    );

    res.json(servers);

  } catch (error) {
    console.error('Erro ao buscar servidores:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;