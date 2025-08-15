import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Table, TableHeader, TableBody, TableCell, TableHeaderCell } from '../components/Table';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';
import { AccessProfile, ProfileFormData, ProfilePermissions } from '../types/profile';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Shield,
    Settings,
    Users,
    Eye,
    EyeOff,
    Check,
    X
} from 'lucide-react';

export const AccessProfiles: React.FC = () => {
    const [profiles, setProfiles] = useState<AccessProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProfile, setSelectedProfile] = useState<AccessProfile | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { addNotification } = useNotification();
    const { admin: currentAdmin } = useAuth();

    const defaultPermissions: ProfilePermissions = {
        dashboard: { visualizar: false },
        revendas: { visualizar: false, criar: false, editar: false, excluir: false, suspender: false, ativar: false },
        planos_revenda: { visualizar: false, criar: false, editar: false, excluir: false },
        planos_streaming: { visualizar: false, criar: false, editar: false, excluir: false },
        streamings: { visualizar: false, criar: false, editar: false, excluir: false, controlar: false },
        administradores: { visualizar: false, criar: false, editar: false, excluir: false, alterar_status: false },
        servidores: { visualizar: false, criar: false, editar: false, excluir: false, migrar: false, sincronizar: false, inativar: false },
        perfis: { visualizar: false, criar: false, editar: false, excluir: false },
        configuracoes: { visualizar: false, editar: false },
        logs: { visualizar: false }
    };

    const [formData, setFormData] = useState<ProfileFormData>({
        nome: '',
        descricao: '',
        permissoes: defaultPermissions,
        ativo: true
    });

    useEffect(() => {
        if (currentAdmin?.nivel_acesso === 'super_admin') {
            loadProfiles();
        }
    }, [currentPage, searchTerm, currentAdmin]);

    const loadProfiles = async () => {
        try {
            setLoading(true);
            const filters = { search: searchTerm };
            const data = await profileService.getProfiles(currentPage, 10, filters);
            setProfiles(data.profiles);
            setTotalPages(Math.ceil(data.total / 10));
        } catch (error: any) {
            addNotification({
                type: 'error',
                title: 'Erro',
                message: 'Não foi possível carregar os perfis de acesso.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing && selectedProfile) {
                await profileService.updateProfile(selectedProfile.codigo, formData);
                addNotification({
                    type: 'success',
                    title: 'Sucesso',
                    message: 'Perfil de acesso atualizado com sucesso.'
                });
            } else {
                await profileService.createProfile(formData);
                addNotification({
                    type: 'success',
                    title: 'Sucesso',
                    message: 'Perfil de acesso criado com sucesso.'
                });
            }

            setShowFormModal(false);
            resetForm();
            loadProfiles();
        } catch (error: any) {
            addNotification({
                type: 'error',
                title: 'Erro',
                message: error.message || 'Não foi possível salvar o perfil de acesso.'
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedProfile) return;

        try {
            await profileService.deleteProfile(selectedProfile.codigo);
            addNotification({
                type: 'success',
                title: 'Sucesso',
                message: 'Perfil de acesso excluído com sucesso.'
            });
            setShowDeleteModal(false);
            setSelectedProfile(null);
            loadProfiles();
        } catch (error: any) {
            addNotification({
                type: 'error',
                title: 'Erro',
                message: error.message || 'Não foi possível excluir o perfil de acesso.'
            });
        }
    };

    const handleToggleStatus = async (profile: AccessProfile) => {
        try {
            await profileService.toggleProfileStatus(profile.codigo, !profile.ativo);
            addNotification({
                type: 'success',
                title: 'Sucesso',
                message: `Perfil ${!profile.ativo ? 'ativado' : 'desativado'} com sucesso.`
            });
            loadProfiles();
        } catch (error: any) {
            addNotification({
                type: 'error',
                title: 'Erro',
                message: error.message || 'Não foi possível alterar o status do perfil.'
            });
        }
    };

    const openCreateModal = () => {
        resetForm();
        setIsEditing(false);
        setShowFormModal(true);
    };

    const openEditModal = (profile: AccessProfile) => {
        setFormData({
            nome: profile.nome,
            descricao: profile.descricao || '',
            permissoes: profile.permissoes,
            ativo: profile.ativo
        });
        setSelectedProfile(profile);
        setIsEditing(true);
        setShowFormModal(true);
    };

    const resetForm = () => {
        setFormData({
            nome: '',
            descricao: '',
            permissoes: defaultPermissions,
            ativo: true
        });
        setSelectedProfile(null);
    };

    const updatePermission = (module: keyof ProfilePermissions, action: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            permissoes: {
                ...prev.permissoes,
                [module]: {
                    ...prev.permissoes[module],
                    [action]: value
                }
            }
        }));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getModuleLabel = (module: string) => {
        const labels: { [key: string]: string } = {
            dashboard: 'Dashboard',
            revendas: 'Revendas',
            planos_revenda: 'Planos de Revenda',
            planos_streaming: 'Planos de Streaming',
            streamings: 'Streamings',
            administradores: 'Administradores',
            servidores: 'Servidores',
            perfis: 'Perfis de Acesso',
            configuracoes: 'Configurações',
            logs: 'Logs do Sistema'
        };
        return labels[module] || module;
    };

    const getActionLabel = (action: string) => {
        const labels: { [key: string]: string } = {
            visualizar: 'Visualizar',
            criar: 'Criar',
            editar: 'Editar',
            excluir: 'Excluir',
            suspender: 'Suspender',
            ativar: 'Ativar',
            alterar_status: 'Alterar Status',
            migrar: 'Migrar',
            sincronizar: 'Sincronizar',
            inativar: 'Inativar',
            controlar: 'Controlar'
        };
        return labels[action] || action.replace('_', ' ');
    };

    if (currentAdmin?.nivel_acesso !== 'super_admin') {
        return (
            <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Apenas Super Administradores podem gerenciar perfis de acesso.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Perfis de Acesso</h1>
                <Button onClick={openCreateModal}>
                    <Plus size={16} className="mr-2" />
                    Novo Perfil
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
                        <Users className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-600">
                            {profiles.length} perfis
                        </span>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Carregando perfis...</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableHeaderCell>Perfil</TableHeaderCell>
                            <TableHeaderCell>Permissões</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell>Data Criação</TableHeaderCell>
                            <TableHeaderCell>Ações</TableHeaderCell>
                        </TableHeader>
                        <TableBody>
                            {profiles.map((profile) => (
                                <tr key={profile.codigo} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <Shield className="text-purple-600" size={16} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{profile.nome}</div>
                                                {profile.descricao && (
                                                    <div className="text-sm text-gray-500">{profile.descricao}</div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {Object.entries(profile.permissoes).map(([module, permissions]) => {
                                                const hasPermissions = Object.values(permissions).some(p => p === true);
                                                if (!hasPermissions) return null;

                                                return (
                                                    <span
                                                        key={module}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                    >
                                                        {module}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {profile.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-900">
                                            {formatDate(profile.data_criacao)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openEditModal(profile)}
                                                className="text-gray-600 hover:text-gray-800"
                                                title="Editar"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(profile)}
                                                className={profile.ativo ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"}
                                                title={profile.ativo ? "Desativar" : "Ativar"}
                                            >
                                                {profile.ativo ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProfile(profile);
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
                title={isEditing ? 'Editar Perfil de Acesso' : 'Novo Perfil de Acesso'}
                size="xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nome do Perfil *"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            required
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
                                Perfil Ativo
                            </label>
                        </div>
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
                            placeholder="Descrição do perfil de acesso..."
                        />
                    </div>

                    {/* Permissions */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Permissões</h3>
                        <div className="space-y-6">
                            {Object.entries(formData.permissoes).map(([module, permissions]) => (
                                <div key={module} className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3 capitalize">{getModuleLabel(module)}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {Object.entries(permissions).map(([action, value]) => (
                                            <div key={action} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`${module}-${action}`}
                                                    checked={value as boolean}
                                                    onChange={(e) => updatePermission(module as keyof ProfilePermissions, action, e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor={`${module}-${action}`} className="text-sm text-gray-700 capitalize">
                                                    {getActionLabel(action)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
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
                        Tem certeza que deseja excluir o perfil <strong>{selectedProfile?.nome}</strong>?
                    </p>
                    <p className="text-sm text-red-600">
                        Esta ação não pode ser desfeita e todos os administradores com este perfil perderão suas permissões.
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