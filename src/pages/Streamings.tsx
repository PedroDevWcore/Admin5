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
import { streamingService } from '../services/streamingService';
import { Streaming } from '../types/streaming';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Square,
  RotateCcw,
  Eye,
  Users,
  Key,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  Server,
  Settings,
  Activity,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

export const Streamings: React.FC = () => {
  const [streamings, setStreamings] = useState<Streaming[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStreaming, setSelectedStreaming] = useState<Streaming | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [viewers, setViewers] = useState<any[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const { addNotification } = useNotification();
  const { hasPermission } = useAuth();

  useEffect(() => {
    loadStreamings();
  }, [currentPage, searchTerm, statusFilter]);

  const loadStreamings = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        status: statusFilter
      };
      const data = await streamingService.getStreamings(currentPage, 10, filters);
      setStreamings(data.streamings);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar as streamings.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStreaming) return;

    try {
      await streamingService.deleteStreaming(selectedStreaming.codigo);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Streaming excluída com sucesso.'
      });
      setShowDeleteModal(false);
      setSelectedStreaming(null);
      loadStreamings();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível excluir a streaming.'
      });
    }
  };

  const handleStart = async (id: number) => {
    try {
      await streamingService.startStreaming(id);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Streaming iniciada com sucesso.'
      });
      loadStreamings();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível iniciar a streaming.'
      });
    }
  };

  const handleStop = async (id: number) => {
    try {
      await streamingService.stopStreaming(id);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Streaming parada com sucesso.'
      });
      loadStreamings();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível parar a streaming.'
      });
    }
  };

  const handleRestart = async (id: number) => {
    try {
      await streamingService.restartStreaming(id);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Streaming reiniciada com sucesso.'
      });
      loadStreamings();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível reiniciar a streaming.'
      });
    }
  };

  const handleBlock = async (id: number) => {
    try {
      await streamingService.blockStreaming(id);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Streaming bloqueada com sucesso.'
      });
      loadStreamings();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível bloquear a streaming.'
      });
    }
  };

  const handleUnblock = async (id: number) => {
    try {
      await streamingService.unblockStreaming(id);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Streaming desbloqueada com sucesso.'
      });
      loadStreamings();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível desbloquear a streaming.'
      });
    }
  };

  const handleSync = async (id: number) => {
    try {
      await streamingService.syncStreaming(id);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Streaming sincronizada com sucesso.'
      });
      loadStreamings();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível sincronizar a streaming.'
      });
    }
  };

  const handleChangePassword = async () => {
    if (!selectedStreaming || !newPassword) return;

    try {
      await streamingService.changePassword(selectedStreaming.codigo, newPassword);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Senha alterada com sucesso.'
      });
      setShowPasswordModal(false);
      setNewPassword('');
      setSelectedStreaming(null);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível alterar a senha.'
      });
    }
  };

  const handleViewViewers = async (streaming: Streaming) => {
    try {
      const viewersData = await streamingService.getConnectedViewers(streaming.codigo);
      setViewers(viewersData);
      setSelectedStreaming(streaming);
      setShowViewersModal(true);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível carregar os espectadores.'
      });
    }
  };

  const handleAccessPanel = (streaming: Streaming) => {
    // Abre o painel da streaming em nova aba
    const panelUrl = `${streaming.revenda_nome}/login?email=${streaming.email}&auto=true`;
    window.open(panelUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      bloqueado: 'bg-red-100 text-red-800',
      suspenso: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status as keyof typeof badges] || badges.inativo;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      ativo: 'Ativo',
      inativo: 'Inativo',
      bloqueado: 'Bloqueado',
      suspenso: 'Suspenso'
    };
    return labels[status as keyof typeof labels] || 'Inativo';
  };

  const getApplicationLabel = (app: string) => {
    const labels = {
      tv_station_live_ondemand: 'TV Station - Live - OnDemand',
      live: 'Live',
      webrtc: 'WebRTC',
      ondemand: 'OnDemand',
      ip_camera: 'IP Camera'
    };
    return labels[app as keyof typeof labels] || app;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <PermissionGuard module="streamings" action="visualizar">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Streamings</h1>
        {hasPermission('streamings', 'criar') && (
          <Link to="/streamings/nova">
            <Button>
              <Plus size={16} className="mr-2" />
              Nova Streaming
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input
              placeholder="Buscar por login, email ou identificação..."
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
              { value: 'bloqueado', label: 'Bloqueado' },
              { value: 'suspenso', label: 'Suspenso' }
            ]}
          />
          <div className="flex items-center space-x-2">
            <Activity className="text-gray-400" size={16} />
            <span className="text-sm text-gray-600">
              {streamings.length} streamings
            </span>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando streamings...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderCell>Login</TableHeaderCell>
              <TableHeaderCell>Servidor</TableHeaderCell>
              <TableHeaderCell>Configuração</TableHeaderCell>
              <TableHeaderCell>FTP</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Responsável</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {streamings.map((streaming) => (
                <tr key={streaming.codigo} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Play className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{streaming.login}</div>
                        <div className="text-sm text-gray-500">{streaming.email}</div>
                        <div className="text-xs text-gray-400">{streaming.identificacao}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{streaming.servidor_nome}</div>
                      <div className="text-gray-500">{streaming.servidor_ip}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>Esp: 0/{streaming.espectadores}</div>
                      <div>Bitrate: {streaming.bitrate} kbps</div>
                      <div>App: {getApplicationLabel(streaming.aplicacao)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatBytes(streaming.espaco_usado * 1024 * 1024)}/{formatBytes(streaming.espaco * 1024 * 1024)}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(streaming.espaco_usado / streaming.espaco) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(streaming.status)}`}>
                      {getStatusLabel(streaming.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{streaming.revenda_nome}</div>
                      {(!streaming.revenda_nome || streaming.codigo_cliente === 0) && (
                        <div className="text-gray-500 italic">Sem revenda específica</div>
                      )}
                      {streaming.plano_nome && (
                        <div className="text-gray-500">Plano: {streaming.plano_nome}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {/* Mobile Dropdown */}
                      <div className="relative md:hidden">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === streaming.codigo ? null : streaming.codigo)}
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
                          title="Ações"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openDropdown === streaming.codigo && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="py-1">
                              {hasPermission('streamings', 'controlar') && (
                                streaming.status === 'ativo' ? (
                                  <button
                                    onClick={() => {
                                      handleStop(streaming.codigo);
                                      setOpenDropdown(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Square size={16} className="mr-2" />
                                    Parar
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      handleStart(streaming.codigo);
                                      setOpenDropdown(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                  >
                                    <Play size={16} className="mr-2" />
                                    Iniciar
                                  </button>
                                )
                              )}
                              {hasPermission('streamings', 'controlar') && (
                                <button
                                  onClick={() => {
                                    handleRestart(streaming.codigo);
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                >
                                  <RotateCcw size={16} className="mr-2" />
                                  Reiniciar
                                </button>
                              )}
                              {hasPermission('streamings', 'editar') && (
                                <Link
                                  to={`/streamings/${streaming.codigo}/editar`}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Edit size={16} className="mr-2" />
                                  Editar
                                </Link>
                              )}
                              <button
                                onClick={() => {
                                  handleViewViewers(streaming);
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                              >
                                <Users size={16} className="mr-2" />
                                Ver Espectadores
                              </button>
                              {hasPermission('streamings', 'editar') && (
                                <button
                                  onClick={() => {
                                    setSelectedStreaming(streaming);
                                    setShowPasswordModal(true);
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                                >
                                  <Key size={16} className="mr-2" />
                                  Alterar Senha
                                </button>
                              )}
                              {hasPermission('streamings', 'controlar') && (
                                <button
                                  onClick={() => {
                                    handleSync(streaming.codigo);
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                                >
                                  <RefreshCw size={16} className="mr-2" />
                                  Sincronizar
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleAccessPanel(streaming);
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-cyan-600 hover:bg-cyan-50"
                              >
                                <ExternalLink size={16} className="mr-2" />
                                Acessar Painel
                              </button>
                              {hasPermission('streamings', 'controlar') && (
                                streaming.status === 'bloqueado' ? (
                                  <button
                                    onClick={() => {
                                      handleUnblock(streaming.codigo);
                                      setOpenDropdown(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                  >
                                    <Unlock size={16} className="mr-2" />
                                    Desbloquear
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      handleBlock(streaming.codigo);
                                      setOpenDropdown(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                  >
                                    <Lock size={16} className="mr-2" />
                                    Bloquear
                                  </button>
                                )
                              )}
                              {hasPermission('streamings', 'excluir') && (
                                <button
                                  onClick={() => {
                                    setSelectedStreaming(streaming);
                                    setShowDeleteModal(true);
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Excluir
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Desktop Actions */}
                      <div className="hidden md:flex items-center space-x-2 flex-wrap gap-1">
                      {hasPermission('streamings', 'controlar') && (
                        streaming.status === 'ativo' ? (
                          <button
                            onClick={() => handleStop(streaming.codigo)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 hover:scale-110"
                            title="Parar"
                          >
                            <Square size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStart(streaming.codigo)}
                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 hover:scale-110"
                            title="Iniciar"
                          >
                            <Play size={16} />
                          </button>
                        )
                      )}
                      {hasPermission('streamings', 'controlar') && (
                        <button
                          onClick={() => handleRestart(streaming.codigo)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:scale-110"
                          title="Reiniciar"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                      {hasPermission('streamings', 'editar') && (
                        <Link
                          to={`/streamings/${streaming.codigo}/editar`}
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Link>
                      )}
                      <button
                        onClick={() => handleViewViewers(streaming)}
                        className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 hover:scale-110"
                        title="Ver Espectadores"
                      >
                        <Users size={16} />
                      </button>
                      {hasPermission('streamings', 'editar') && (
                        <button
                          onClick={() => {
                            setSelectedStreaming(streaming);
                            setShowPasswordModal(true);
                          }}
                          className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 hover:scale-110"
                          title="Alterar Senha"
                        >
                          <Key size={16} />
                        </button>
                      )}
                      {hasPermission('streamings', 'controlar') && (
                        <button
                          onClick={() => handleSync(streaming.codigo)}
                          className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 hover:scale-110"
                          title="Sincronizar"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleAccessPanel(streaming)}
                        className="p-2 rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 transition-all duration-200 hover:scale-110"
                        title="Acessar Painel"
                      >
                        <ExternalLink size={16} />
                      </button>
                      {hasPermission('streamings', 'controlar') && (
                        streaming.status === 'bloqueado' ? (
                          <button
                            onClick={() => handleUnblock(streaming.codigo)}
                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 hover:scale-110"
                            title="Desbloquear"
                          >
                            <Unlock size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(streaming.codigo)}
                            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 transition-all duration-200 hover:scale-110"
                            title="Bloquear"
                          >
                            <Lock size={16} />
                          </button>
                        )
                      )}
                      {hasPermission('streamings', 'excluir') && (
                        <button
                          onClick={() => {
                            setSelectedStreaming(streaming);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 hover:scale-110"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      </div>
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
            Tem certeza que deseja excluir a streaming <strong>{selectedStreaming?.login}</strong>?
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

      {/* Viewers Modal */}
      <Modal
        isOpen={showViewersModal}
        onClose={() => setShowViewersModal(false)}
        title={`Espectadores Conectados - ${selectedStreaming?.login}`}
        size="lg"
      >
        <div className="space-y-4">
          {viewers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum espectador conectado no momento.
            </p>
          ) : (
            <div className="space-y-2">
              {viewers.map((viewer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{viewer.ip}</div>
                    <div className="text-sm text-gray-500">
                      Conectado há: {viewer.duration}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {viewer.user_agent}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title={`Alterar Senha - ${selectedStreaming?.login}`}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Nova Senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Digite a nova senha"
          />
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} disabled={!newPassword}>
              Alterar Senha
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dropdown Overlay */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
    </PermissionGuard>
  );
};