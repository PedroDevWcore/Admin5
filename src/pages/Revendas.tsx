import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Table, TableHeader, TableBody, TableCell, TableHeaderCell } from '../components/Table';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { PermissionGuard } from '../components/PermissionGuard';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { revendaService } from '../services/revendaService';
import { Revenda } from '../types/revenda';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Filter,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  Activity
} from 'lucide-react';

export const Revendas: React.FC = () => {
  const [revendas, setRevendas] = useState<Revenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRevenda, setSelectedRevenda] = useState<Revenda | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { addNotification } = useNotification();
  const { hasPermission } = useAuth();

  useEffect(() => {
    loadRevendas();
  }, [currentPage, searchTerm, statusFilter]);

  const loadRevendas = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        status: statusFilter
      };
      const data = await revendaService.getRevendas(currentPage, 10, filters);
      setRevendas(data.revendas);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar as revendas.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRevenda) return;

    try {
      await revendaService.deleteRevenda(selectedRevenda.codigo);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Revenda excluída com sucesso.'
      });
      setShowDeleteModal(false);
      setSelectedRevenda(null);
      loadRevendas();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível excluir a revenda.'
      });
    }
  };

  const handleSuspend = async (id: number) => {
    try {
      await revendaService.suspendRevenda(id);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Revenda suspensa com sucesso.'
      });
      loadRevendas();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível suspender a revenda.'
      });
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await revendaService.activateRevenda(id);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Revenda ativada com sucesso.'
      });
      loadRevendas();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível ativar a revenda.'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ativo: 'bg-green-100 text-green-800',
      suspenso: 'bg-yellow-100 text-yellow-800',
      expirado: 'bg-red-100 text-red-800',
      cancelado: 'bg-gray-100 text-gray-800',
      teste: 'bg-blue-100 text-blue-800'
    };
    return badges[status as keyof typeof badges] || badges.ativo;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      ativo: 'Ativo',
      suspenso: 'Suspenso',
      expirado: 'Expirado',
      cancelado: 'Cancelado',
      teste: 'Teste'
    };
    return labels[status as keyof typeof labels] || 'Ativo';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <PermissionGuard module="revendas" action="visualizar">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Revendas</h1>
        {hasPermission('revendas', 'criar') && (
          <Link to="/revendas/nova">
            <Button>
              <Plus size={16} className="mr-2" />
              Nova Revenda
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input
              placeholder="Buscar por nome, email ou ID..."
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
              { value: 'suspenso', label: 'Suspenso' },
              { value: 'expirado', label: 'Expirado' },
              { value: 'cancelado', label: 'Cancelado' },
              { value: 'teste', label: 'Teste' }
            ]}
          />
          <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
            <Filter className="text-gray-400" size={16} />
            <span className="text-sm text-gray-600">
              {revendas.length} resultados
            </span>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando revendas...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderCell>Revenda</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Recursos</TableHeaderCell>
              <TableHeaderCell>Data Cadastro</TableHeaderCell>
              <TableHeaderCell>Último Acesso</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {revendas.map((revenda) => (
                <tr key={revenda.codigo} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{revenda.nome}</div>
                        <div className="text-sm text-gray-500">{revenda.email}</div>
                        <div className="text-xs text-gray-400">ID: {revenda.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(revenda.status_detalhado)}`}>
                      {getStatusLabel(revenda.status_detalhado)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>Streamings: 0/{revenda.streamings}</div>
                      <div>Espectadores: 0/{revenda.espectadores}</div>
                      <div>Bitrate: 0/{revenda.bitrate} kbps</div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full" 
                          style={{ width: `0%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {formatDate(revenda.data_cadastro)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {formatDate(revenda.ultimo_acesso_data)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRevenda(revenda);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:scale-110"
                        title="Ver detalhes"
                      >
                        <Eye size={18} />
                      </button>
                      {hasPermission('revendas', 'editar') && (
                        <Link
                          to={`/revendas/${revenda.codigo}/editar`}
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                      )}
                      {hasPermission('revendas', 'suspender') && (
                        revenda.status_detalhado === 'ativo' ? (
                          <button
                            onClick={() => handleSuspend(revenda.codigo)}
                            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 transition-all duration-200 hover:scale-110"
                            title="Suspender"
                          >
                            <Pause size={18} />
                          </button>
                        ) : hasPermission('revendas', 'ativar') && (
                          <button
                            onClick={() => handleActivate(revenda.codigo)}
                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 hover:scale-110"
                            title="Ativar"
                          >
                            <Play size={18} />
                          </button>
                        )
                      )}
                      {hasPermission('revendas', 'excluir') && (
                        <button
                          onClick={() => {
                            setSelectedRevenda(revenda);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 hover:scale-110"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Tem certeza que deseja excluir a revenda <strong>{selectedRevenda?.nome}</strong>?
          </p>
          <p className="text-sm text-red-600">
            Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
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

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Detalhes da Revenda"
        size="lg"
      >
        {selectedRevenda && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Informações Básicas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{selectedRevenda.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedRevenda.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium">{selectedRevenda.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedRevenda.status_detalhado)}`}>
                      {getStatusLabel(selectedRevenda.status_detalhado)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recursos</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Streamings:</span>
                    <span className="font-medium">{selectedRevenda.streamings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Espectadores:</span>
                    <span className="font-medium">{selectedRevenda.espectadores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bitrate:</span>
                    <span className="font-medium">{selectedRevenda.bitrate} kbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Espaço:</span>
                    <span className="font-medium">{formatBytes(selectedRevenda.espaco * 1024 * 1024)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Datas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Cadastro:</span>
                    <span className="font-medium">{formatDate(selectedRevenda.data_cadastro)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Último Acesso:</span>
                    <span className="font-medium">{formatDate(selectedRevenda.ultimo_acesso_data)}</span>
                  </div>
                  {selectedRevenda.data_expiracao && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Expiração:</span>
                      <span className="font-medium">{formatDate(selectedRevenda.data_expiracao)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Estatísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Transmissões:</span>
                    <span className="font-medium">{selectedRevenda.total_transmissoes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Espaço Usado:</span>
                    <span className="font-medium">{formatBytes(selectedRevenda.espaco_usado_mb * 1024 * 1024)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subrevendas:</span>
                    <span className="font-medium">{selectedRevenda.subrevendas}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedRevenda.observacoes_admin && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Observações</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedRevenda.observacoes_admin}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
    </PermissionGuard>
  );
};