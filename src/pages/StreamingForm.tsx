import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { useNotification } from '../contexts/NotificationContext';
import { streamingService } from '../services/streamingService';
import { planService } from '../services/planService';
import { revendaService } from '../services/revendaService';
import { serverService } from '../services/serverService';
import { StreamingFormData } from '../types/streaming';
import { Revenda } from '../types/revenda';
import { StreamingPlan } from '../types/plan';
import { WowzaServer } from '../types/server';
import { ArrowLeft, Save, User, Settings, Database, Play } from 'lucide-react';

export const StreamingForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [revendas, setRevendas] = useState<Revenda[]>([]);
  const [plans, setPlans] = useState<StreamingPlan[]>([]);
  const [servers, setServers] = useState<WowzaServer[]>([]);

  const [formData, setFormData] = useState<StreamingFormData>({
    codigo_cliente: undefined,
    plano_id: undefined,
    codigo_servidor: undefined,
    login: '',
    senha: '',
    identificacao: '',
    email: '',
    espectadores: 100,
    bitrate: 2000,
    espaco: 1000,
    descricao: '',
    aplicacao: 'live',
    idioma_painel: 'pt-br'
  });

  useEffect(() => {
    loadInitialData();
    if (id) {
      loadStreaming();
    }
  }, [id]);

  const loadInitialData = async () => {
    try {
      const [revendasData, plansData, serversData] = await Promise.all([
        revendaService.getRevendas(1, 1000),
        planService.getActiveStreamingPlans(),
        serverService.getServers(1, 1000)
      ]);

      setRevendas(revendasData.revendas);
      setPlans(Array.isArray(plansData) ? plansData : []);
      setServers(serversData.servers.filter(s => s.status === 'ativo'));
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os dados iniciais.'
      });
      setPlans([]);
    }
  };

  const loadStreaming = async () => {
    try {
      setLoading(true);
      const streaming = await streamingService.getStreaming(Number(id));
      setFormData({
        codigo_cliente: streaming.codigo_cliente || undefined,
        plano_id: streaming.plano_id,
        codigo_servidor: streaming.codigo_servidor,
        login: streaming.login,
        senha: '', // Não carregamos a senha por segurança
        identificacao: streaming.identificacao,
        email: streaming.email,
        espectadores: streaming.espectadores,
        bitrate: streaming.bitrate,
        espaco: streaming.espaco,
        descricao: streaming.descricao,
        aplicacao: streaming.aplicacao,
        idioma_painel: streaming.idioma_painel
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar a streaming.'
      });
      navigate('/streamings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar dados obrigatórios
      if (!formData.login || !formData.email || !formData.identificacao || !formData.codigo_servidor) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      if (!id && !formData.senha) {
        throw new Error('Senha é obrigatória para nova streaming');
      }

      if (id) {
        await streamingService.updateStreaming(Number(id), formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Streaming atualizada com sucesso.'
        });
      } else {
        await streamingService.createStreaming(formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Streaming criada com sucesso.'
        });
      }
      navigate('/streamings');
    } catch (error: any) {
      console.error('Erro ao salvar streaming:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível salvar a streaming.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' || value === '0' ? undefined : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' || value === '0' ? undefined : value
      }));
    }
  };

  const handlePlanChange = (planId: string) => {
    const plan = plans.find(p => p.codigo === Number(planId));
    if (plan) {
      setFormData(prev => ({
        ...prev,
        plano_id: plan.codigo,
        espectadores: plan.espectadores,
        bitrate: plan.bitrate,
        espaco: plan.espaco_ftp
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        plano_id: undefined
      }));
    }
  };

  if (loading && id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate('/streamings')}>
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Carregando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate('/streamings')}>
          <ArrowLeft size={16} className="mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Editar Streaming' : 'Nova Streaming'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <User className="text-gray-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Informações Básicas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Revenda Responsável"
              name="codigo_cliente"
              value={formData.codigo_cliente?.toString() || ''}
              onChange={handleChange}
              options={[
                { value: '', label: 'Sem revenda específica' },
                ...revendas.map(r => ({ value: r.codigo.toString(), label: `${r.nome} (${r.email})` }))
              ]}
              helperText="Opcional - deixe em branco se não houver revenda específica"
            />
            <Select
              label="Plano de Streaming"
              value={formData.plano_id?.toString() || ''}
              onChange={(e) => handlePlanChange(e.target.value)}
              options={[
                { value: '', label: 'Sem plano (personalizado)' },
                ...plans.map(p => ({ value: p.codigo.toString(), label: p.nome }))
              ]}
            />
            <Input
              label="Login *"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
            />
            <Input
              label={id ? "Nova Senha (deixe vazio para manter)" : "Senha *"}
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              required={!id}
            />
            <Input
              label="Identificação *"
              name="identificacao"
              value={formData.identificacao}
              onChange={handleChange}
              required
            />
            <Input
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </Card>

        {/* Configurações Técnicas */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="text-gray-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Configurações Técnicas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Servidor *"
              name="codigo_servidor"
              value={formData.codigo_servidor?.toString() || ''}
              onChange={handleChange}
              options={[
                { value: '', label: 'Selecione um servidor' },
                ...servers.map(s => ({ value: s.codigo.toString(), label: `${s.nome} (${s.ip})` }))
              ]}
              required
            />
            <Select
              label="Aplicação *"
              name="aplicacao"
              value={formData.aplicacao}
              onChange={handleChange}
              options={[
                { value: 'tv_station_live_ondemand', label: 'TV Station - Live - OnDemand' },
                { value: 'live', label: 'Live' },
                { value: 'webrtc', label: 'WebRTC' },
                { value: 'ondemand', label: 'OnDemand' },
                { value: 'ip_camera', label: 'IP Camera' }
              ]}
              required
            />
            <Select
              label="Idioma *"
              name="idioma_painel"
              value={formData.idioma_painel}
              onChange={handleChange}
              options={[
                { value: 'pt-br', label: 'Português (BR)' },
                { value: 'en-us', label: 'English (US)' },
                { value: 'es', label: 'Español' }
              ]}
              required
            />
            <Input
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descrição da streaming"
            />
          </div>
        </Card>

        {/* Recursos */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Database className="text-gray-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Recursos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Espectadores *"
              name="espectadores"
              type="number"
              min="1"
              value={formData.espectadores}
              onChange={handleChange}
              required
            />
            <Input
              label="Bitrate (kbps) *"
              name="bitrate"
              type="number"
              min="100"
              value={formData.bitrate}
              onChange={handleChange}
              required
            />
            <Input
              label="Espaço (MB) *"
              name="espaco"
              type="number"
              min="100"
              value={formData.espaco}
              onChange={handleChange}
              required
            />
          </div>

          {formData.plano_id && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Plano selecionado:</strong> {plans.find(p => p.codigo === formData.plano_id)?.nome} - Os recursos foram preenchidos automaticamente com base no plano escolhido.
                Você pode ajustá-los conforme necessário.
              </p>
            </div>
          )}
        </Card>

        {/* Botões */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/streamings')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save size={16} className="mr-2" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  );
};