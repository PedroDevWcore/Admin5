import { AdminLog } from '../types/admin';

export interface DetailedLog extends AdminLog {
  detalhes_formatados?: {
    acao_descricao: string;
    dados_alterados?: any;
    contexto?: string;
  };
}
class LogService {
  private baseURL = import.meta.env.VITE_API_URL || '/Admin/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getLogs(page: number = 1, limit: number = 10, filters?: any): Promise<{ logs: DetailedLog[]; total: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${this.baseURL}/logs?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar logs');
      }

      const data = await response.json();
      
      // Processar logs para adicionar detalhes formatados
      const logsWithDetails = data.logs.map((log: AdminLog) => ({
        ...log,
        detalhes_formatados: this.formatLogDetails(log)
      }));

      return { logs: logsWithDetails, total: data.total };
    } catch (error) {
      throw error;
    }
  }

  private formatLogDetails(log: AdminLog) {
    const acaoDescricoes: { [key: string]: string } = {
      'create': 'Criou',
      'update': 'Atualizou',
      'delete': 'Excluiu',
      'login': 'Fez login',
      'logout': 'Fez logout',
      'suspend': 'Suspendeu',
      'activate': 'Ativou',
      'deactivate': 'Desativou',
      'change_password': 'Alterou senha',
      'sync': 'Sincronizou',
      'migrate': 'Migrou',
      'start': 'Iniciou',
      'stop': 'Parou',
      'restart': 'Reiniciou',
      'block': 'Bloqueou',
      'unblock': 'Desbloqueou'
    };

    const tabelaDescricoes: { [key: string]: string } = {
      'administradores': 'administrador',
      'revendas': 'revenda',
      'streamings': 'streaming',
      'planos_revenda': 'plano de revenda',
      'planos_streaming': 'plano de streaming',
      'wowza_servers': 'servidor',
      'perfis_acesso': 'perfil de acesso',
      'configuracoes': 'configuração do sistema'
    };

    const acao = acaoDescricoes[log.acao] || log.acao;
    const tabela = tabelaDescricoes[log.tabela_afetada] || log.tabela_afetada;
    
    let contexto = '';
    let dadosAlterados = null;

    if (log.dados_novos) {
      try {
        const dados = typeof log.dados_novos === 'string' ? JSON.parse(log.dados_novos) : log.dados_novos;
        dadosAlterados = dados;
        
        // Criar contexto baseado nos dados
        if (dados.nome) {
          contexto = `"${dados.nome}"`;
        } else if (dados.login) {
          contexto = `"${dados.login}"`;
        } else if (dados.email) {
          contexto = `"${dados.email}"`;
        }
      } catch (e) {
        // Ignorar erro de parsing
      }
    }

    return {
      acao_descricao: `${acao} ${tabela}${contexto ? ` ${contexto}` : ''}`,
      dados_alterados: dadosAlterados,
      contexto
    };
  }
}

export const logService = new LogService();