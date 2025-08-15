import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { Table, TableHeader, TableBody, TableCell, TableHeaderCell } from '../components/Table';
import { Pagination } from '../components/Pagination';
import { useNotification } from '../contexts/NotificationContext';
import { logService, DetailedLog } from '../services/logService';
import { Search, Filter, Activity, FileText, User, Calendar } from 'lucide-react';

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<DetailedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState<DetailedLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    loadLogs();
  }, [currentPage, searchTerm, actionFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        acao: actionFilter
      };
      const data = await logService.getLogs(currentPage, 10, filters);
      setLogs(data.logs);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os logs.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'criar':
        return <Activity className="text-green-500" size={16} />;
      case 'update':
      case 'atualizar':
        return <FileText className="text-blue-500" size={16} />;
      case 'delete':
      case 'excluir':
        return <Activity className="text-red-500" size={16} />;
      case 'login':
        return <User className="text-purple-500" size={16} />;
      default:
        return <Activity className="text-gray-500" size={16} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'criar':
        return 'bg-green-100 text-green-800';
      case 'update':
      case 'atualizar':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
      case 'excluir':
        return 'bg-red-100 text-red-800';
      case 'login':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Logs do Sistema</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Últimos registros de atividade</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input
              placeholder="Buscar por administrador, tabela ou IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            options={[
              { value: '', label: 'Todas as ações' },
              { value: 'create', label: 'Criar' },
              { value: 'update', label: 'Atualizar' },
              { value: 'delete', label: 'Excluir' },
              { value: 'login', label: 'Login' },
              { value: 'suspend', label: 'Suspender' },
              { value: 'activate', label: 'Ativar' }
            ]}
          />
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={16} />
            <span className="text-sm text-gray-600">
              {logs.length} registros
            </span>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando logs...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderCell>Data/Hora</TableHeaderCell>
              <TableHeaderCell>Administrador</TableHeaderCell>
              <TableHeaderCell>Ação</TableHeaderCell>
              <TableHeaderCell>Tabela</TableHeaderCell>
              <TableHeaderCell>IP Address</TableHeaderCell>
              <TableHeaderCell>Detalhes</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {formatDate(log.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={12} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{log.admin_nome}</div>
                        <div className="text-xs text-gray-500">ID: {log.admin_id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.acao)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.acao)}`}>
                        {log.acao}
                      </span>
                    </div>
                    {log.detalhes_formatados && (
                      <div className="text-xs text-gray-600 mt-1">
                        {log.detalhes_formatados.acao_descricao}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{log.tabela_afetada}</div>
                    {log.registro_id && (
                      <div className="text-xs text-gray-500">ID: {log.registro_id}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{log.ip_address}</div>
                    <div className="text-xs text-gray-500 truncate max-w-32" title={log.user_agent}>
                      {log.user_agent}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        setSelectedLog(log);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Ver detalhes
                    </button>
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

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Detalhes do Log"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Administrador</label>
                <p className="text-sm text-gray-900">{selectedLog.admin_nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data/Hora</label>
                <p className="text-sm text-gray-900">{formatDate(selectedLog.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ação</label>
                <p className="text-sm text-gray-900">{selectedLog.detalhes_formatados?.acao_descricao}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IP Address</label>
                <p className="text-sm text-gray-900">{selectedLog.ip_address}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">User Agent</label>
              <p className="text-sm text-gray-900 break-all">{selectedLog.user_agent}</p>
            </div>

            {selectedLog.dados_anteriores && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Dados Anteriores</label>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
                  {JSON.stringify(selectedLog.dados_anteriores, null, 2)}
                </pre>
              </div>
            )}

            {selectedLog.dados_novos && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Dados Novos</label>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
                  {JSON.stringify(selectedLog.dados_novos, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};