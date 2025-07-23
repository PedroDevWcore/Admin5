import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Table, TableHeader, TableBody, TableCell, TableHeaderCell } from '../components/Table';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { useNotification } from '../contexts/NotificationContext';
import { serverService } from '../services/serverService';
import { WowzaServer, ServerFormData, ServerMigration } from '../types/server';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Server, 
  Activity,
  RefreshCw,
  ArrowRightLeft,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  Wifi,
  HardDrive
} from 'lucide-react';

export const WowzaServers: React.FC = () => {
  const [servers, setServers] = useState<WowzaServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedServer, setSelectedServer] = useState<WowzaServer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState<ServerFormData>({
    nome: '',
    ip: '',
    senha_root: '',
    porta_ssh: 22,
    caminho_home: '/home',
    limite_streamings: 100,
    grafico_trafego: true,
    servidor_principal_id: undefined,
    tipo_servidor: 'unico',
    dominio: ''
  });

  const [migrationData, setMigrationData] = useState<ServerMigration>({
    servidor_origem_id: 0,
    servidor_destino_id: 0,
    streamings_selecionadas: [],
    manter_configuracoes: true
  });

  useEffect(() => {
    loadServers();
  }, [currentPage, searchTerm, statusFilter]);

  const loadServers = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        status: statusFilter
      };
      const data = await serverService.getServers(currentPage, 10, filters);
      setServers(data.servers);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os servidores.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedServer) {
        await serverService.updateServer(selectedServer.codigo, formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Servidor atualizado com sucesso.'
        });
      } else {
        await serverService.createServer(formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Servidor criado com sucesso.'
        });
      }
      
      setShowFormModal(false);
      resetForm();
      loadServers();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível salvar o servidor.'
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedServer) return;

    try {
      await serverService.deleteServer(selectedServer.codigo);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Servidor excluído com sucesso.'
      });
      setShowDeleteModal(false);
      setSelectedServer(null);
      loadServers();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível excluir o servidor.'
      });
    }
  };

  const handleToggleStatus = async (server: WowzaServer) => {
    try {
      const newStatus = server.status === 'ativo' ? 'inativo' : 'ativo';
      await serverService.toggleServerStatus(server.codigo, newStatus);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: `Servidor ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso.`
      });
      loadServers();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível alterar o status do servidor.'
      });
    }
  };

  const handleSync = async (serverId: number) => {
    try {
      await serverService.syncServer(serverId);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Servidor sincronizado com sucesso.'
      });
      loadServers();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível sincronizar o servidor.'
      });
    }
  };

  const handleMigration = async () => {
    try {
      await serverService.migrateServer(migrationData);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Migração iniciada com sucesso.'
      });
      setShowMigrationModal(false);
      loadServers();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível iniciar a migração.'
      });
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowFormModal(true);
  };

  const openEditModal = (server: WowzaServer) => {
    setFormData({
      nome: server.nome,
      ip: server.ip,
      senha_root: server.senha_root,
      porta_ssh: server.porta_ssh,
      caminho_home: server.caminho_home,
      limite_streamings: server.limite_streamings,
      grafico_trafego: server.grafico_trafego,
      servidor_principal_id: server.servidor_principal_id,
      tipo_servidor: server.tipo_servidor,
      dominio: server.dominio || ''
    });
    setSelectedServer(server);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      ip: '',
      senha_root: '',
      porta_ssh: 22,
      caminho_home: '/home',
      limite_streamings: 100,
      grafico_trafego: true,
      servidor_principal_id: undefined,
      tipo_servidor: 'unico',
      dominio: ''
    });
    setSelectedServer(null);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-red-100 text-red-800',
      manutencao: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status as keyof typeof badges] || badges.ativo;
  };

  const getLoadColor = (load: number) => {
    if (load < 50) return 'text-green-600';
    if (load < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Servidores Wowza</h1>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => setShowMigrationModal(true)}>
            <ArrowRightLeft size={16} className="mr-2" />
            Migrar Servidor
          </Button>
          <Button onClick={openCreateModal}>
            <Plus size={16} className="mr-2" />
            Novo Servidor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input
              placeholder="Buscar por nome, IP ou domínio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'ativo', label: 'Ativo' },
              { value: 'inativo', label: 'Inativo' },
              { value: 'manutencao', label: 'Manutenção' }
            ]}
          />
          <div className="flex items-center space-x-2">
            <Server className="text-gray-400" size={16} />
            <span className="text-sm text-gray-600">
              {servers.length} servidores
            </span>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando servidores...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderCell>Nome</TableHeaderCell>
              <TableHeaderCell>IP</TableHeaderCell>
              <TableHeaderCell>Domínio</TableHeaderCell>
              <TableHeaderCell>Porta</TableHeaderCell>
              <TableHeaderCell>Streamings</TableHeaderCell>
              <TableHeaderCell>Load</TableHeaderCell>
              <TableHeaderCell>Tráfego Rede</TableHeaderCell>
              <TableHeaderCell>Tráfego do Mês</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {servers.map((server) => (
                <tr key={server.codigo} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        server.status === 'ativo' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Server className={server.status === 'ativo' ? 'text-green-600' : 'text-red-600'} size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{server.nome}</div>
                        <div className="text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(server.status)}`}>
                            {server.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{server.ip}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{server.dominio || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{server.porta_ssh}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {server.streamings_ativas || 0}/{server.limite_streamings}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${((server.streamings_ativas || 0) / server.limite_streamings) * 100}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm font-medium ${getLoadColor(server.load_cpu)}`}>
                      {server.load_cpu}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {server.trafego_rede_atual} MB/s
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {formatBytes(server.trafego_mes * 1024 * 1024 * 1024)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(server)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleSync(server.codigo)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Sincronizar"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(server)}
                        className={server.status === 'ativo' ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"}
                        title={server.status === 'ativo' ? "Desativar" : "Ativar"}
                      >
                        {server.status === 'ativo' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedServer(server);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={isEditing ? 'Editar Servidor' : 'Novo Servidor'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome *"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
            <Input
              label="IP *"
              value={formData.ip}
              onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Senha Root *"
              type="password"
              value={formData.senha_root}
              onChange={(e) => setFormData({ ...formData, senha_root: e.target.value })}
              required
            />
            <Input
              label="Porta SSH *"
              type="number"
              value={formData.porta_ssh}
              onChange={(e) => setFormData({ ...formData, porta_ssh: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Caminho Home *"
              value={formData.caminho_home}
              onChange={(e) => setFormData({ ...formData, caminho_home: e.target.value })}
              required
            />
            <Input
              label="Limite Streamings *"
              type="number"
              min="1"
              value={formData.limite_streamings}
              onChange={(e) => setFormData({ ...formData, limite_streamings: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Domínio"
              value={formData.dominio}
              onChange={(e) => setFormData({ ...formData, dominio: e.target.value })}
              placeholder="exemplo.com"
            />
            <Select
              label="Tipo de Servidor *"
              value={formData.tipo_servidor}
              onChange={(e) => setFormData({ ...formData, tipo_servidor: e.target.value as any })}
              options={[
                { value: 'unico', label: 'Servidor Único' },
                { value: 'principal', label: 'Servidor Principal' },
                { value: 'secundario', label: 'Servidor Secundário' }
              ]}
              required
            />
          </div>

          {formData.tipo_servidor === 'secundario' && (
            <Select
              label="Servidor Principal"
              value={formData.servidor_principal_id?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, servidor_principal_id: Number(e.target.value) || undefined })}
              options={[
                { value: '', label: 'Selecione um servidor principal' },
                ...servers
                  .filter(s => s.tipo_servidor === 'principal')
                  .map(s => ({ value: s.codigo.toString(), label: s.nome }))
              ]}
            />
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="grafico_trafego"
              checked={formData.grafico_trafego}
              onChange={(e) => setFormData({ ...formData, grafico_trafego: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="grafico_trafego" className="text-sm font-medium text-gray-700">
              Habilitar Gráfico de Tráfego
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowFormModal(false)}
              type="button"
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Migration Modal */}
      <Modal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        title="Migrar Servidor"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Servidor de Origem *"
              value={migrationData.servidor_origem_id.toString()}
              onChange={(e) => setMigrationData({ ...migrationData, servidor_origem_id: Number(e.target.value) })}
              options={[
                { value: '0', label: 'Selecione o servidor de origem' },
                ...servers.map(s => ({ value: s.codigo.toString(), label: `${s.nome} (${s.ip})` }))
              ]}
              required
            />
            <Select
              label="Servidor de Destino *"
              value={migrationData.servidor_destino_id.toString()}
              onChange={(e) => setMigrationData({ ...migrationData, servidor_destino_id: Number(e.target.value) })}
              options={[
                { value: '0', label: 'Selecione o servidor de destino' },
                ...servers
                  .filter(s => s.codigo !== migrationData.servidor_origem_id)
                  .map(s => ({ value: s.codigo.toString(), label: `${s.nome} (${s.ip})` }))
              ]}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="manter_configuracoes"
              checked={migrationData.manter_configuracoes}
              onChange={(e) => setMigrationData({ ...migrationData, manter_configuracoes: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="manter_configuracoes" className="text-sm font-medium text-gray-700">
              Manter Configurações do Servidor de Origem
            </label>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Activity className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Atenção
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    A migração irá mover todas as streamings ativas do servidor de origem para o servidor de destino.
                    Este processo pode levar alguns minutos e as streamings podem ficar temporariamente indisponíveis.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowMigrationModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleMigration}
              disabled={!migrationData.servidor_origem_id || !migrationData.servidor_destino_id}
            >
              Iniciar Migração
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Tem certeza que deseja excluir o servidor <strong>{selectedServer?.nome}</strong>?
          </p>
          <p className="text-sm text-red-600">
            Esta ação não pode ser desfeita e todas as streamings neste servidor serão perdidas.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};