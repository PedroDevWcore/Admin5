import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { useNotification } from '../contexts/NotificationContext';
import { revendaService } from '../services/revendaService';
import { Users, Activity, Server, TrendingUp, UserPlus, UserX, Clock, Database } from 'lucide-react';

interface DashboardStats {
  totalRevendas: number;
  revendasAtivas: number;
  revendasSuspensas: number;
  revendasExpiradas: number;
  totalStreamings: number;
  streamingsAtivas: number;
  streamingsInativas: number;
  streamingsBloqueadas: number;
  totalStreamings: number;
  totalEspectadores: number;
  espacoUsado: number;
  totalBitrate: number;
  totalEspectadoresStreamings: number;
  espacoUsadoStreamings: number;
  totalBitrateStreamings: number;
  espectadoresConectados: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await revendaService.getStats();
      setStats(data);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar as estatísticas.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock size={16} />
          <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white border-0 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Total de Revendas</p>
              <p className="text-4xl font-bold mt-2">{formatNumber(stats?.totalRevendas || 0)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
              <Users size={32} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white border-0 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-semibold uppercase tracking-wide">Revendas Ativas</p>
              <p className="text-4xl font-bold mt-2">{formatNumber(stats?.revendasAtivas || 0)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
              <UserPlus size={32} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white border-0 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide">Total Streamings</p>
              <p className="text-4xl font-bold mt-2">{formatNumber(stats?.totalStreamings || 0)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
              <Activity size={32} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white border-0 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-semibold uppercase tracking-wide">Streamings Ativas</p>
              <p className="text-4xl font-bold mt-2">{formatNumber(stats?.streamingsAtivas || 0)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
              <Activity size={32} />
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recursos Utilizados</h3>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Database className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Espectadores Conectados</span>
              <span className="font-bold text-lg text-gray-900">{formatNumber(stats?.espectadoresConectados || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Espaço Usado (Streamings)</span>
              <span className="font-bold text-lg text-gray-900">{formatBytes((stats?.espacoUsadoStreamings || 0) * 1024 * 1024)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Bitrate Total (Streamings)</span>
              <span className="font-bold text-lg text-gray-900">{formatNumber(stats?.totalBitrateStreamings || 0)} kbps</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Capacidade Total Espectadores</span>
              <span className="font-bold text-lg text-gray-900">{formatNumber(stats?.totalEspectadoresStreamings || 0)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Status dos Serviços</h3>
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                <span className="text-gray-600 font-medium">Revendas Ativas</span>
              </div>
              <span className="font-bold text-lg text-gray-900">{formatNumber(stats?.revendasAtivas || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
                <span className="text-gray-600 font-medium">Revendas Suspensas</span>
              </div>
              <span className="font-bold text-lg text-gray-900">{formatNumber(stats?.revendasSuspensas || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg"></div>
                <span className="text-gray-600 font-medium">Streamings Ativas</span>
              </div>
              <span className="font-bold text-lg text-gray-900">{formatNumber(stats?.streamingsAtivas || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-500 rounded-full shadow-lg"></div>
                <span className="text-gray-600 font-medium">Streamings Inativas</span>
              </div>
              <span className="font-bold text-lg text-gray-900">{formatNumber(stats?.streamingsInativas || 0)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Ações Rápidas</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button 
            onClick={() => navigate('/revendas/nova')}
            className="p-4 sm:p-6 text-left border-2 border-gray-200 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white shadow-lg">
                <UserPlus className="text-white" size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Nova Revenda</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Criar nova conta de revenda</p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => navigate('/servidores')}
            className="p-4 sm:p-6 text-left border-2 border-gray-200 rounded-2xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl text-white shadow-lg">
                <Server className="text-white" size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Gerenciar Servidores</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Configurar servidores de streaming</p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => navigate('/streamings/nova')}
            className="p-4 sm:p-6 text-left border-2 border-gray-200 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl text-white shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Nova Streaming</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Criar nova streaming</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
};