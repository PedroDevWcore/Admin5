import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { useNotification } from '../contexts/NotificationContext';
import { revendaService } from '../services/revendaService';
import { planService } from '../services/planService';
import { RevendaFormData } from '../types/revenda';
import { RevendaPlan } from '../types/plan';
import { ArrowLeft, Save, User, Settings, Database, Calendar } from 'lucide-react';

export const RevendaForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<RevendaPlan[]>([]);
  const [formData, setFormData] = useState<RevendaFormData>({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    plano_id: undefined,
    streamings: 1,
    espectadores: 100,
    bitrate: 2000,
    espaco: 1000,
    subrevendas: 0,
    status_detalhado: 'ativo',
    data_expiracao: '',
    observacoes_admin: '',
    limite_uploads_diario: 100,
    espectadores_ilimitado: false,
    bitrate_maximo: 5000,
    dominio_padrao: 'https://streaming.exemplo.com',
    idioma_painel: 'pt-br',
    url_suporte: ''
  });

  useEffect(() => {
    loadPlans();
    if (id) {
      loadRevenda();
    }
  }, [id]);

  const loadPlans = async () => {
    try {
      const data = await planService.getActiveRevendaPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      setPlans([]);
    }
  };
  const loadRevenda = async () => {
    try {
      setLoading(true);
      const revenda = await revendaService.getRevenda(Number(id));
      setFormData({
        nome: revenda.nome,
        email: revenda.email,
        telefone: revenda.telefone || '',
        senha: '', // Não carregamos a senha por segurança
        plano_id: revenda.plano_id,
        streamings: revenda.streamings,
        espectadores: revenda.espectadores,
        bitrate: revenda.bitrate,
        espaco: revenda.espaco,
        subrevendas: revenda.subrevendas,
        status_detalhado: revenda.status_detalhado,
        data_expiracao: revenda.data_expiracao || '',
        observacoes_admin: revenda.observacoes_admin || '',
        limite_uploads_diario: revenda.limite_uploads_diario,
        espectadores_ilimitado: revenda.espectadores_ilimitado,
        bitrate_maximo: revenda.bitrate_maximo,
        dominio_padrao: revenda.dominio_padrao,
        idioma_painel: revenda.idioma_painel,
        url_suporte: revenda.url_suporte || ''
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar a revenda.'
      });
      navigate('/revendas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await revendaService.updateRevenda(Number(id), formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Revenda atualizada com sucesso.'
        });
      } else {
        await revendaService.createRevenda(formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Revenda criada com sucesso.'
        });
      }
      navigate('/revendas');
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível salvar a revenda.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePlanChange = (planId: string) => {
    const plan = plans.find(p => p.codigo === Number(planId));
    if (plan) {
      setFormData(prev => ({
        ...prev,
        plano_id: plan.codigo,
        streamings: plan.streamings,
        espectadores: plan.espectadores,
        bitrate: plan.bitrate,
        espaco: plan.espaco_ftp,
        subrevendas: plan.subrevendas
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
          <Button variant="secondary" onClick={() => navigate('/revendas')}>
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
        <Button variant="secondary" onClick={() => navigate('/revendas')}>
          <ArrowLeft size={16} className="mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Editar Revenda' : 'Nova Revenda'}
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
              label="Plano de Revenda"
              value={formData.plano_id?.toString() || ''}
              onChange={(e) => handlePlanChange(e.target.value)}
              options={[
                { value: '', label: 'Sem plano (personalizado)' },
                ...plans.map(p => ({ value: p.codigo.toString(), label: p.nome }))
              ]}
              helperText="Selecione um plano para preencher automaticamente os recursos"
            />
            <Input
              label="Nome *"
              name="nome"
              value={formData.nome}
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
            <Input
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
            <Input
              label={id ? "Nova Senha (deixe vazio para manter)" : "Senha *"}
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              required={!id}
            />
          </div>
        </Card>

        {/* Recursos */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Database className="text-gray-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Recursos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Streamings *"
              name="streamings"
              type="number"
              min="1"
              value={formData.streamings}
              onChange={handleChange}
              required
            />
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
            <Input
              label="Subrevendas"
              name="subrevendas"
              type="number"
              min="0"
              value={formData.subrevendas}
              onChange={handleChange}
            />
            <Input
              label="Limite Uploads Diário"
              name="limite_uploads_diario"
              type="number"
              min="1"
              value={formData.limite_uploads_diario}
              onChange={handleChange}
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Bitrate Máximo (kbps)"
              name="bitrate_maximo"
              type="number"
              min="100"
              value={formData.bitrate_maximo}
              onChange={handleChange}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="espectadores_ilimitado"
                name="espectadores_ilimitado"
                checked={formData.espectadores_ilimitado}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="espectadores_ilimitado" className="text-sm font-medium text-gray-700">
                Espectadores Ilimitados
              </label>
            </div>
          </div>
        </Card>

        {/* Configurações */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="text-gray-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Configurações</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Status *"
              name="status_detalhado"
              value={formData.status_detalhado}
              onChange={handleChange}
              options={[
                { value: 'ativo', label: 'Ativo' },
                { value: 'suspenso', label: 'Suspenso' },
                { value: 'expirado', label: 'Expirado' },
                { value: 'cancelado', label: 'Cancelado' },
                { value: 'teste', label: 'Teste' }
              ]}
              required
            />
            <Select
              label="Idioma do Painel"
              name="idioma_painel"
              value={formData.idioma_painel}
              onChange={handleChange}
              options={[
                { value: 'pt-br', label: 'Português (BR)' },
                { value: 'en-us', label: 'English (US)' },
                { value: 'es', label: 'Español' }
              ]}
            />
            <Input
              label="Domínio Padrão"
              name="dominio_padrao"
              value={formData.dominio_padrao}
              onChange={handleChange}
              helperText="URL base para o painel da revenda"
            />
            <Input
              label="URL de Suporte"
              name="url_suporte"
              value={formData.url_suporte}
              onChange={handleChange}
              helperText="Link para suporte técnico"
            />
          </div>
        </Card>

        {/* Datas e Observações */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="text-gray-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Datas e Observações</h2>
          </div>

          <div className="space-y-6">
            <Input
              label="Data de Expiração"
              name="data_expiracao"
              type="date"
              value={formData.data_expiracao}
              onChange={handleChange}
              helperText="Deixe vazio para conta sem expiração"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações Administrativas
              </label>
              <textarea
                name="observacoes_admin"
                value={formData.observacoes_admin}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Observações internas sobre a revenda..."
              />
            </div>
          </div>
        </Card>

        {/* Botões */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/revendas')}
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