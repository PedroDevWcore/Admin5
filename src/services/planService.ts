import { RevendaPlan, StreamingPlan, RevendaPlanFormData, StreamingPlanFormData } from '../types/plan';

class PlanService {
  private baseURL = import.meta.env.VITE_API_URL || '/Admin/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Planos de Revenda
  async getRevendaPlans(page: number = 1, limit: number = 10, filters?: any): Promise<{ plans: RevendaPlan[]; total: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${this.baseURL}/plans/revenda?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar planos de revenda');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getRevendaPlan(id: number): Promise<RevendaPlan> {
    try {
      const response = await fetch(`${this.baseURL}/plans/revenda/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar plano de revenda');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async createRevendaPlan(data: RevendaPlanFormData): Promise<RevendaPlan> {
    try {
      const response = await fetch(`${this.baseURL}/plans/revenda`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar plano de revenda');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateRevendaPlan(id: number, data: RevendaPlanFormData): Promise<RevendaPlan> {
    try {
      const response = await fetch(`${this.baseURL}/plans/revenda/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar plano de revenda');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteRevendaPlan(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/plans/revenda/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir plano de revenda');
      }
    } catch (error) {
      throw error;
    }
  }

  async toggleRevendaPlanStatus(id: number, ativo: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/plans/revenda/${id}/toggle-status`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ativo }),
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar status do plano');
      }
    } catch (error) {
      throw error;
    }
  }

  // Planos de Streaming
  async getStreamingPlans(page: number = 1, limit: number = 10, filters?: any): Promise<{ plans: StreamingPlan[]; total: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${this.baseURL}/plans/streaming?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar planos de streaming');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getStreamingPlan(id: number): Promise<StreamingPlan> {
    try {
      const response = await fetch(`${this.baseURL}/plans/streaming/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar plano de streaming');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async createStreamingPlan(data: StreamingPlanFormData): Promise<StreamingPlan> {
    try {
      const response = await fetch(`${this.baseURL}/plans/streaming`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar plano de streaming');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateStreamingPlan(id: number, data: StreamingPlanFormData): Promise<StreamingPlan> {
    try {
      const response = await fetch(`${this.baseURL}/plans/streaming/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar plano de streaming');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteStreamingPlan(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/plans/streaming/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir plano de streaming');
      }
    } catch (error) {
      throw error;
    }
  }

  async toggleStreamingPlanStatus(id: number, ativo: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/plans/streaming/${id}/toggle-status`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ativo }),
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar status do plano');
      }
    } catch (error) {
      throw error;
    }
  }

  // Buscar planos ativos para seleção
  async getActiveRevendaPlans(): Promise<RevendaPlan[]> {
    try {
      const response = await fetch(`${this.baseURL}/plans/revenda-active`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar planos ativos');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getActiveStreamingPlans(): Promise<StreamingPlan[]> {
    try {
      const response = await fetch(`${this.baseURL}/plans/streaming-active`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar planos ativos');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const planService = new PlanService();