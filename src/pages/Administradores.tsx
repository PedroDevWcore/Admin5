import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Table, TableHeader, TableBody, TableCell, TableHeaderCell } from '../components/Table';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { Admin, AdminFormData } from '../types/admin';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Filter,
  Shield,
  User,
  Mail,
  Calendar,
  Key
} from 'lucide-react';

export const Administradores: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [nivelFilter, setNivelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { addNotification } = useNotification();
  const { admin: currentAdmin } = useAuth();

  const [formData, setFormData] = useState<AdminFormData>({
    nome: '',
    usuario: '',
    email: '',
    senha: '',
    nivel_acesso: 'admin',
    ativo: true
  });
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    loadAdmins();
    loadProfiles();
  }, [currentPage, searchTerm, nivelFilter, statusFilter]);

  const loadProfiles = async () => {
    try {
      // Carregar perfis de acesso disponíveis
      const response = await fetch('/Admin/api/profiles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
    }
  };
  const loadAdmins = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        nivel_acesso: nivelFilter,
        ativo: statusFilter
      };
      const data = await adminService.getAdmins(currentPage, 10, filters);
      setAdmins(data.admins);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os administradores.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedAdmin) {
        await adminService.updateAdmin(selectedAdmin.codigo, formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Administrador atualizado com sucesso.'
        });
      } else {
        await adminService.createAdmin(formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Administrador criado com sucesso.'
        });
      }
      
      setShowFormModal(false);
      resetForm();
      loadAdmins();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível salvar o administrador.'
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;

    try {
      await adminService.deleteAdmin(selectedAdmin.codigo);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Administrador excluído com sucesso.'
      });
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      loadAdmins();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível excluir o administrador.'
      });
    }
  };

  const handleToggleStatus = async (admin: Admin) => {
    try {
      await adminService.toggleAdminStatus(admin.codigo, !admin.ativo);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: `Administrador ${!admin.ativo ? 'ativado' : 'desativado'} com sucesso.`
      });
      loadAdmins();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível alterar o status do administrador.'
      });
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowFormModal(true);
  };

  const openEditModal = (admin: Admin) => {
    setFormData({
      nome: admin.nome,
      usuario: admin.usuario,
      email: admin.email,
      senha: '',
      nivel_acesso: admin.nivel_acesso,
      ativo: admin.ativo
    });
    setSelectedAdmin(admin);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      usuario: '',
      email: '',
      senha: '',
      nivel_acesso: 'admin',
      ativo: true
    });
    setSelectedAdmin(null);
  };

  const getNivelBadge = (nivel: string) => {
    const badges = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      suporte: 'bg-green-100 text-green-800'
    };
    return badges[nivel as keyof typeof badges] || badges.admin;
  };

  const getNivelLabel = (nivel: string) => {
    const labels = {
      super_admin: 'Super Admin',
      admin: 'Administrador',
      suporte: 'Suporte'
    };
    return labels[nivel as keyof typeof labels] || 'Administrador';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const canManageAdmin = (admin: Admin) => {
    if (currentAdmin?.nivel_acesso === 'super_admin') return true;
    if (currentAdmin?.nivel_acesso === 'admin' && admin.nivel_acesso === 'suporte') return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Administradores</h1>
        {(currentAdmin?.nivel_acesso === 'super_admin' || currentAdmin?.nivel_acesso === 'admin') && (
          <Button onClick={openCreateModal}>
            <Plus size={16} className="mr-2" />
            Novo Administrador
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input
              placeholder="Buscar por nome, usuário ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={nivelFilter}
            onChange={(e) => setNivelFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos os níveis' },
              { value: 'super_admin', label: 'Super Admin' },
              { value: 'admin', label: 'Administrador' },
              { value: 'suporte', label: 'Suporte' }
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'true', label: 'Ativo' },
              { value: 'false', label: 'Inativo' }
            ]}
          />
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={16} />
            <span className="text-sm text-gray-600">
              {admins.length} resultados
            </span>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando administradores...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderCell>Administrador</TableHeaderCell>
              <TableHeaderCell>Nível de Acesso</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Data Criação</TableHeaderCell>
              <TableHeaderCell>Último Acesso</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <tr key={admin.codigo} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{admin.nome}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                        <div className="text-xs text-gray-400">@{admin.usuario}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNivelBadge(admin.nivel_acesso)}`}>
                      <Shield size={12} className="mr-1" />
                      {getNivelLabel(admin.nivel_acesso)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {formatDate(admin.data_criacao)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {admin.ultimo_acesso ? formatDate(admin.ultimo_acesso) : 'Nunca'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {canManageAdmin(admin) && (
                        <>
                          <button
                            onClick={() => openEditModal(admin)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(admin)}
                            className={admin.ativo ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"}
                            title={admin.ativo ? "Desativar" : "Ativar"}
                          >
                            {admin.ativo ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                          {admin.codigo !== currentAdmin?.codigo && (
                            <button
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </>
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

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={isEditing ? 'Editar Administrador' : 'Novo Administrador'}
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
              label="Usuário *"
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              required
            />
          </div>
          
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Input
            label={isEditing ? "Nova Senha (deixe vazio para manter)" : "Senha *"}
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            required={!isEditing}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Nível de Acesso *"
              value={formData.nivel_acesso}
              onChange={(e) => setFormData({ ...formData, nivel_acesso: e.target.value as any })}
              options={[
                { value: 'suporte', label: 'Suporte' },
                { value: 'admin', label: 'Administrador' },
                ...(currentAdmin?.nivel_acesso === 'super_admin' ? [{ value: 'super_admin', label: 'Super Admin' }] : [])
              ]}
              required
            />
            
            <Select
              label="Perfil de Acesso"
              value={formData.codigo_perfil_acesso?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, codigo_perfil_acesso: e.target.value ? Number(e.target.value) : undefined })}
              options={[
                { value: '', label: 'Usar nível padrão' },
                ...profiles.map(p => ({ value: p.codigo.toString(), label: p.nome }))
              ]}
            />
            
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="ativo" className="text-sm font-medium text-gray-700">
                Administrador Ativo
              </label>
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
            Tem certeza que deseja excluir o administrador <strong>{selectedAdmin?.nome}</strong>?
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
    </div>
  );
};