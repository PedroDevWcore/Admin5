import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireLevel } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/logger.js';

const router = express.Router();

// ==================== PLANOS DE REVENDA ====================

// Listar planos de revenda
router.get('/revenda', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (nome LIKE ? OR descricao LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Contar total
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM planos_revenda ${whereClause}`,
      params
    );

    // Buscar planos
    const [plans] = await pool.execute(
      `SELECT * FROM planos_revenda ${whereClause} 
       ORDER BY data_criacao DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      plans,
      total: countResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar planos de revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar plano de revenda por ID
router.get('/revenda/:id', authenticateToken, async (req, res) => {
  try {
    const [plans] = await pool.execute(
      'SELECT * FROM planos_revenda WHERE codigo = ?',
      [req.params.id]
    );

    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    res.json(plans[0]);

  } catch (error) {
    console.error('Erro ao buscar plano de revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar plano de revenda
router.post('/revenda', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const {
      nome, descricao, subrevendas, streamings, espectadores, bitrate,
      espaco_ftp, transmissao_srt, preco, ativo
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO planos_revenda (
        nome, descricao, subrevendas, streamings, espectadores, bitrate,
        espaco_ftp, transmissao_srt, preco, ativo, criado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome, descricao, subrevendas, streamings, espectadores, bitrate,
        espaco_ftp, transmissao_srt ? 1 : 0, preco || 0, ativo ? 1 : 0, req.admin.codigo
      ]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'create', 'planos_revenda', result.insertId, null, req.body, req);

    res.status(201).json({ message: 'Plano de revenda criado com sucesso', codigo: result.insertId });

  } catch (error) {
    console.error('Erro ao criar plano de revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar plano de revenda
router.put('/revenda/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const planId = req.params.id;
    const {
      nome, descricao, subrevendas, streamings, espectadores, bitrate,
      espaco_ftp, transmissao_srt, preco, ativo
    } = req.body;

    // Buscar dados anteriores
    const [planAnterior] = await pool.execute(
      'SELECT * FROM planos_revenda WHERE codigo = ?',
      [planId]
    );

    if (planAnterior.length === 0) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    await pool.execute(
      `UPDATE planos_revenda SET 
        nome = ?, descricao = ?, subrevendas = ?, streamings = ?, espectadores = ?,
        bitrate = ?, espaco_ftp = ?, transmissao_srt = ?, preco = ?, ativo = ?
       WHERE codigo = ?`,
      [
        nome, descricao, subrevendas, streamings, espectadores, bitrate,
        espaco_ftp, transmissao_srt ? 1 : 0, preco || 0, ativo ? 1 : 0, planId
      ]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'update', 'planos_revenda', planId, planAnterior[0], req.body, req);

    res.json({ message: 'Plano de revenda atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar plano de revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Alterar status do plano de revenda
router.post('/revenda/:id/toggle-status', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const planId = req.params.id;
    const { ativo } = req.body;

    await pool.execute(
      'UPDATE planos_revenda SET ativo = ? WHERE codigo = ?',
      [ativo ? 1 : 0, planId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, ativo ? 'activate' : 'deactivate', 'planos_revenda', planId, null, { ativo }, req);

    res.json({ message: `Plano ${ativo ? 'ativado' : 'desativado'} com sucesso` });

  } catch (error) {
    console.error('Erro ao alterar status do plano:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir plano de revenda
router.delete('/revenda/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const planId = req.params.id;

    // Verificar se há revendas usando este plano
    const [revendasUsandoPlano] = await pool.execute(
      'SELECT COUNT(*) as total FROM revendas WHERE plano_id = ?',
      [planId]
    );

    if (revendasUsandoPlano[0].total > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir este plano pois há revendas utilizando-o' 
      });
    }

    // Buscar dados antes de excluir
    const [plan] = await pool.execute(
      'SELECT * FROM planos_revenda WHERE codigo = ?',
      [planId]
    );

    if (plan.length === 0) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    await pool.execute('DELETE FROM planos_revenda WHERE codigo = ?', [planId]);

    // Log da ação
    await logAdminAction(req.admin.codigo, 'delete', 'planos_revenda', planId, plan[0], null, req);

    res.json({ message: 'Plano de revenda excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir plano de revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar planos de revenda ativos
router.get('/revenda-active', authenticateToken, async (req, res) => {
  try {
    const [plans] = await pool.execute(
      'SELECT * FROM planos_revenda WHERE ativo = 1 ORDER BY nome'
    );

    res.json(plans);

  } catch (error) {
    console.error('Erro ao buscar planos ativos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== PLANOS DE STREAMING ====================

// Listar planos de streaming
router.get('/streaming', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (nome LIKE ? OR descricao LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Contar total
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM planos_streaming ${whereClause}`,
      params
    );

    // Buscar planos
    const [plans] = await pool.execute(
      `SELECT * FROM planos_streaming ${whereClause} 
       ORDER BY data_criacao DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      plans,
      total: countResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar planos de streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar plano de streaming por ID
router.get('/streaming/:id', authenticateToken, async (req, res) => {
  try {
    const [plans] = await pool.execute(
      'SELECT * FROM planos_streaming WHERE codigo = ?',
      [req.params.id]
    );

    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    res.json(plans[0]);

  } catch (error) {
    console.error('Erro ao buscar plano de streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar plano de streaming
router.post('/streaming', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const { nome, descricao, espectadores, bitrate, espaco_ftp, preco, ativo } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO planos_streaming (
        nome, descricao, espectadores, bitrate, espaco_ftp, preco, ativo, criado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, descricao, espectadores, bitrate, espaco_ftp, preco || 0, ativo ? 1 : 0, req.admin.codigo]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'create', 'planos_streaming', result.insertId, null, req.body, req);

    res.status(201).json({ message: 'Plano de streaming criado com sucesso', codigo: result.insertId });

  } catch (error) {
    console.error('Erro ao criar plano de streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar plano de streaming
router.put('/streaming/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const planId = req.params.id;
    const { nome, descricao, espectadores, bitrate, espaco_ftp, preco, ativo } = req.body;

    // Buscar dados anteriores
    const [planAnterior] = await pool.execute(
      'SELECT * FROM planos_streaming WHERE codigo = ?',
      [planId]
    );

    if (planAnterior.length === 0) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    await pool.execute(
      `UPDATE planos_streaming SET 
        nome = ?, descricao = ?, espectadores = ?, bitrate = ?, espaco_ftp = ?, preco = ?, ativo = ?
       WHERE codigo = ?`,
      [nome, descricao, espectadores, bitrate, espaco_ftp, preco || 0, ativo ? 1 : 0, planId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'update', 'planos_streaming', planId, planAnterior[0], req.body, req);

    res.json({ message: 'Plano de streaming atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar plano de streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Alterar status do plano de streaming
router.post('/streaming/:id/toggle-status', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const planId = req.params.id;
    const { ativo } = req.body;

    await pool.execute(
      'UPDATE planos_streaming SET ativo = ? WHERE codigo = ?',
      [ativo ? 1 : 0, planId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, ativo ? 'activate' : 'deactivate', 'planos_streaming', planId, null, { ativo }, req);

    res.json({ message: `Plano ${ativo ? 'ativado' : 'desativado'} com sucesso` });

  } catch (error) {
    console.error('Erro ao alterar status do plano:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir plano de streaming
router.delete('/streaming/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const planId = req.params.id;

    // Verificar se há streamings usando este plano
    const [streamingsUsandoPlano] = await pool.execute(
      'SELECT COUNT(*) as total FROM streamings WHERE plano_id = ?',
      [planId]
    );

    if (streamingsUsandoPlano[0].total > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir este plano pois há streamings utilizando-o' 
      });
    }

    // Buscar dados antes de excluir
    const [plan] = await pool.execute(
      'SELECT * FROM planos_streaming WHERE codigo = ?',
      [planId]
    );

    if (plan.length === 0) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    await pool.execute('DELETE FROM planos_streaming WHERE codigo = ?', [planId]);

    // Log da ação
    await logAdminAction(req.admin.codigo, 'delete', 'planos_streaming', planId, plan[0], null, req);

    res.json({ message: 'Plano de streaming excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir plano de streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar planos de streaming ativos
router.get('/streaming/active', authenticateToken, async (req, res) => {
  try {
    const [plans] = await pool.execute(
      'SELECT * FROM planos_streaming WHERE ativo = 1 ORDER BY nome'
    );

    res.json(plans);

  } catch (error) {
    console.error('Erro ao buscar planos ativos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar planos de streaming ativos
router.get('/streaming-active', authenticateToken, async (req, res) => {
  try {
    const [plans] = await pool.execute(
      'SELECT * FROM planos_streaming WHERE ativo = 1 ORDER BY nome'
    );

    res.json(plans);

  } catch (error) {
    console.error('Erro ao buscar planos ativos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;