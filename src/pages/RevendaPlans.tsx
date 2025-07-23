import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Table, TableHeader, TableBody, TableCell, TableHeaderCell } from '../components/Table';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { useNotification } from '../contexts/NotificationContext';
import { planService } from '../services/planService';
import { RevendaPlan, RevendaPlanFormData } from '../types/plan';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  Users,
  Activity,
  HardDrive,
  Wifi,
  Eye,
  EyeOff
} from 'lucide-react';

export const RevendaPlans: React.FC = () => {
  const [plans, setPlans] = useState<RevendaPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<RevendaPlan | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState<RevendaPlanFormData>({
    nome: '',
    descricao: '',
    subrevendas: 0,
    streamings: 1,
    espectadores: 100,
    bitrate: 2000,
    espaco_ftp: 1000,
    transmissao_srt: false,
    preco: 0,
    ativo: true
  });

  useEffect(() => {
    loadPlans();
  }, [currentPage, searchTerm]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const filters = { search: searchTerm };
      const data = await planService.getRevendaPlans(currentPage, 10, filters);
      setPlans(data.plans);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os planos de revenda.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedPlan) {
        await planService.updateRevendaPlan(selectedPlan.codigo, formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Plano de revenda atualizado com sucesso.'
        });
      } else {
        await planService.createRevendaPlan(formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Plano de revenda criado com sucesso.'
        });
      }
      
      setShowFormModal(false);
      resetForm();
      loadPlans();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível salvar o plano de revenda.'
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;

    try {
      await planService.deleteRevendaPlan(selectedPlan.codigo);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Plano de revenda excluído com sucesso.'
      });
      setShowDeleteModal(false);
      setSelectedPlan(null);
      loadPlans();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível excluir o plano de revenda.'
      });
    }
  };

  const handleToggleStatus = async (plan: RevendaPlan) => {
    try {
      await planService.toggleRevendaPlanStatus(plan.codigo, !plan.ativo);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: `Plano ${!plan.ativo ? 'ativado' : 'desativado'} com sucesso.`
      });
      loadPlans();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível alterar o status do plano.'
      });
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowFormModal(true);
  };

  const openEditModal = (plan: RevendaPlan) => {
    setFormData({
      nome: plan.nome,
      descricao: plan.descricao || '',
      subrevendas: plan.subrevendas,
      streamings: plan.streamings,
      espectadores: plan.espectadores,
      bitrate: plan.bitrate,
      espaco_ftp: plan.espaco_ftp,
      transmissao_srt: plan.transmissao_srt,
      preco: plan.preco || 0,
      ativo: plan.ativo
    });
    setSelectedPlan(plan);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      subrevendas: 0,
      streamings: 1,
      espectadores: 100,
      bitrate: 2000,
      espaco_ftp: 1000,
      transmissao_srt: false,
      preco: 0,
      ativo: true
    });
    setSelectedPlan(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Planos de Revenda</h1>
        <Button onClick={openCreateModal}>
          <Plus size={16} className="mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Package className="text-gray-400" size={16} />
            <span className="text-sm text-gray-600">
              {plans.length} planos
            </span>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando planos...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderCell>Nome</TableHeaderCell>
              <TableHeaderCell>Recursos</TableHeaderCell>
              <TableHeaderCell>Preço</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Data Criação</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <tr key={plan.codigo} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Package className="text-purple-600" size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{plan.nome}</div>
                        {plan.descricao && (
                          <div className="text-sm text-gray-500">{plan.descricao}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-1">
                        <Users size={12} className="text-gray-400" />
                        <span>Sub: {plan.subrevendas} | Streams: {plan.streamings}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Activity size={12} className="text-gray-400" />
                        <span>Esp: {plan.espectadores} | {plan.bitrate} kbps</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HardDrive size={12} className="text-gray-400" />
                        <span>{formatBytes(plan.espaco_ftp)} | SRT: {plan.transmissao_srt ? 'Sim' : 'Não'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {plan.preco ? `R$ ${Number(plan.preco).toFixed(2)}` : 'Gratuito'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plan.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {formatDate(plan.data_criacao)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        className={plan.ativo ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"}
                        title={plan.ativo ? "Desativar" : "Ativar"}
                      >
                        {plan.ativo ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
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
        title={isEditing ? 'Editar Plano de Revenda' : 'Novo Plano de Revenda'}
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
              label="Preço (R$)"
              type="number"
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descrição do plano..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Sub Revendas *"
              type="number"
              min="0"
              value={formData.subrevendas}
              onChange={(e) => setFormData({ ...formData, subrevendas: Number(e.target.value) })}
              required
            />
            <Input
              label="Streamings *"
              type="number"
              min="1"
              value={formData.streamings}
              onChange={(e) => setFormData({ ...formData, streamings: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Espectadores *"
              type="number"
              min="1"
              value={formData.espectadores}
              onChange={(e) => setFormData({ ...formData, espectadores: Number(e.target.value) })}
              required
            />
            <Input
              label="Bitrate (kbps) *"
              type="number"
              min="100"
              value={formData.bitrate}
              onChange={(e) => setFormData({ ...formData, bitrate: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Espaço FTP (MB) *"
              type="number"
              min="100"
              value={formData.espaco_ftp}
              onChange={(e) => setFormData({ ...formData, espaco_ftp: Number(e.target.value) })}
              required
            />
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="transmissao_srt"
                  checked={formData.transmissao_srt}
                  onChange={(e) => setFormData({ ...formData, transmissao_srt: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="transmissao_srt" className="text-sm font-medium text-gray-700">
                  Transmissão SRT
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="ativo" className="text-sm font-medium text-gray-700">
                  Plano Ativo
                </label>
              </div>
            </div>
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

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Tem certeza que deseja excluir o plano <strong>{selectedPlan?.nome}</strong>?
          </p>
          <p className="text-sm text-red-600">
            Esta ação não pode ser desfeita e todas as revendas que usam este plano serão afetadas.
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