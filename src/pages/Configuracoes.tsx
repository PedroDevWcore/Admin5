import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { Settings, Server, Globe, AlertTriangle, Save } from 'lucide-react';

interface ConfigData {
  codigo: number;
  dominio_padrao: string;
  codigo_wowza_servidor_atual: number;
  servidor_nome: string;
  servidor_ip: string;
  manutencao: string;
}

interface ServerOption {
  codigo: number;
  nome: string;
  ip: string;
  status: string;
}

export const Configuracoes: React.FC = () => {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [servers, setServers] = useState<ServerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addNotification } = useNotification();
  const { admin } = useAuth();

  const [formData, setFormData] = useState({
    dominio_padrao: '',
    codigo_wowza_servidor_atual: 0,
    manutencao: 'nao'
  });

  useEffect(() => {
    if (admin?.nivel_acesso === 'super_admin' || admin?.nivel_acesso === 'admin') {
      loadConfig();
      loadServers();
    }
  }, [admin]);

  const loadConfig = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/Admin/api/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        setFormData({
          dominio_padrao: data.dominio_padrao,
          codigo_wowza_servidor_atual: data.codigo_wowza_servidor_atual,
          manutencao: data.manutencao
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar as configurações.'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadServers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/Admin/api/config/servers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServers(data);
      }
    } catch (error) {
      console.error('Erro ao carregar servidores:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/Admin/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Configurações atualizadas com sucesso.'
        });
        loadConfig();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível atualizar as configurações.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (admin?.nivel_acesso !== 'super_admin' && admin?.nivel_acesso !== 'admin') {
    return (
      <div className="text-center py-8">
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Apenas Super Administradores e Administradores podem acessar as configurações.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configurações Gerais */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="text-gray-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Configurações Gerais</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Domínio Padrão *"
              value={formData.dominio_padrao}
              onChange={(e) => setFormData({ ...formData, dominio_padrao: e.target.value })}
              placeholder="https://painel.exemplo.com"
              helperText="URL base do painel administrativo"
              required
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="manutencao"
                checked={formData.manutencao === 'sim'}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  manutencao: e.target.checked ? 'sim' : 'nao' 
                })}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="manutencao" className="text-sm font-medium text-gray-700">
                Modo Manutenção
              </label>
            </div>

            {formData.manutencao === 'sim' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Modo Manutenção Ativado
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Quando ativado, o sistema ficará indisponível para os usuários finais.
                        Apenas administradores poderão acessar o painel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Configurações do Servidor */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Server className="text-gray-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Servidor Atual</h2>
          </div>
          
          <div className="space-y-4">
            <Select
              label="Servidor Wowza Padrão *"
              value={formData.codigo_wowza_servidor_atual.toString()}
              onChange={(e) => setFormData({ 
                ...formData, 
                codigo_wowza_servidor_atual: Number(e.target.value) 
              })}
              options={[
                { value: '0', label: 'Selecione um servidor' },
                ...servers.map(server => ({
                  value: server.codigo.toString(),
                  label: `${server.nome} (${server.ip})`
                }))
              ]}
              helperText="Servidor onde novas revendas serão criadas por padrão"
              required
            />

            {config && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Servidor Atual</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Nome:</strong> {config.servidor_nome}</p>
                  <p><strong>IP:</strong> {config.servidor_ip}</p>
                  <p><strong>Status:</strong> <span className="text-green-600">Ativo</span></p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Botões */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => loadConfig()}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            <Save size={16} className="mr-2" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  );
};