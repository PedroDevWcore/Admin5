import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Lock, User } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, senha);
      addNotification({
        type: 'success',
        title: 'Login realizado com sucesso!',
        message: 'Bem-vindo ao painel administrativo.'
      });
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro no login',
        message: error.message || 'Credenciais inválidas.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>
      
      <Card className="w-full max-w-lg backdrop-blur-md bg-white/95 shadow-2xl border-0 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="./logo.png" 
              alt="Logo" 
              className="h-24 w-auto drop-shadow-xl"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 text-lg">Faça login para acessar o sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
              className="pl-12 py-4 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
            />
            <User className="absolute left-4 top-11 text-purple-400" size={20} />
          </div>

          <div className="relative">
            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="pl-12 py-4 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
            />
            <Lock className="absolute left-4 top-11 text-purple-400" size={20} />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !senha}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl text-lg"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="font-medium">Sistema Online</span>
          </div>
        </div>
      </Card>
    </div>
  );
};