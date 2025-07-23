import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { authenticateToken, requireLevel } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/logger.js';

const router = express.Router();

// Listar administradores
router.get('/', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', nivel_acesso = '', ativo = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (nome LIKE ? OR usuario LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (nivel_acesso) {
      whereClause += ' AND nivel_acesso = ?';
      params.push(nivel_acesso);
    }

    if (ativo !== '') {
      whereClause += ' AND ativo = ?';
      params.push(ativo === 'true' ? 1 : 0);
    }

    // Contar total
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM administradores ${whereClause}`,
      params
    );

    // Buscar administradores
    const [admins] = await pool.execute(
      `SELECT codigo, nome, usuario, email, nivel_acesso, ativo, ultimo_acesso, 
              data_criacao, data_atualizacao, criado_por
       FROM administradores ${whereClause} 
       ORDER BY data_criacao DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      admins,
      total: countResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar administradores:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar administrador por ID
router.get('/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const [admins] = await pool.execute(
      'SELECT codigo, nome, usuario, email, nivel_acesso, ativo, ultimo_acesso, data_criacao, data_atualizacao, criado_por FROM administradores WHERE codigo = ?',
      [req.params.id]
    );

    if (admins.length === 0) {
      return res.status(404).json({ message: 'Administrador não encontrado' });
    }

    res.json(admins[0]);

  } catch (error) {
    console.error('Erro ao buscar administrador:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar administrador
router.post('/', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const { nome, usuario, email, senha, nivel_acesso, ativo } = req.body;

    // Verificar permissões
    if (req.admin.nivel_acesso === 'admin' && nivel_acesso !== 'suporte') {
      return res.status(403).json({ message: 'Administradores só podem criar usuários de suporte' });
    }

    // Verificar se email já existe
    const [existingAdmin] = await pool.execute(
      'SELECT codigo FROM administradores WHERE email = ?',
      [email]
    );

    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Verificar se usuário já existe
    const [existingUser] = await pool.execute(
      'SELECT codigo FROM administradores WHERE usuario = ?',
      [usuario]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Usuário já está em uso' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const [result] = await pool.execute(
      `INSERT INTO administradores (nome, usuario, email, senha, nivel_acesso, ativo, criado_por) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, usuario, email, senhaHash, nivel_acesso, ativo ? 1 : 0, req.admin.codigo]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'create', 'administradores', result.insertId, null, { nome, usuario, email, nivel_acesso, ativo }, req);

    res.status(201).json({ message: 'Administrador criado com sucesso', codigo: result.insertId });

  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar administrador
router.put('/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const adminId = req.params.id;
    const { nome, usuario, email, senha, nivel_acesso, ativo } = req.body;

    // Buscar dados anteriores
    const [adminAnterior] = await pool.execute(
      'SELECT * FROM administradores WHERE codigo = ?',
      [adminId]
    );

    if (adminAnterior.length === 0) {
      return res.status(404).json({ message: 'Administrador não encontrado' });
    }

    // Verificar permissões
    if (req.admin.nivel_acesso === 'admin' && adminAnterior[0].nivel_acesso !== 'suporte') {
      return res.status(403).json({ message: 'Sem permissão para editar este administrador' });
    }

    let updateQuery = `
      UPDATE administradores SET 
        nome = ?, usuario = ?, email = ?, nivel_acesso = ?, ativo = ?, data_atualizacao = NOW()
    `;

    let params = [nome, usuario, email, nivel_acesso, ativo ? 1 : 0];

    // Se senha foi fornecida, incluir na atualização
    if (senha && senha.trim() !== '') {
      const senhaHash = await bcrypt.hash(senha, 10);
      updateQuery += ', senha = ?';
      params.push(senhaHash);
    }

    updateQuery += ' WHERE codigo = ?';
    params.push(adminId);

    await pool.execute(updateQuery, params);

    // Log da ação
    await logAdminAction(req.admin.codigo, 'update', 'administradores', adminId, adminAnterior[0], req.body, req);

    res.json({ message: 'Administrador atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar administrador:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Alterar status do administrador
router.post('/:id/toggle-status', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const adminId = req.params.id;
    const { ativo } = req.body;

    // Verificar se não está tentando desativar a si mesmo
    if (adminId == req.admin.codigo && !ativo) {
      return res.status(400).json({ message: 'Não é possível desativar sua própria conta' });
    }

    await pool.execute(
      'UPDATE administradores SET ativo = ?, data_atualizacao = NOW() WHERE codigo = ?',
      [ativo ? 1 : 0, adminId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, ativo ? 'activate' : 'deactivate', 'administradores', adminId, null, { ativo }, req);

    res.json({ message: `Administrador ${ativo ? 'ativado' : 'desativado'} com sucesso` });

  } catch (error) {
    console.error('Erro ao alterar status do administrador:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Alterar senha
router.post('/:id/change-password', authenticateToken, async (req, res) => {
  try {
    const adminId = req.params.id;
    const { senhaAtual, novaSenha } = req.body;

    // Verificar se está alterando sua própria senha ou se tem permissão
    if (adminId != req.admin.codigo && !['super_admin', 'admin'].includes(req.admin.nivel_acesso)) {
      return res.status(403).json({ message: 'Sem permissão para alterar esta senha' });
    }

    // Se está alterando sua própria senha, verificar senha atual
    if (adminId == req.admin.codigo) {
      const [admin] = await pool.execute(
        'SELECT senha FROM administradores WHERE codigo = ?',
        [adminId]
      );

      const senhaValida = await bcrypt.compare(senhaAtual, admin[0].senha);
      if (!senhaValida) {
        return res.status(400).json({ message: 'Senha atual incorreta' });
      }
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await pool.execute(
      'UPDATE administradores SET senha = ?, data_atualizacao = NOW() WHERE codigo = ?',
      [novaSenhaHash, adminId]
    );

    // Log da ação
    await logAdminAction(req.admin.codigo, 'change_password', 'administradores', adminId, null, null, req);

    res.json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir administrador
router.delete('/:id', authenticateToken, requireLevel(['super_admin', 'admin']), async (req, res) => {
  try {
    const adminId = req.params.id;

    // Verificar se não está tentando excluir a si mesmo
    if (adminId == req.admin.codigo) {
      return res.status(400).json({ message: 'Não é possível excluir sua própria conta' });
    }

    // Buscar dados antes de excluir
    const [admin] = await pool.execute(
      'SELECT * FROM administradores WHERE codigo = ?',
      [adminId]
    );

    if (admin.length === 0) {
      return res.status(404).json({ message: 'Administrador não encontrado' });
    }

    // Verificar permissões
    if (req.admin.nivel_acesso === 'admin' && admin[0].nivel_acesso !== 'suporte') {
      return res.status(403).json({ message: 'Sem permissão para excluir este administrador' });
    }

    await pool.execute('DELETE FROM administradores WHERE codigo = ?', [adminId]);

    // Log da ação
    await logAdminAction(req.admin.codigo, 'delete', 'administradores', adminId, admin[0], null, req);

    res.json({ message: 'Administrador excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir administrador:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;