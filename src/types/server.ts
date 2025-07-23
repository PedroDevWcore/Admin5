export interface WowzaServer {
  codigo: number;
  nome: string;
  ip: string;
  senha_root: string;
  porta_ssh: number;
  caminho_home: string;
  limite_streamings: number;
  grafico_trafego: boolean;
  servidor_principal_id?: number;
  servidor_principal?: WowzaServer;
  tipo_servidor: 'principal' | 'secundario' | 'unico';
  dominio?: string;
  streamings_ativas?: number;
  load_cpu: number;
  trafego_rede_atual: number; // MB/s
  trafego_mes: number; // GB
  status: 'ativo' | 'inativo' | 'manutencao';
  data_criacao: string;
  data_atualizacao: string;
  ultima_sincronizacao?: string;
}

export interface ServerFormData {
  nome: string;
  ip: string;
  senha_root: string;
  porta_ssh: number;
  caminho_home: string;
  limite_streamings: number;
  grafico_trafego: boolean;
  servidor_principal_id?: number;
  tipo_servidor: 'principal' | 'secundario' | 'unico';
  dominio?: string;
}

export interface ServerMigration {
  servidor_origem_id: number;
  servidor_destino_id: number;
  streamings_selecionadas: number[];
  manter_configuracoes: boolean;
}