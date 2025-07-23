import { Revenda, RevendaFormData } from '../types/revenda';

class RevendaService {
  private baseURL = import.meta.env.VITE_API_URL || '/Admin/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getRevendas(page: number = 1, limit: number = 10, filters?: any): Promise<{ revendas: Revenda[]; total: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${this.baseURL}/revendas?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar revendas');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getRevenda(id: number): Promise<Revenda> {
    try {
      const response = await fetch(`${this.baseURL}/revendas/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar revenda');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async createRevenda(data: RevendaFormData): Promise<Revenda> {
    try {
      const response = await fetch(`${this.baseURL}/revendas`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar revenda');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateRevenda(id: number, data: RevendaFormData): Promise<Revenda> {
    try {
      const response = await fetch(`${this.baseURL}/revendas/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar revenda');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteRevenda(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/revendas/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir revenda');
      }
    } catch (error) {
      throw error;
    }
  }

  async suspendRevenda(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/revendas/${id}/suspend`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao suspender revenda');
      }
    } catch (error) {
      throw error;
    }
  }

  async activateRevenda(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/revendas/${id}/activate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao ativar revenda');
      }
    } catch (error) {
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/stats`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const revendaService = new RevendaService();