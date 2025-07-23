import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, settings } from '../config/database.js';
import { authenticateToken, requireLevel } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/logger.js';

const router = express.Router();

// Listar revendas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (nome LIKE ? OR email LIKE ? OR id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND status_detalhado = ?';
      params.push(status);
    }

    // Contar total
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM revendas ${whereClause}`,
      params
    );

    // Buscar revendas
    const [revendas] = await pool.execute(
      `SELECT codigo, codigo_revenda, id, nome, email, telefone, streamings, espectadores, 
              bitrate, espaco, subrevendas, status, data_cadastro, dominio_padrao, 
              idioma_painel, tipo, ultimo_acesso_data, ultimo_acesso_ip, admin_criador,
              data_expiracao, status_detalhado, observacoes_admin, limite_uploads_diario,
              espectadores_ilimitado, bitrate_maximo, total_transmissoes, ultima_transmissao,
              espaco_usado_mb, data_ultima_atualizacao
       FROM revendas ${whereClause} 
       ORDER BY data_cadastro DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      revendas,
      total: countResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar revendas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar revenda por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [revendas] = await pool.execute(
      'SELECT * FROM revendas WHERE codigo = ?',
      [req.params.id]
    );

    if (revendas.length === 0) {
      return res.status(404).json({ message: 'Revenda não encontrada' });
    }

    // Remover senha da resposta
    const { senha, ...revendaData } = revendas[0];
    res.json(revendaData);

  } catch (error) {
    console.error('Erro ao buscar revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar revenda
router.post('/', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const {
      nome, email, telefone, senha, streamings, espectadores, bitrate, espaco,
      subrevendas, status_detalhado, data_expiracao, observacoes_admin,
      limite_uploads_diario, espectadores_ilimitado, bitrate_maximo,
      dominio_padrao, idioma_painel, url_suporte, plano_id
    } = req.body;

    // Verificar se email já existe
    const [existingRevenda] = await pool.execute(
      'SELECT codigo FROM revendas WHERE email = ?',
      [email]
    );

    if (existingRevenda.length > 0) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Gerar ID único
    const generateId = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    let id = generateId();
    
    // Verificar se ID já existe
    let [existingId] = await pool.execute('SELECT codigo FROM revendas WHERE id = ?', [id]);
    while (existingId.length > 0) {
      id = generateId();
      [existingId] = await pool.execute('SELECT codigo FROM revendas WHERE id = ?', [id]);
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Gerar chave API
    const chaveApi = jwt.sign({ id, email }, settings.JWT.SECRET);

    // Obter servidor padrão das configurações
    const [config] = await pool.execute(
      'SELECT codigo_wowza_servidor_atual FROM configuracoes WHERE codigo = 1'
    );
    const servidorPadrao = config[0]?.codigo_wowza_servidor_atual;

    const [result] = await pool.execute(
      `INSERT INTO revendas (
        codigo_revenda, id, nome, email, telefone, senha, streamings, espectadores,
        bitrate, espaco, subrevendas, chave_api, status, data_cadastro, dominio_padrao,
        idioma_painel, tipo, ultimo_acesso_data, ultimo_acesso_ip, admin_criador,
        data_expiracao, status_detalhado, observacoes_admin, limite_uploads_diario,
        espectadores_ilimitado, bitrate_maximo, url_suporte, codigo_wowza_servidor, plano_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        0, id, nome, email, telefone, senhaHash, streamings, espectadores,
        bitrate, espaco, subrevendas, chaveApi, 1, dominio_padrao,
        idioma_painel, 1, '0.0.0.0', req.admin.codigo,
        data_expiracao || null, status_detalhado, observacoes_admin,
        limite_uploads_diario, espectadores_ilimitado ? 1 : 0, bitrate_maximo,
        url_suporte, servidorPadrao, plano_id || null
      ]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'create', 'revendas', result.insertId, null, req.body, req);

    res.status(201).json({ message: 'Revenda criada com sucesso', codigo: result.insertId });

  } catch (error) {
    console.error('Erro ao criar revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar revenda
router.put('/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const revendaId = req.params.id;
    
    // Buscar dados anteriores
    const [revendaAnterior] = await pool.execute(
      'SELECT * FROM revendas WHERE codigo = ?',
      [revendaId]
    );

    if (revendaAnterior.length === 0) {
      return res.status(404).json({ message: 'Revenda não encontrada' });
    }

    const {
      nome, email, telefone, senha, streamings, espectadores, bitrate, espaco,
      subrevendas, status_detalhado, data_expiracao, observacoes_admin,
      limite_uploads_diario, espectadores_ilimitado, bitrate_maximo,
      dominio_padrao, idioma_painel, url_suporte, plano_id
    } = req.body;

    let updateQuery = `
      UPDATE revendas SET 
        nome = ?, email = ?, telefone = ?, streamings = ?, espectadores = ?,
        bitrate = ?, espaco = ?, subrevendas = ?, status_detalhado = ?,
        data_expiracao = ?, observacoes_admin = ?, limite_uploads_diario = ?,
        espectadores_ilimitado = ?, bitrate_maximo = ?, dominio_padrao = ?,
        idioma_painel = ?, url_suporte = ?, plano_id = ?, data_ultima_atualizacao = NOW()
    `;

    let params = [
      nome, email, telefone, streamings, espectadores, bitrate, espaco,
      subrevendas, status_detalhado, data_expiracao || null, observacoes_admin,
      limite_uploads_diario, espectadores_ilimitado ? 1 : 0, bitrate_maximo,
      dominio_padrao, idioma_painel, url_suporte, plano_id || null
    ];

    // Se senha foi fornecida, incluir na atualização
    if (senha && senha.trim() !== '') {
      const senhaHash = await bcrypt.hash(senha, 10);
      updateQuery += ', senha = ?';
      params.push(senhaHash);
    }

    updateQuery += ' WHERE codigo = ?';
    params.push(revendaId);

    await pool.execute(updateQuery, params);

    // Log da ação
    await logAdminAction(req.admin.codigo, 'update', 'revendas', revendaId, revendaAnterior[0], req.body, req);

    res.json({ message: 'Revenda atualizada com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Suspender revenda
router.post('/:id/suspend', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const revendaId = req.params.id;

    await pool.execute(
      'UPDATE revendas SET status_detalhado = ?, data_ultima_atualizacao = NOW() WHERE codigo = ?',
      ['suspenso', revendaId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'suspend', 'revendas', revendaId, null, { status_detalhado: 'suspenso' }, req);

    res.json({ message: 'Revenda suspensa com sucesso' });

  } catch (error) {
    console.error('Erro ao suspender revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Ativar revenda
router.post('/:id/activate', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const revendaId = req.params.id;

    await pool.execute(
      'UPDATE revendas SET status_detalhado = ?, data_ultima_atualizacao = NOW() WHERE codigo = ?',
      ['ativo', revendaId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'activate', 'revendas', revendaId, null, { status_detalhado: 'ativo' }, req);

    res.json({ message: 'Revenda ativada com sucesso' });

  } catch (error) {
    console.error('Erro ao ativar revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir revenda
router.delete('/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const revendaId = req.params.id;

    // Buscar dados antes de excluir
    const [revenda] = await pool.execute(
      'SELECT * FROM revendas WHERE codigo = ?',
      [revendaId]
    );

    if (revenda.length === 0) {
      return res.status(404).json({ message: 'Revenda não encontrada' });
    }

    await pool.execute('DELETE FROM revendas WHERE codigo = ?', [revendaId]);

    // Log da ação
    await logAdminAction(req.admin.codigo, 'delete', 'revendas', revendaId, revenda[0], null, req);

    res.json({ message: 'Revenda excluída com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;