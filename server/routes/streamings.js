import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { authenticateToken, requireLevel } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/logger.js';

const router = express.Router();

const STATUS_ATIVO = 1;
const STATUS_INATIVO = 0;
const STATUS_BLOQUEADO = 2;

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (s.login LIKE ? OR s.email LIKE ? OR s.identificacao LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status !== '') {
      whereClause += ' AND s.status = ?';
      params.push(Number(status));
    }

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM streamings s 
       ${whereClause}`,
      params
    );

    const [streamings] = await pool.execute(
      `SELECT s.*, 
              r.nome as revenda_nome,
              ps.nome as plano_nome,
              ws.nome as servidor_nome,
              ws.ip as servidor_ip
       FROM streamings s
       LEFT JOIN revendas r ON s.codigo_cliente = r.codigo
       LEFT JOIN planos_streaming ps ON s.plano_id = ps.codigo
       LEFT JOIN wowza_servers ws ON s.codigo_servidor = ws.codigo
       ${whereClause} 
       ORDER BY s.data_cadastro DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      streamings,
      total: countResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar streamings:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [streamings] = await pool.execute(
      `SELECT s.*, 
              r.nome as revenda_nome,
              ps.nome as plano_nome,
              ws.nome as servidor_nome,
              ws.ip as servidor_ip
       FROM streamings s
       LEFT JOIN revendas r ON s.codigo_cliente = r.codigo
       LEFT JOIN planos_streaming ps ON s.plano_id = ps.codigo
       LEFT JOIN wowza_servers ws ON s.codigo_servidor = ws.codigo
       WHERE s.codigo = ?`,
      [req.params.id]
    );

    if (streamings.length === 0) {
      return res.status(404).json({ message: 'Streaming não encontrada' });
    }

    const { senha, senha_transmissao, ...streamingData } = streamings[0];
    res.json(streamingData);

  } catch (error) {
    console.error('Erro ao buscar streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const {
      codigo_cliente, plano_id, codigo_servidor, login, senha, identificacao, email,
      espectadores, bitrate, espaco, aplicacao, idioma_painel, descricao
    } = req.body;

    const [existingStreaming] = await pool.execute(
      'SELECT codigo FROM streamings WHERE login = ?',
      [login]
    );

    if (existingStreaming.length > 0) {
      return res.status(400).json({ message: 'Login já está em uso' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const senhaTransmissaoHash = await bcrypt.hash(senha, 10); // Mesma senha para transmissão por padrão

    // Gerar diretório FTP baseado no login
    const ftpDir = `/home/streaming/${login}`;

    const [result] = await pool.execute(
      `INSERT INTO streamings (
        codigo_cliente, plano_id, codigo_servidor, login, senha, senha_transmissao,
        identificacao, email, espectadores, bitrate, espaco, espaco_usado,
        ftp_dir, aplicacao, idioma_painel, descricao, data_cadastro,
        player_titulo, player_descricao, app_nome, app_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
      [
        codigo_cliente || null, plano_id || null, codigo_servidor, login, senhaHash, senhaTransmissaoHash,
        identificacao, email, espectadores, bitrate, espaco, 0,
        ftpDir, aplicacao || 'live', idioma_painel || 'pt-br', descricao || '',
        identificacao, descricao || '', identificacao, email
      ]
    );

    await logAdminAction(req.admin.codigo, 'create', 'streamings', result.insertId, null, req.body, req);

    res.status(201).json({ message: 'Streaming criada com sucesso', codigo: result.insertId });

  } catch (error) {
    console.error('Erro ao criar streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.put('/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const streamingId = req.params.id;

    const [streamingAnterior] = await pool.execute(
      'SELECT * FROM streamings WHERE codigo = ?',
      [streamingId]
    );

    if (streamingAnterior.length === 0) {
      return res.status(404).json({ message: 'Streaming não encontrada' });
    }

    const {
      codigo_cliente, plano_id, codigo_servidor, login, senha, identificacao, email,
      espectadores, bitrate, espaco, descricao, aplicacao, idioma_painel
    } = req.body;

    // Se não tem revenda, usar 0 como padrão
    const clienteId = codigo_cliente && codigo_cliente !== 0 ? codigo_cliente : 0;

    let updateQuery = `
      UPDATE streamings SET 
        codigo_cliente = ?, plano_id = ?, codigo_servidor = ?, login = ?, 
        identificacao = ?, email = ?, espectadores = ?, bitrate = ?, espaco = ?,
        descricao = ?, aplicacao = ?, idioma_painel = ?
    `;

    let params = [
      clienteId, plano_id || null, codigo_servidor, login,
      identificacao, email, espectadores, bitrate, espaco,
      descricao || '', aplicacao || 'live', idioma_painel || 'pt-br'
    ];

    if (senha && senha.trim() !== '') {
      const senhaHash = await bcrypt.hash(senha, 10);
      updateQuery += ', senha = ?, senha_transmissao = ?';
      params.push(senhaHash, senhaHash);
    }

    updateQuery += ' WHERE codigo = ?';
    params.push(streamingId);

    await pool.execute(updateQuery, params);

    await logAdminAction(req.admin.codigo, 'update', 'streamings', streamingId, streamingAnterior[0], req.body, req);

    res.json({ message: 'Streaming atualizada com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const streamingId = req.params.id;

    await pool.execute(
      'UPDATE streamings SET status = ? WHERE codigo = ?',
      [STATUS_ATIVO, streamingId]
    );

    await logAdminAction(req.admin.codigo, 'start', 'streamings', streamingId, null, { status: STATUS_ATIVO }, req);

    res.json({ message: 'Streaming iniciada com sucesso' });

  } catch (error) {
    console.error('Erro ao iniciar streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/:id/stop', authenticateToken, async (req, res) => {
  try {
    const streamingId = req.params.id;

    await pool.execute(
      'UPDATE streamings SET status = ? WHERE codigo = ?',
      [STATUS_INATIVO, streamingId]
    );

    await logAdminAction(req.admin.codigo, 'stop', 'streamings', streamingId, null, { status: STATUS_INATIVO }, req);

    res.json({ message: 'Streaming parada com sucesso' });

  } catch (error) {
    console.error('Erro ao parar streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/:id/restart', authenticateToken, async (req, res) => {
  try {
    const streamingId = req.params.id;

    await pool.execute(
      'UPDATE streamings SET status = ?, ultima_atividade = NOW() WHERE codigo = ?',
      [STATUS_ATIVO, streamingId]
    );

    await logAdminAction(req.admin.codigo, 'restart', 'streamings', streamingId, null, null, req);

    res.json({ message: 'Streaming reiniciada com sucesso' });

  } catch (error) {
    console.error('Erro ao reiniciar streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/:id/block', authenticateToken, async (req, res) => {
  try {
    const streamingId = req.params.id;

    await pool.execute(
      'UPDATE streamings SET status = ? WHERE codigo = ?',
      [STATUS_BLOQUEADO, streamingId]
    );

    await logAdminAction(req.admin.codigo, 'block', 'streamings', streamingId, null, { status: STATUS_BLOQUEADO }, req);

    res.json({ message: 'Streaming bloqueada com sucesso' });

  } catch (error) {
    console.error('Erro ao bloquear streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/:id/unblock', authenticateToken, async (req, res) => {
  try {
    const streamingId = req.params.id;

    await pool.execute(
      'UPDATE streamings SET status = ? WHERE codigo = ?',
      [STATUS_ATIVO, streamingId]
    );

    await logAdminAction(req.admin.codigo, 'unblock', 'streamings', streamingId, null, { status: STATUS_ATIVO }, req);

    res.json({ message: 'Streaming desbloqueada com sucesso' });

  } catch (error) {
    console.error('Erro ao desbloquear streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/:id/sync', authenticateToken, async (req, res) => {
  try {
    const streamingId = req.params.id;

    await pool.execute(
      'UPDATE streamings SET ultima_atividade = NOW() WHERE codigo = ?',
      [streamingId]
    );

    await logAdminAction(req.admin.codigo, 'sync', 'streamings', streamingId, null, null, req);

    res.json({ message: 'Streaming sincronizada com sucesso' });

  } catch (error) {
    console.error('Erro ao sincronizar streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/:id/change-password', authenticateToken, async (req, res) => {
  try {
    const streamingId = req.params.id;
    const { senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.execute(
      'UPDATE streamings SET senha = ?, senha_transmissao = ? WHERE codigo = ?',
      [senhaHash, senhaHash, streamingId]
    );

    await logAdminAction(req.admin.codigo, 'change_password', 'streamings', streamingId, null, null, req);

    res.json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/:id/viewers', authenticateToken, async (req, res) => {
  try {
    const viewers = [
      {
        ip: '192.168.1.100',
        duration: '00:15:30',
        user_agent: 'VLC Media Player'
      },
      {
        ip: '10.0.0.50',
        duration: '01:22:15',
        user_agent: 'OBS Studio'
      }
    ];

    res.json(viewers);

  } catch (error) {
    console.error('Erro ao buscar espectadores:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.delete('/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const streamingId = req.params.id;

    const [streaming] = await pool.execute(
      'SELECT * FROM streamings WHERE codigo = ?',
      [streamingId]
    );

    if (streaming.length === 0) {
      return res.status(404).json({ message: 'Streaming não encontrada' });
    }

    await pool.execute('DELETE FROM streamings WHERE codigo = ?', [streamingId]);

    await logAdminAction(req.admin.codigo, 'delete', 'streamings', streamingId, streaming[0], null, req);

    res.json({ message: 'Streaming excluída com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir streaming:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_streamings,
        SUM(CASE WHEN status = ${STATUS_ATIVO} THEN 1 ELSE 0 END) as streamings_ativas,
        SUM(CASE WHEN status = ${STATUS_INATIVO} THEN 1 ELSE 0 END) as streamings_inativas,
        SUM(CASE WHEN status = ${STATUS_BLOQUEADO} THEN 1 ELSE 0 END) as streamings_bloqueadas,
        SUM(espectadores) as total_espectadores,
        SUM(espaco_usado) as espaco_total_usado
      FROM streamings
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/by-revenda/:revendaId', authenticateToken, async (req, res) => {
  try {
    const [streamings] = await pool.execute(
      `SELECT s.*, ps.nome as plano_nome, ws.nome as servidor_nome
       FROM streamings s
       LEFT JOIN planos_streaming ps ON s.plano_id = ps.codigo
       LEFT JOIN wowza_servers ws ON s.codigo_servidor = ws.codigo
       WHERE s.codigo_cliente = ?
       ORDER BY s.data_cadastro DESC`,
      [req.params.revendaId]
    );

    res.json(streamings);

  } catch (error) {
    console.error('Erro ao buscar streamings da revenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;