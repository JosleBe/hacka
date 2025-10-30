import * as StellarSdk from '@stellar/stellar-sdk';
import { Horizon } from '@stellar/stellar-sdk';

export const STELLAR_CONFIG = {
  network: process.env.STELLAR_NETWORK || 'testnet',
  horizonUrl: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  passphrase: process.env.STELLAR_PASSPHRASE || StellarSdk.Networks.TESTNET,
  contractId: process.env.CONTRACT_ID || '',
};

export const getServer = (): Horizon.Server => {
  return new Horizon.Server(STELLAR_CONFIG.horizonUrl);
};

export const getNetworkPassphrase = (): string => {
  return STELLAR_CONFIG.passphrase;
};
