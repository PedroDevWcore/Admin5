import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireLevel } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/logger.js';

const router = express.Router();

// Listar servidores Wowza
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (nome LIKE ? OR ip LIKE ? OR dominio LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Contar total
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM wowza_servers ${whereClause}`,
      params
    );

    // Buscar servidores
    const [servers] = await pool.execute(
      `SELECT ws.*, wsp.nome as servidor_principal_nome,
              (SELECT COUNT(*) FROM streamings s WHERE s.codigo_servidor = ws.codigo) as streamings_ativas
       FROM wowza_servers ws
       LEFT JOIN wowza_servers wsp ON ws.servidor_principal_id = wsp.codigo
       ${whereClause} 
       ORDER BY ws.data_criacao DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      servers,
      total: countResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar servidores:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar servidor por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [servers] = await pool.execute(
      `SELECT ws.*, wsp.nome as servidor_principal_nome,
              (SELECT COUNT(*) FROM streamings s WHERE s.codigo_servidor = ws.codigo) as streamings_ativas
       FROM wowza_servers ws
       LEFT JOIN wowza_servers wsp ON ws.servidor_principal_id = wsp.codigo
       WHERE ws.codigo = ?`,
      [req.params.id]
    );

    if (servers.length === 0) {
      return res.status(404).json({ message: 'Servidor não encontrado' });
    }

    res.json(servers[0]);

  } catch (error) {
    console.error('Erro ao buscar servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar servidor
router.post('/', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const {
      nome, ip, senha_root, porta_ssh, caminho_home, limite_streamings,
      grafico_trafego, servidor_principal_id, tipo_servidor, dominio
    } = req.body;

    // Verificar se IP já existe
    const [existingServer] = await pool.execute(
      'SELECT codigo FROM wowza_servers WHERE ip = ?',
      [ip]
    );

    if (existingServer.length > 0) {
      return res.status(400).json({ message: 'IP já está em uso por outro servidor' });
    }

    const [result] = await pool.execute(
      `INSERT INTO wowza_servers (
        nome, ip, senha_root, porta_ssh, caminho_home, limite_streamings,
        grafico_trafego, servidor_principal_id, tipo_servidor, dominio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome, ip, senha_root, porta_ssh, caminho_home, limite_streamings,
        grafico_trafego ? 1 : 0, servidor_principal_id || null, tipo_servidor, dominio
      ]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'create', 'wowza_servers', result.insertId, null, req.body, req);

    res.status(201).json({ message: 'Servidor criado com sucesso', codigo: result.insertId });

  } catch (error) {
    console.error('Erro ao criar servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar servidor
router.put('/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const serverId = req.params.id;
    
    // Buscar dados anteriores
    const [serverAnterior] = await pool.execute(
      'SELECT * FROM wowza_servers WHERE codigo = ?',
      [serverId]
    );

    if (serverAnterior.length === 0) {
      return res.status(404).json({ message: 'Servidor não encontrado' });
    }

    const {
      nome, ip, senha_root, porta_ssh, caminho_home, limite_streamings,
      grafico_trafego, servidor_principal_id, tipo_servidor, dominio
    } = req.body;

    await pool.execute(
      `UPDATE wowza_servers SET 
        nome = ?, ip = ?, senha_root = ?, porta_ssh = ?, caminho_home = ?,
        limite_streamings = ?, grafico_trafego = ?, servidor_principal_id = ?,
        tipo_servidor = ?, dominio = ?, data_atualizacao = NOW()
       WHERE codigo = ?`,
      [
        nome, ip, senha_root, porta_ssh, caminho_home, limite_streamings,
        grafico_trafego ? 1 : 0, servidor_principal_id || null, tipo_servidor, 
        dominio, serverId
      ]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'update', 'wowza_servers', serverId, serverAnterior[0], req.body, req);

    res.json({ message: 'Servidor atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Alterar status do servidor
router.post('/:id/toggle-status', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const serverId = req.params.id;
    const { status } = req.body;

    await pool.execute(
      'UPDATE wowza_servers SET status = ?, data_atualizacao = NOW() WHERE codigo = ?',
      [status, serverId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'change_status', 'wowza_servers', serverId, null, { status }, req);

    res.json({ message: `Servidor ${status} com sucesso` });

  } catch (error) {
    console.error('Erro ao alterar status do servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Sincronizar servidor
router.post('/:id/sync', authenticateToken, async (req, res) => {
  try {
    const serverId = req.params.id;

    // Simular sincronização (aqui você implementaria a lógica real)
    await pool.execute(
      'UPDATE wowza_servers SET ultima_sincronizacao = NOW(), data_atualizacao = NOW() WHERE codigo = ?',
      [serverId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'sync', 'wowza_servers', serverId, null, null, req);

    res.json({ message: 'Servidor sincronizado com sucesso' });

  } catch (error) {
    console.error('Erro ao sincronizar servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Migrar servidor
router.post('/migrate', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const { servidor_origem_id, servidor_destino_id, streamings_selecionadas, manter_configuracoes } = req.body;

    // Verificar se os servidores existem
    const [servidores] = await pool.execute(
      'SELECT codigo FROM wowza_servers WHERE codigo IN (?, ?) AND status = "ativo"',
      [servidor_origem_id, servidor_destino_id]
    );

    if (servidores.length !== 2) {
      return res.status(400).json({ message: 'Servidores inválidos ou inativos' });
    }

    // Criar registro de migração
    const [migrationResult] = await pool.execute(
      `INSERT INTO wowza_server_migrations (
        servidor_origem_id, servidor_destino_id, streamings_migradas, 
        status, admin_responsavel, detalhes
      ) VALUES (?, ?, ?, 'iniciada', ?, ?)`,
      [
        servidor_origem_id, servidor_destino_id, 
        JSON.stringify(streamings_selecionadas),
        req.admin.codigo,
        `Migração iniciada. Manter configurações: ${manter_configuracoes ? 'Sim' : 'Não'}`
      ]
    );

    // Aqui você implementaria a lógica real de migração
    // Por enquanto, vamos simular que foi concluída
    setTimeout(async () => {
      await pool.execute(
        'UPDATE wowza_server_migrations SET status = "concluida", data_fim = NOW() WHERE codigo = ?',
        [migrationResult.insertId]
      );
    }, 5000);

    // Log da ação
    await logAdminAction(req.admin.codigo, 'migrate', 'wowza_servers', servidor_origem_id, null, req.body, req);

    res.json({ 
      message: 'Migração iniciada com sucesso',
      migration_id: migrationResult.insertId
    });

  } catch (error) {
    console.error('Erro ao migrar servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir servidor
router.delete('/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const serverId = req.params.id;

    // Verificar se há revendas usando este servidor
    const [revendasUsandoServidor] = await pool.execute(
      'SELECT COUNT(*) as total FROM revendas WHERE codigo_wowza_servidor = ?',
      [serverId]
    );

    if (revendasUsandoServidor[0].total > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir este servidor pois há revendas utilizando-o' 
      });
    }

    // Buscar dados antes de excluir
    const [server] = await pool.execute(
      'SELECT * FROM wowza_servers WHERE codigo = ?',
      [serverId]
    );

    if (server.length === 0) {
      return res.status(404).json({ message: 'Servidor não encontrado' });
    }

    await pool.execute('DELETE FROM wowza_servers WHERE codigo = ?', [serverId]);

    // Log da ação
    await logAdminAction(req.admin.codigo, 'delete', 'wowza_servers', serverId, server[0], null, req);

    res.json({ message: 'Servidor excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter estatísticas do servidor
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const serverId = req.params.id;

    const [server] = await pool.execute(
      'SELECT * FROM wowza_servers WHERE codigo = ?',
      [serverId]
    );

    if (server.length === 0) {
      return res.status(404).json({ message: 'Servidor não encontrado' });
    }

    // Buscar estatísticas relacionadas
    const [revendasCount] = await pool.execute(
      'SELECT COUNT(*) as total FROM revendas WHERE codigo_wowza_servidor = ?',
      [serverId]
    );

    const stats = {
      ...server[0],
      total_revendas: revendasCount[0].total,
      utilizacao_cpu: server[0].load_cpu,
      utilizacao_streamings: Math.round((server[0].streamings_ativas / server[0].limite_streamings) * 100)
    };

    res.json(stats);

  } catch (error) {
    console.error('Erro ao buscar estatísticas do servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;