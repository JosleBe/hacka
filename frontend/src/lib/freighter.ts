import { 
  isConnected, 
  getPublicKey, 
  signTransaction,
  requestAccess
} from '@stellar/freighter-api';

const STELLAR_NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet';
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_STELLAR_PASSPHRASE || 'Test SDF Network ; September 2015';

export class FreighterService {
  async checkConnection(): Promise<boolean> {
    try {
      return await isConnected();
    } catch (error) {
      console.error('Error checking Freighter connection:', error);
      return false;
    }
  }

  async requestAccess(): Promise<boolean> {
    try {
      // Request access to the wallet - it returns the public key if successful
      await requestAccess();
      return true;
    } catch (error) {
      console.error('Error requesting Freighter access:', error);
      throw error;
    }
  }

  async getPublicKey(): Promise<string> {
    try {
      const publicKey = await getPublicKey();
      return publicKey;
    } catch (error) {
      console.error('Error getting public key:', error);
      throw new Error('No se pudo obtener la clave pública. Asegúrate de haber dado permiso a la aplicación.');
    }
  }

  async signTransaction(xdr: string, network?: string): Promise<string> {
    const networkPassphrase = network || NETWORK_PASSPHRASE;
    try {
      const signedXdr = await signTransaction(xdr, {
        networkPassphrase,
      });
      return signedXdr;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw new Error('Error al firmar la transacción');
    }
  }

  async connect(): Promise<string> {
    try {
      // Step 1: Check if Freighter is installed
      const connected = await isConnected();
      if (!connected) {
        throw new Error('Freighter Wallet no está instalada. Por favor instálala desde https://www.freighter.app/');
      }

      // Step 2: Request access to the wallet
      await this.requestAccess();

      // Step 3: Get the public key
      const publicKey = await this.getPublicKey();
      
      if (!publicKey) {
        throw new Error('No se pudo obtener la clave pública');
      }

      return publicKey;
    } catch (error: any) {
      console.error('Error connecting to Freighter:', error);
      throw new Error(error.message || 'Error al conectar con Freighter Wallet');
    }
  }

  getNetwork(): string {
    return STELLAR_NETWORK;
  }

  getNetworkPassphrase(): string {
    return NETWORK_PASSPHRASE;
  }
}

export const freighterService = new FreighterService();
