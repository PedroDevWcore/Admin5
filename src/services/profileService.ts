import { AccessProfile, ProfileFormData } from '../types/profile';

class ProfileService {
  private baseURL = import.meta.env.VITE_API_URL || '/Admin/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getProfiles(page: number = 1, limit: number = 10, filters?: any): Promise<{ profiles: AccessProfile[]; total: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${this.baseURL}/profiles?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar perfis de acesso');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getProfile(id: number): Promise<AccessProfile> {
    try {
      const response = await fetch(`${this.baseURL}/profiles/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar perfil de acesso');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async createProfile(data: ProfileFormData): Promise<AccessProfile> {
    try {
      const response = await fetch(`${this.baseURL}/profiles`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar perfil de acesso');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(id: number, data: ProfileFormData): Promise<AccessProfile> {
    try {
      const response = await fetch(`${this.baseURL}/profiles/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar perfil de acesso');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteProfile(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/profiles/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir perfil de acesso');
      }
    } catch (error) {
      throw error;
    }
  }

  async toggleProfileStatus(id: number, ativo: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/profiles/${id}/toggle-status`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ativo }),
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar status do perfil');
      }
    } catch (error) {
      throw error;
    }
  }
}

export const profileService = new ProfileService();