export interface RevendaPlan {
  codigo: number;
  nome: string;
  descricao?: string;
  subrevendas: number;
  streamings: number;
  espectadores: number;
  bitrate: number;
  espaco_ftp: number; // em MB
  transmissao_srt: boolean;
  preco: number | null;
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
  criado_por: number;
}

export interface StreamingPlan {
  codigo: number;
  nome: string;
  descricao?: string;
  espectadores: number;
  bitrate: number;
  espaco_ftp: number; // em MB
  preco: number | null;
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
  criado_por: number;
}

export interface RevendaPlanFormData {
  nome: string;
  descricao?: string;
  subrevendas: number;
  streamings: number;
  espectadores: number;
  bitrate: number;
  espaco_ftp: number;
  transmissao_srt: boolean;
  preco: number;
  ativo: boolean;
}

export interface StreamingPlanFormData {
  nome: string;
  descricao?: string;
  espectadores: number;
  bitrate: number;
  espaco_ftp: number;
  preco: number;
  ativo: boolean;
}