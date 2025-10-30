import prisma from '../config/database';
import stellarService from './stellar.service';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class LoanService {
  /**
   * Crea un nuevo préstamo
   */
  async createLoan(data: {
    borrowerId: string;
    totalAmount: number;
    numMilestones: number;
    impactDescription: string;
    impactUnit: string;
    impactTarget: number;
    borrowerSecret: string; // Temporal - en producción usar firma de wallet
  }) {
    try {
      // Obtener usuario
      const borrower = await prisma.user.findUnique({
        where: { id: data.borrowerId },
      });

      if (!borrower) {
        throw new AppError('Borrower not found', 404);
      }

      // Crear préstamo en blockchain
      const blockchainResult = await stellarService.createLoan(
        borrower.stellarPublicKey,
        data.borrowerSecret,
        (data.totalAmount * 10000000).toString(), // Convertir a stroops
        data.numMilestones,
        data.impactDescription,
        data.impactUnit,
        (data.impactTarget * 100).toString() // Convertir a centavos
      );

      // Crear préstamo en base de datos 
      const loan = await prisma.loan.create({
        data: {
          loanIdOnChain: Number(blockchainResult.loanId),
          borrowerId: data.borrowerId,
          totalAmount: data.totalAmount,
          numMilestones: data.numMilestones,
          impactDescription: data.impactDescription,
          impactUnit: data.impactUnit,
          impactTarget: data.impactTarget,
          txHash: blockchainResult.txHash,
          status: 'ACTIVE',
          approvedAt: new Date(),
        },
      });

      // Crear milestones
      const amountPerMilestone = data.totalAmount / data.numMilestones;
      const impactPerMilestone = data.impactTarget / data.numMilestones;

      for (let i = 0; i < data.numMilestones; i++) {
        await prisma.milestone.create({
          data: {
            loanId: loan.id,
            index: i,
            amount: amountPerMilestone,
            impactRequired: impactPerMilestone,
          },
        });
      }

      logger.info(`Loan created: ${loan.id}`);

      return loan;
    } catch (error) {
      logger.error(`Error creating loan: ${error}`);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de un préstamo
   */
  async getLoan(loanId: string) {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
            stellarPublicKey: true,
            location: true,
          },
        },
        milestones: {
          orderBy: { index: 'asc' },
        },
        validations: {
          include: {
            validator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    return loan;
  }

  /**
   * Lista préstamos con filtros
   */
  async listLoans(filters: {
    status?: string;
    borrowerId?: string;
    limit?: number;
    offset?: number;
  }) {
    const { status, borrowerId, limit = 20, offset = 0 } = filters;

    const where: any = {};
    if (status) where.status = status;
    if (borrowerId) where.borrowerId = borrowerId;

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        include: {
          borrower: {
            select: {
              id: true,
              name: true,
              stellarPublicKey: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.loan.count({ where }),
    ]);

    return {
      loans,
      total,
      limit,
      offset,
    };
  }

  /**
   * Obtiene préstamos de un usuario
   */
  async getUserLoans(userId: string) {
    const loans = await prisma.loan.findMany({
      where: { borrowerId: userId },
      include: {
        milestones: {
          orderBy: { index: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return loans;
  }

  /**
   * Calcula el progreso de un préstamo
   */
  calculateProgress(loan: any) {
    const validatedMilestones = loan.milestones.filter((m: any) => m.validated).length;
    const progressPercentage = (validatedMilestones / loan.numMilestones) * 100;

    return {
      validatedMilestones,
      totalMilestones: loan.numMilestones,
      progressPercentage: Math.round(progressPercentage),
      amountReleased: loan.amountReleased,
      totalAmount: loan.totalAmount,
      impactAchieved: loan.impactAchieved,
      impactTarget: loan.impactTarget,
    };
  }

  /**
   * Genera QR para validación de milestone
   */
  async generateMilestoneQR(loanId: string, milestoneIndex: number) {
    const loan = await this.getLoan(loanId);
    
    if (!loan) {
      throw new AppError('Loan not found', 404);
    }

    const qrDataUrl = await stellarService.generateValidationQR(loanId, milestoneIndex);

    return {
      qrDataUrl,
      loanId,
      milestoneIndex,
      loan: {
        id: loan.id,
        borrower: loan.borrower.name,
        impactUnit: loan.impactUnit,
        milestone: loan.milestones[milestoneIndex],
      },
    };
  }
}

export default new LoanService();
