export interface Admin {
  codigo: number;
  nome: string;
  usuario: string;
  senha?: string; // Para criação/edição
  email: string;
  nivel_acesso: 'super_admin' | 'admin' | 'suporte';
  codigo_perfil_acesso?: number;
  ativo: boolean;
  ultimo_acesso: string;
  data_criacao: string;
  data_atualizacao: string;
  criado_por: number | null;
  token_reset?: string;
  token_reset_expira?: string;
}

export interface AdminSession {
  id: number;
  admin_id: number;
  token: string;
  ip_address: string;
  user_agent: string;
  expires_at: string;
  created_at: string;
  last_activity: string;
}

export interface AdminLog {
  id: number;
  admin_id: number;
  admin_nome: string;
  acao: string;
  tabela_afetada: string;
  registro_id: number;
  dados_anteriores: any;
  dados_novos: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface AdminFormData {
  nome: string;
  usuario: string;
  email: string;
  senha: string;
  nivel_acesso: 'super_admin' | 'admin' | 'suporte';
  codigo_perfil_acesso?: number;
  ativo: boolean;
}