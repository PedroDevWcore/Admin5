import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Revendas } from './pages/Revendas';
import { RevendaForm } from './pages/RevendaForm';
import { Administradores } from './pages/Administradores';
import { Logs } from './pages/Logs';
import { Profile } from './pages/Profile';
import { AccessProfiles } from './pages/AccessProfiles';
import { WowzaServers } from './pages/WowzaServers';
import { Configuracoes } from './pages/Configuracoes';
import { RevendaPlans } from './pages/RevendaPlans';
import { StreamingPlans } from './pages/StreamingPlans';
import { Streamings } from './pages/Streamings';
import { StreamingForm } from './pages/StreamingForm';
import { Layout } from './components/Layout';
import { Toaster } from './components/Toaster';

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Algo deu errado!</h2>
        <p className="text-gray-600 mb-4">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <pre className="text-xs bg-gray-100 p-2 rounded mb-4 overflow-auto">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AuthProvider>
      <NotificationProvider>
        <Router basename="/Admin">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/revendas" element={<Revendas />} />
                      <Route path="/revendas/nova" element={<RevendaForm />} />
                      <Route path="/revendas/:id/editar" element={<RevendaForm />} />
                      <Route path="/planos-revenda" element={<RevendaPlans />} />
                      <Route path="/planos-streaming" element={<StreamingPlans />} />
                      <Route path="/streamings" element={<Streamings />} />
                      <Route path="/streamings/nova" element={<StreamingForm />} />
                      <Route path="/streamings/:id/editar" element={<StreamingForm />} />
                      <Route path="/servidores" element={<WowzaServers />} />
                      <Route path="/administradores" element={<Administradores />} />
                      <Route path="/perfis" element={<AccessProfiles />} />
                      <Route path="/configuracoes" element={<Configuracoes />} />
                      <Route path="/logs" element={<Logs />} />
                      <Route path="/perfil" element={<Profile />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </Router>
      </NotificationProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;