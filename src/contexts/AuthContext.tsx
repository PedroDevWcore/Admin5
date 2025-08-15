import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { Admin } from '../types/admin';
import { AccessProfile } from '../types/profile';

interface AuthContextType {
  admin: Admin | null;
  profile: AccessProfile | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [profile, setProfile] = useState<AccessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (token) {
          const adminData = await authService.validateToken(token);
          setAdmin(adminData);
          
          // Carregar perfil se o admin tiver um
          if (adminData.codigo_perfil_acesso) {
            try {
              const profileData = await authService.getProfile(adminData.codigo_perfil_acesso);
              setProfile(profileData);
            } catch (error) {
              console.error('Erro ao carregar perfil:', error);
            }
          }
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await authService.login(email, senha);
      setAdmin(response.admin);
      localStorage.setItem('admin_token', response.token);
      
      // Carregar perfil se o admin tiver um
      if (response.admin.codigo_perfil_acesso) {
        try {
          const profileData = await authService.getProfile(response.admin.codigo_perfil_acesso);
          setProfile(profileData);
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
          // Não falhar o login se não conseguir carregar o perfil
          setProfile(null);
        }
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
    setProfile(null);
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!admin) return false;
    
    // Super admin tem todas as permissões
    if (admin.nivel_acesso === 'super_admin') return true;
    
    // Se tem perfil personalizado, usar suas permissões
    if (profile && profile.permissoes) {
      const modulePermissions = profile.permissoes[module as keyof typeof profile.permissoes];
      if (modulePermissions && typeof modulePermissions === 'object') {
        return modulePermissions[action as keyof typeof modulePermissions] === true;
      }
      return false;
    }
    
    // Permissões padrão por nível
    const defaultPermissions = {
      admin: {
        dashboard: ['visualizar'],
        revendas: ['visualizar', 'criar', 'editar', 'excluir', 'suspender', 'ativar'],
        planos_revenda: ['visualizar', 'criar', 'editar', 'excluir'],
        planos_streaming: ['visualizar', 'criar', 'editar', 'excluir'],
        streamings: ['visualizar', 'criar', 'editar', 'excluir', 'controlar'],
        administradores: ['visualizar', 'criar', 'editar'],
        servidores: ['visualizar', 'criar', 'editar', 'sincronizar'],
        configuracoes: ['visualizar', 'editar'],
        logs: ['visualizar']
      },
      suporte: {
        dashboard: ['visualizar'],
        revendas: ['visualizar'],
        streamings: ['visualizar', 'controlar'],
        logs: ['visualizar']
      }
    };
    
    const levelPermissions = defaultPermissions[admin.nivel_acesso as keyof typeof defaultPermissions];
    if (levelPermissions && levelPermissions[module as keyof typeof levelPermissions]) {
      return levelPermissions[module as keyof typeof levelPermissions].includes(action);
    }
    
    return false;
  };

  const value: AuthContextType = {
    admin,
    profile,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};