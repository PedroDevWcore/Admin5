import { Streaming, StreamingFormData, StreamingStats } from '../types/streaming';

class StreamingService {
  private baseURL = import.meta.env.VITE_API_URL || '/Admin/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getStreamings(page: number = 1, limit: number = 10, filters?: any): Promise<{ streamings: Streaming[]; total: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${this.baseURL}/streamings?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar streamings');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getStreaming(id: number): Promise<Streaming> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar streaming');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async createStreaming(data: StreamingFormData): Promise<Streaming> {
    try {
      const response = await fetch(`${this.baseURL}/streamings`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar streaming');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateStreaming(id: number, data: StreamingFormData): Promise<Streaming> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar streaming');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteStreaming(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir streaming');
      }
    } catch (error) {
      throw error;
    }
  }

  // Ações de controle
  async startStreaming(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}/start`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao iniciar streaming');
      }
    } catch (error) {
      throw error;
    }
  }

  async stopStreaming(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}/stop`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao parar streaming');
      }
    } catch (error) {
      throw error;
    }
  }

  async restartStreaming(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}/restart`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao reiniciar streaming');
      }
    } catch (error) {
      throw error;
    }
  }

  async blockStreaming(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}/block`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao bloquear streaming');
      }
    } catch (error) {
      throw error;
    }
  }

  async unblockStreaming(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}/unblock`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao desbloquear streaming');
      }
    } catch (error) {
      throw error;
    }
  }

  async syncStreaming(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}/sync`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao sincronizar streaming');
      }
    } catch (error) {
      throw error;
    }
  }

  async changePassword(id: number, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}/change-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ senha: newPassword }),
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar senha');
      }
    } catch (error) {
      throw error;
    }
  }

  async getConnectedViewers(id: number): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/${id}/viewers`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar espectadores conectados');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getStreamingStats(): Promise<StreamingStats> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/stats`, {
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

  async getStreamingsByRevenda(revendaId: number): Promise<Streaming[]> {
    try {
      const response = await fetch(`${this.baseURL}/streamings/by-revenda/${revendaId}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar streamings da revenda');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const streamingService = new StreamingService();