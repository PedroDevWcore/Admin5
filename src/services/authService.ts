import { Admin } from '../types/admin';
import { AccessProfile } from '../types/profile';

interface LoginResponse {
  admin: Admin;
  token: string;
}

class AuthService {
  private baseURL = import.meta.env.VITE_API_URL || '/Admin/api';

  async login(email: string, senha: string): Promise<LoginResponse> {
    try {
      console.log('Tentando fazer login para:', email);
      console.log('URL da API:', `${this.baseURL}/auth/login`);
      
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch (e) {
          error = { message: 'Erro de comunicação com o servidor' };
        }
        console.error('Erro da API:', error);
        throw new Error(error.message || 'Erro ao fazer login');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no authService.login:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<Admin> {
    try {
      const response = await fetch(`${this.baseURL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    }
  }

  async getProfile(profileId: number): Promise<AccessProfile> {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${this.baseURL}/profiles/${profileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar perfil');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();