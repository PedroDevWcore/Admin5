export interface AccessProfile {
  codigo: number;
  nome: string;
  descricao?: string;
  permissoes: ProfilePermissions;
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
  criado_por: number;
}

export interface ProfilePermissions {
  dashboard: {
    visualizar: boolean;
  };
  revendas: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
    suspender: boolean;
    ativar: boolean;
  };
  planos_revenda: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
  };
  planos_streaming: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
  };
  streamings: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
    controlar: boolean;
  };
  planos_revenda: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
  };
  planos_streaming: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
  };
  streamings: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
    controlar: boolean;
  };
  administradores: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
    alterar_status: boolean;
  };
  servidores: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
    migrar: boolean;
    sincronizar: boolean;
    inativar: boolean;
  };
  perfis: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
  };
  configuracoes: {
    visualizar: boolean;
    editar: boolean;
  };
  configuracoes: {
    visualizar: boolean;
    editar: boolean;
  };
  logs: {
    visualizar: boolean;
  };
}

export interface ProfileFormData {
  nome: string;
  descricao?: string;
  permissoes: ProfilePermissions;
  ativo: boolean;
}