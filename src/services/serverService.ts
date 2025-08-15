import { WowzaServer, ServerFormData, ServerMigration } from '../types/server';

class ServerService {
  private baseURL = import.meta.env.VITE_API_URL || '/Admin/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getServers(page: number = 1, limit: number = 10, filters?: any): Promise<{ servers: WowzaServer[]; total: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${this.baseURL}/servers?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar servidores');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getServer(id: number): Promise<WowzaServer> {
    try {
      const response = await fetch(`${this.baseURL}/servers/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar servidor');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async createServer(data: ServerFormData): Promise<WowzaServer> {
    try {
      const response = await fetch(`${this.baseURL}/servers`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar servidor');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateServer(id: number, data: ServerFormData): Promise<WowzaServer> {
    try {
      const response = await fetch(`${this.baseURL}/servers/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar servidor');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteServer(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/servers/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir servidor');
      }
    } catch (error) {
      throw error;
    }
  }

  async toggleServerStatus(id: number, status: 'ativo' | 'inativo'): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/servers/${id}/toggle-status`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar status do servidor');
      }
    } catch (error) {
      throw error;
    }
  }

  async syncServer(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/servers/${id}/sync`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao sincronizar servidor');
      }
    } catch (error) {
      throw error;
    }
  }

  async migrateServer(migration: ServerMigration): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/servers/migrate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(migration),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao migrar servidor');
      }
    } catch (error) {
      throw error;
    }
  }

  async getServerStats(id: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/servers/${id}/stats`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas do servidor');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const serverService = new ServerService();