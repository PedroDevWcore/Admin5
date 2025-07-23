export interface Revenda {
  codigo: number;
  codigo_revenda: number;
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  plano_id?: number;
  telefone?: string;
  senha: string;
  streamings: number;
  espectadores: number;
  bitrate: number;
  espaco: number;
  subrevendas: number;
  chave_api: string;
  status: number;
  url_suporte?: string;
  data_cadastro: string;
  dominio_padrao: string;
  stm_exibir_tutoriais: 'sim' | 'nao';
  url_tutoriais: string;
  stm_exibir_downloads: 'sim' | 'nao';
  stm_exibir_mini_site: 'sim' | 'nao';
  stm_exibir_app_android_painel: 'sim' | 'nao';
  idioma_painel: string;
  tipo: number;
  ultimo_acesso_data: string;
  ultimo_acesso_ip: string;
  stm_exibir_app_android: 'sim' | 'nao';
  srt_status: 'sim' | 'nao';
  api_token?: string;
  refresh_token?: string;
  configuracoes?: any;
  admin_criador?: number;
  data_expiracao?: string;
  status_detalhado: 'ativo' | 'suspenso' | 'expirado' | 'cancelado' | 'teste';
  observacoes_admin?: string;
  limite_uploads_diario: number;
  espectadores_ilimitado: boolean;
  bitrate_maximo: number;
  total_transmissoes: number;
  ultima_transmissao?: string;
  espaco_usado_mb: number;
  data_ultima_atualizacao: string;
}

export interface RevendaFormData {
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
  plano_id?: number;
  streamings: number;
  espectadores: number;
  bitrate: number;
  espaco: number;
  subrevendas: number;
  status_detalhado: 'ativo' | 'suspenso' | 'expirado' | 'cancelado' | 'teste';
  data_expiracao?: string;
  observacoes_admin?: string;
  limite_uploads_diario: number;
  espectadores_ilimitado: boolean;
  bitrate_maximo: number;
  dominio_padrao: string;
  idioma_painel: string;
  url_suporte?: string;
}

export interface RevendaUsage {
  streamings_usadas: number;
  espectadores_usados: number;
  bitrate_usado: number;
  espaco_usado: number;
  subrevendas_usadas: number;
}