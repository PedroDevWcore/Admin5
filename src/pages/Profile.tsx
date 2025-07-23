import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { adminService } from '../services/adminService';
import { User, Mail, Shield, Clock, Key } from 'lucide-react';

export const Profile: React.FC = () => {
  const { admin } = useAuth();
  const { addNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: admin?.nome || '',
    email: admin?.email || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const handleSave = async () => {
    try {
      // Aqui você implementaria a lógica para salvar as alterações
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Perfil atualizado com sucesso.'
      });
      setIsEditing(false);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o perfil.'
      });
    }
  };

  const handlePasswordChange = async () => {
    if (formData.novaSenha !== formData.confirmarSenha) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'As senhas não coincidem.'
      });
      return;
    }

    try {
      if (admin?.codigo) {
        await adminService.changePassword(admin.codigo, formData.senhaAtual, formData.novaSenha);
      }
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Senha alterada com sucesso.'
      });
      setFormData({
        ...formData,
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível alterar a senha.'
      });
    }
  };

  const getLevelBadge = (level: string) => {
    const badges = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      suporte: 'bg-green-100 text-green-800'
    };
    return badges[level as keyof typeof badges] || badges.admin;
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      super_admin: 'Super Admin',
      admin: 'Administrador',
      suporte: 'Suporte'
    };
    return labels[level as keyof typeof labels] || 'Administrador';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <Button
          variant={isEditing ? 'secondary' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </Button>
      </div>

      {/* Informações Básicas */}
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <User className="text-gray-500" size={20} />
          <h2 className="text-xl font-semibold text-gray-900">Informações Básicas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        )}
      </Card>

      {/* Informações do Sistema */}
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="text-gray-500" size={20} />
          <h2 className="text-xl font-semibold text-gray-900">Informações do Sistema</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">{admin?.usuario}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nível de Acesso
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadge(admin?.nivel_acesso || 'admin')}`}>
                {getLevelLabel(admin?.nivel_acesso || 'admin')}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Alterar Senha */}
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <Key className="text-gray-500" size={20} />
          <h2 className="text-xl font-semibold text-gray-900">Alterar Senha</h2>
        </div>

        <div className="space-y-4">
          <Input
            label="Senha Atual"
            type="password"
            value={formData.senhaAtual}
            onChange={(e) => setFormData({ ...formData, senhaAtual: e.target.value })}
            placeholder="Digite sua senha atual"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nova Senha"
              type="password"
              value={formData.novaSenha}
              onChange={(e) => setFormData({ ...formData, novaSenha: e.target.value })}
              placeholder="Digite a nova senha"
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
              value={formData.confirmarSenha}
              onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
              placeholder="Confirme a nova senha"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handlePasswordChange}
              disabled={!formData.senhaAtual || !formData.novaSenha || !formData.confirmarSenha}
            >
              Alterar Senha
            </Button>
          </div>
        </div>
      </Card>

      {/* Informações de Acesso */}
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="text-gray-500" size={20} />
          <h2 className="text-xl font-semibold text-gray-900">Informações de Acesso</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Último Acesso
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">
                {admin?.ultimo_acesso ? formatDate(admin.ultimo_acesso) : 'Nunca'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Criação
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">
                {admin?.data_criacao ? formatDate(admin.data_criacao) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};