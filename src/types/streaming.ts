export interface Streaming {
  codigo: number;
  codigo_cliente: number;
  revenda_nome: string;
  plano_id?: number;
  plano_nome?: string;
  codigo_servidor: number;
  servidor_nome: string;
  servidor_ip: string;
  login: string;
  senha: string;
  identificacao: string;
  email: string;
  espectadores: number;
  bitrate: number;
  espaco: number;
  espaco_usado: number;
  descricao: string;
  srt_status: 'sim' | 'nao';
  aplicacao: 'tv_station_live_ondemand' | 'live' | 'webrtc' | 'ondemand' | 'ip_camera';
  idioma_painel: string;
  status: 'ativo' | 'inativo' | 'bloqueado' | 'suspenso';
  espectadores_conectados: number;
  ultima_atividade?: string;
  data_cadastro: string;
}

export interface StreamingFormData {
  codigo_cliente?: number;
  plano_id?: number;
  codigo_servidor?: number;
  login: string;
  senha: string;
  identificacao: string;
  email: string;
  espectadores: number;
  bitrate: number;
  espaco: number;
  descricao: string;
  aplicacao: 'tv_station_live_ondemand' | 'live' | 'webrtc' | 'ondemand' | 'ip_camera';
  idioma_painel: string;
}

export interface StreamingStats {
  total_streamings: number;
  streamings_ativas: number;
  streamings_inativas: number;
  streamings_bloqueadas: number;
  total_espectadores: number;
  espaco_total_usado: number;
}