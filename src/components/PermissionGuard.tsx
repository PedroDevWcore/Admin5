import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield } from 'lucide-react';

interface PermissionGuardProps {
  children: ReactNode;
  module: string;
  action: string;
  fallback?: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  module, 
  action, 
  fallback 
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(module, action)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="text-center py-8">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Você não tem permissão para acessar esta funcionalidade.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};