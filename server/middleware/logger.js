import { pool } from '../config/database.js';

const logAdminAction = async (adminId, acao, tabelaAfetada, registroId = null, dadosAnteriores = null, dadosNovos = null, req) => {
  try {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    // Melhorar o detalhamento dos dados
    let dadosAnterioresFormatados = null;
    let dadosNovosFormatados = null;
    
    if (dadosAnteriores) {
      dadosAnterioresFormatados = typeof dadosAnteriores === 'string' 
        ? dadosAnteriores 
        : JSON.stringify(dadosAnteriores);
    }
    
    if (dadosNovos) {
      // Remover dados sensíveis dos logs
      const dadosLimpos = { ...dadosNovos };
      if (dadosLimpos.senha) {
        dadosLimpos.senha = '[SENHA OCULTA]';
      }
      if (dadosLimpos.senha_root) {
        dadosLimpos.senha_root = '[SENHA OCULTA]';
      }
      if (dadosLimpos.chave_api) {
        dadosLimpos.chave_api = '[CHAVE OCULTA]';
      }
      
      dadosNovosFormatados = JSON.stringify(dadosLimpos);
    }

    await pool.execute(
      `INSERT INTO admin_logs (admin_id, acao, tabela_afetada, registro_id, dados_anteriores, dados_novos, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminId,
        acao,
        tabelaAfetada,
        registroId,
        dadosAnterioresFormatados,
        dadosNovosFormatados,
        ip,
        userAgent
      ]
    );
  } catch (error) {
    console.error('Erro ao registrar log:', error);
  }
};

export { logAdminAction };