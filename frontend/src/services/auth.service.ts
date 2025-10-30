import apiClient from '../lib/api';
import { freighterService } from '../lib/freighter';

export interface RegisterData {
  email: string;
  name: string;
  role: 'PRODUCER' | 'VALIDATOR' | 'INVESTOR';
  stellarPublicKey: string;
  phone?: string;
  location?: string;
}

export class AuthService {
  async register(data: RegisterData) {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  }

  async login(stellarPublicKey: string) {
    const response = await apiClient.post('/api/auth/login', { stellarPublicKey });
    return response.data;
  }

  async connectWallet(): Promise<string> {
    try {
      const publicKey = await freighterService.connect();
      if (!publicKey) {
        throw new Error('No se pudo obtener la clave pública de Freighter');
      }
      return publicKey;
    } catch (error: any) {
      console.error('Error in connectWallet:', error);
      throw error;
    }
  }

  async loginWithWallet(): Promise<any> {
    const publicKey = await this.connectWallet();
    
    if (!publicKey) {
      throw new Error('Failed to connect wallet');
    }

    try {
      return await this.login(publicKey);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('User not registered. Please register first.');
      }
      throw error;
    }
  }
}

export const authService = new AuthService();
