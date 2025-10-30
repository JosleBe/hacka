import { create } from 'zustand';

interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  network: string;
  connect: (publicKey: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  publicKey: null,
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
  connect: (publicKey) =>
    set({
      isConnected: true,
      publicKey,
    }),
  disconnect: () =>
    set({
      isConnected: false,
      publicKey: null,
    }),
}));
