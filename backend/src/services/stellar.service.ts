import * as StellarSdk from '@stellar/stellar-sdk';
import { Horizon } from '@stellar/stellar-sdk';
import { STELLAR_CONFIG, getServer } from '../config/stellar';
import { logger } from '../utils/logger';

export class StellarService {
  private server: Horizon.Server;
  private contractId: string;

  constructor() {
    this.server = getServer();
    this.contractId = STELLAR_CONFIG.contractId;
  }

  /**
   * Verifica si una cuenta de Stellar existe
   */
  async accountExists(publicKey: string): Promise<boolean> {
    try {
      await this.server.loadAccount(publicKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene el balance de una cuenta
   */
  async getAccountBalance(publicKey: string): Promise<any[]> {
    try {
      const account = await this.server.loadAccount(publicKey);
      return account.balances;
    } catch (error) {
      logger.error(`Error getting account balance: ${error}`);
      throw error;
    }
  }

  /**
   * Invoca el método create_loan del smart contract
   */
  async createLoan(
    borrowerPublicKey: string,
    borrowerSecret: string,
    amount: string,
    numMilestones: number,
    impactDescription: string,
    impactUnit: string,
    impactTarget: string
  ): Promise<{ loanId: bigint; txHash: string }> {
    try {
      const sourceKeypair = StellarSdk.Keypair.fromSecret(borrowerSecret);
      const sourceAccount = await this.server.loadAccount(sourceKeypair.publicKey());

      // Construir la transacción para invocar el contrato
      const contract = new StellarSdk.Contract(this.contractId);

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_CONFIG.passphrase,
      })
        .addOperation(
          contract.call(
            'create_loan',
            StellarSdk.nativeToScVal(borrowerPublicKey, { type: 'address' }),
            StellarSdk.nativeToScVal(parseInt(amount), { type: 'i128' }),
            StellarSdk.nativeToScVal(numMilestones, { type: 'u32' }),
            StellarSdk.nativeToScVal(impactDescription, { type: 'string' }),
            StellarSdk.nativeToScVal(impactUnit, { type: 'string' }),
            StellarSdk.nativeToScVal(parseInt(impactTarget), { type: 'i128' })
          )
        )
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);

      const result = await this.server.submitTransaction(transaction);
      
      logger.info(`Loan created on blockchain: ${result.hash}`);

      // Obtener el loan_id del resultado
      // Nota: En producción, deberías parsear el resultado para obtener el ID real
      const loanId = BigInt(1); // Placeholder

      return {
        loanId,
        txHash: result.hash,
      };
    } catch (error) {
      logger.error(`Error creating loan on blockchain: ${error}`);
      throw error;
    }
  }

  /**
   * Valida un milestone en el smart contract
   */
  async validateMilestone(
    validatorPublicKey: string,
    validatorSecret: string,
    loanId: bigint,
    milestoneIndex: number,
    impactDelivered: string
  ): Promise<{ txHash: string; amountReleased: string }> {
    try {
      const validatorKeypair = StellarSdk.Keypair.fromSecret(validatorSecret);
      const validatorAccount = await this.server.loadAccount(validatorKeypair.publicKey());

      const contract = new StellarSdk.Contract(this.contractId);

      const transaction = new StellarSdk.TransactionBuilder(validatorAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_CONFIG.passphrase,
      })
        .addOperation(
          contract.call(
            'validate_milestone',
            StellarSdk.nativeToScVal(Number(loanId), { type: 'u64' }),
            StellarSdk.nativeToScVal(milestoneIndex, { type: 'u32' }),
            StellarSdk.nativeToScVal(validatorPublicKey, { type: 'address' }),
            StellarSdk.nativeToScVal(parseInt(impactDelivered), { type: 'i128' })
          )
        )
        .setTimeout(30)
        .build();

      transaction.sign(validatorKeypair);

      const result = await this.server.submitTransaction(transaction);

      logger.info(`Milestone validated on blockchain: ${result.hash}`);

      return {
        txHash: result.hash,
        amountReleased: '1666', // Placeholder
      };
    } catch (error) {
      logger.error(`Error validating milestone: ${error}`);
      throw error;
    }
  }

  /**
   * Añade liquidez al pool
   */
  async addLiquidity(
    investorPublicKey: string,
    investorSecret: string,
    amount: string
  ): Promise<{ txHash: string; newPoolBalance: string }> {
    try {
      const investorKeypair = StellarSdk.Keypair.fromSecret(investorSecret);
      const investorAccount = await this.server.loadAccount(investorKeypair.publicKey());

      const contract = new StellarSdk.Contract(this.contractId);

      const transaction = new StellarSdk.TransactionBuilder(investorAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_CONFIG.passphrase,
      })
        .addOperation(
          contract.call(
            'add_liquidity',
            StellarSdk.nativeToScVal(investorPublicKey, { type: 'address' }),
            StellarSdk.nativeToScVal(parseInt(amount), { type: 'i128' })
          )
        )
        .setTimeout(30)
        .build();

      transaction.sign(investorKeypair);

      const result = await this.server.submitTransaction(transaction);

      logger.info(`Liquidity added: ${result.hash}`);

      return {
        txHash: result.hash,
        newPoolBalance: '0', // Placeholder
      };
    } catch (error) {
      logger.error(`Error adding liquidity: ${error}`);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de un préstamo del smart contract
   */
  async getLoan(loanId: bigint): Promise<any> {
    try {
      // const _contract = new StellarSdk.Contract(this.contractId);
      
      // Nota: En Soroban, necesitas hacer una invocación de solo lectura
      // Esto es un placeholder - implementa según la SDK final de Soroban
      
      logger.info(`Getting loan ${loanId} from blockchain`);
      
      return {
        id: loanId,
        // ... otros campos
      };
    } catch (error) {
      logger.error(`Error getting loan from blockchain: ${error}`);
      throw error;
    }
  }

  /**
   * Genera un código QR para que un validador escanee
   */
  async generateValidationQR(loanId: string, milestoneIndex: number): Promise<string> {
    const QRCode = require('qrcode');
    
    const data = JSON.stringify({
      loanId,
      milestoneIndex,
      timestamp: Date.now(),
    });

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(data);
      return qrCodeDataUrl;
    } catch (error) {
      logger.error(`Error generating QR code: ${error}`);
      throw error;
    }
  }
}

export default new StellarService();
