import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Play, 
  Server, 
  Settings, 
  LogOut, 
  BellRing,
  FileText,
  Shield,
  CreditCard
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/revendas', icon: Users, label: 'Revendas' },
    { path: '/streamings', icon: Play, label: 'Streamings' },
    { path: '/servidores', icon: Server, label: 'Servidores' },
    { path: '/planos-streaming', icon: CreditCard, label: 'Planos Streaming' },
    { path: '/planos-revenda', icon: CreditCard, label: 'Planos Revenda' },
    { path: '/administradores', icon: Shield, label: 'Administradores' },
    { path: '/perfis', icon: Users, label: 'Perfis de Acesso' },
    { path: '/logs', icon: FileText, label: 'Logs' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">
            Olá, {admin?.nome || 'Usuário'}
          </p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Painel'}
            </h2>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <BellRing className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{admin?.nome}</p>
                  <p className="text-xs text-gray-500">{admin?.nivel_acesso}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};