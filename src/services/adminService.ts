import { Admin, AdminFormData } from '../types/admin';

class AdminService {
  private baseURL = import.meta.env.VITE_API_URL || '/Admin/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAdmins(page: number = 1, limit: number = 10, filters?: any): Promise<{ admins: Admin[]; total: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${this.baseURL}/admins?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar administradores');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getAdmin(id: number): Promise<Admin> {
    try {
      const response = await fetch(`${this.baseURL}/admins/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar administrador');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async createAdmin(data: AdminFormData): Promise<Admin> {
    try {
      const response = await fetch(`${this.baseURL}/admins`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar administrador');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateAdmin(id: number, data: AdminFormData): Promise<Admin> {
    try {
      const response = await fetch(`${this.baseURL}/admins/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar administrador');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteAdmin(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admins/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir administrador');
      }
    } catch (error) {
      throw error;
    }
  }

  async toggleAdminStatus(id: number, ativo: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admins/${id}/toggle-status`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ativo }),
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar status do administrador');
      }
    } catch (error) {
      throw error;
    }
  }

  async changePassword(id: number, senhaAtual: string, novaSenha: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admins/${id}/change-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao alterar senha');
      }
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();