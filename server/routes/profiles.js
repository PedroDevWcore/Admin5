import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireLevel } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/logger.js';

const router = express.Router();

// Listar perfis de acesso
router.get('/', authenticateToken, requireLevel(['super_admin']), async (req, res) => {
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
      `SELECT COUNT(*) as total FROM perfis_acesso ${whereClause}`,
      params
    );

    // Buscar perfis
    const [profiles] = await pool.execute(
      `SELECT codigo, nome, descricao, permissoes, ativo, data_criacao, data_atualizacao, criado_por
       FROM perfis_acesso ${whereClause} 
       ORDER BY data_criacao DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    // Parse das permissões JSON
    const profilesWithPermissions = profiles.map(profile => ({
      ...profile,
      permissoes: JSON.parse(profile.permissoes)
    }));

    res.json({
      profiles: profilesWithPermissions,
      total: countResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar perfis de acesso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar perfil por ID
router.get('/:id', authenticateToken, requireLevel(['super_admin']), async (req, res) => {
  try {
    const [profiles] = await pool.execute(
      'SELECT codigo, nome, descricao, permissoes, ativo, data_criacao, data_atualizacao, criado_por FROM perfis_acesso WHERE codigo = ?',
      [req.params.id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Perfil de acesso não encontrado' });
    }

    const profile = {
      ...profiles[0],
      permissoes: JSON.parse(profiles[0].permissoes)
    };

    res.json(profile);

  } catch (error) {
    console.error('Erro ao buscar perfil de acesso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar perfil de acesso
router.post('/', authenticateToken, requireLevel(['super_admin']), async (req, res) => {
  try {
    const { nome, descricao, permissoes, ativo } = req.body;

    // Verificar se nome já existe
    const [existingProfile] = await pool.execute(
      'SELECT codigo FROM perfis_acesso WHERE nome = ?',
      [nome]
    );

    if (existingProfile.length > 0) {
      return res.status(400).json({ message: 'Nome do perfil já está em uso' });
    }

    const [result] = await pool.execute(
      `INSERT INTO perfis_acesso (nome, descricao, permissoes, ativo, criado_por) 
       VALUES (?, ?, ?, ?, ?)`,
      [nome, descricao, JSON.stringify(permissoes), ativo ? 1 : 0, req.admin.codigo]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'create', 'perfis_acesso', result.insertId, null, { nome, descricao, ativo }, req);

    res.status(201).json({ message: 'Perfil de acesso criado com sucesso', codigo: result.insertId });

  } catch (error) {
    console.error('Erro ao criar perfil de acesso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar perfil de acesso
router.put('/:id', authenticateToken, requireLevel(['super_admin']), async (req, res) => {
  try {
    const profileId = req.params.id;
    const { nome, descricao, permissoes, ativo } = req.body;

    // Buscar dados anteriores
    const [profileAnterior] = await pool.execute(
      'SELECT * FROM perfis_acesso WHERE codigo = ?',
      [profileId]
    );

    if (profileAnterior.length === 0) {
      return res.status(404).json({ message: 'Perfil de acesso não encontrado' });
    }

    await pool.execute(
      `UPDATE perfis_acesso SET 
        nome = ?, descricao = ?, permissoes = ?, ativo = ?, data_atualizacao = NOW()
       WHERE codigo = ?`,
      [nome, descricao, JSON.stringify(permissoes), ativo ? 1 : 0, profileId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'update', 'perfis_acesso', profileId, profileAnterior[0], req.body, req);

    res.json({ message: 'Perfil de acesso atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar perfil de acesso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Alterar status do perfil
router.post('/:id/toggle-status', authenticateToken, requireLevel(['super_admin']), async (req, res) => {
  try {
    const profileId = req.params.id;
    const { ativo } = req.body;

    await pool.execute(
      'UPDATE perfis_acesso SET ativo = ?, data_atualizacao = NOW() WHERE codigo = ?',
      [ativo ? 1 : 0, profileId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, ativo ? 'activate' : 'deactivate', 'perfis_acesso', profileId, null, { ativo }, req);

    res.json({ message: `Perfil ${ativo ? 'ativado' : 'desativado'} com sucesso` });

  } catch (error) {
    console.error('Erro ao alterar status do perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir perfil de acesso
router.delete('/:id', authenticateToken, requireLevel(['super_admin']), async (req, res) => {
  try {
    const profileId = req.params.id;

    // Verificar se há administradores usando este perfil
    const [adminsUsingProfile] = await pool.execute(
      'SELECT COUNT(*) as total FROM administradores WHERE codigo_perfil_acesso = ?',
      [profileId]
    );

    if (adminsUsingProfile[0].total > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir este perfil pois há administradores utilizando-o' 
      });
    }

    // Buscar dados antes de excluir
    const [profile] = await pool.execute(
      'SELECT * FROM perfis_acesso WHERE codigo = ?',
      [profileId]
    );

    if (profile.length === 0) {
      return res.status(404).json({ message: 'Perfil de acesso não encontrado' });
    }

    await pool.execute('DELETE FROM perfis_acesso WHERE codigo = ?', [profileId]);

    // Log da ação
    await logAdminAction(req.admin.codigo, 'delete', 'perfis_acesso', profileId, profile[0], null, req);

    res.json({ message: 'Perfil de acesso excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir perfil de acesso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;