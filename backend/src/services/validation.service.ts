import prisma from '../config/database';
import stellarService from './stellar.service';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class ValidationService {
  /**
   * Valida un milestone
   */
  async validateMilestone(data: {
    loanId: string;
    milestoneIndex: number;
    validatorId: string;
    validatorSecret: string;
    impactDelivered: number;
    proofHash?: string;
    proofImages?: string[];
    notes?: string;
  }) {
    try {
      // Obtener préstamo y milestone
      const loan = await prisma.loan.findUnique({
        where: { id: data.loanId },
        include: {
          milestones: true,
          borrower: true,
        },
      });

      if (!loan) {
        throw new AppError('Loan not found', 404);
      }

      if (loan.status !== 'ACTIVE') {
        throw new AppError('Loan is not active', 400);
      }

      const milestone = loan.milestones.find((m) => m.index === data.milestoneIndex);

      if (!milestone) {
        throw new AppError('Milestone not found', 404);
      }

      if (milestone.validated) {
        throw new AppError('Milestone already validated', 400);
      }

      // Verificar que el validador existe y está autorizado
      const validator = await prisma.user.findUnique({
        where: { id: data.validatorId },
      });

      if (!validator || validator.role !== 'VALIDATOR') {
        throw new AppError('Invalid validator', 403);
      }

      // Validar en blockchain
      const blockchainResult = await stellarService.validateMilestone(
        validator.stellarPublicKey,
        data.validatorSecret,
        BigInt(loan.loanIdOnChain),
        data.milestoneIndex,
        (data.impactDelivered * 100).toString()
      );

      // Actualizar milestone en base de datos
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: {
          validated: 1,
          validatorId: data.validatorId,
          validationTimestamp: new Date(),
          txHash: blockchainResult.txHash,
        },
      });

      // Crear registro de validación
      const validation = await prisma.validation.create({
        data: {
          loanId: data.loanId,
          milestoneId: milestone.id,
          validatorId: data.validatorId,
          impactDelivered: data.impactDelivered,
          proofHash: data.proofHash,
          proofImages: JSON.stringify(data.proofImages || []),
          notes: data.notes,
          txHash: blockchainResult.txHash,
        },
        include: {
          validator: {
            select: {
              id: true,
              name: true,
              stellarPublicKey: true,
            },
          },
          milestone: true,
        },
      });

      // Actualizar loan
      const updatedLoan = await prisma.loan.update({
        where: { id: data.loanId },
        data: {
          amountReleased: {
            increment: milestone.amount,
          },
          impactAchieved: {
            increment: data.impactDelivered,
          },
        },
        include: {
          milestones: true,
        },
      });

      // Verificar si todos los milestones están completados
      const allValidated = updatedLoan.milestones.every((m) => m.validated);

      if (allValidated) {
        await prisma.loan.update({
          where: { id: data.loanId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        });

        // Actualizar reputación del borrower
        await this.updateBorrowerReputation(loan.borrowerId, loan);

        logger.info(`Loan completed: ${data.loanId}`);
      }

      // Crear notificación para el borrower
      await prisma.notification.create({
        data: {
          userId: loan.borrowerId,
          type: 'milestone_validated',
          title: 'Milestone Validado',
          message: `Tu milestone ${data.milestoneIndex + 1} ha sido validado. Se liberaron ${milestone.amount} USDC.`,
          metadata: JSON.stringify({
            loanId: data.loanId,
            milestoneIndex: data.milestoneIndex,
            validationId: validation.id,
          }),
        },
      });

      logger.info(`Milestone validated: ${milestone.id}`);

      return {
        validation,
        loan: updatedLoan,
        completed: allValidated,
      };
    } catch (error) {
      logger.error(`Error validating milestone: ${error}`);
      throw error;
    }
  }

  /**
   * Obtiene validaciones de un préstamo
   */
  async getLoanValidations(loanId: string) {
    const validations = await prisma.validation.findMany({
      where: { loanId },
      include: {
        validator: {
          select: {
            id: true,
            name: true,
            stellarPublicKey: true,
          },
        },
        milestone: true,
      },
      orderBy: { validatedAt: 'asc' },
    });

    return validations;
  }

  /**
   * Obtiene validaciones realizadas por un validador
   */
  async getValidatorValidations(validatorId: string) {
    const validations = await prisma.validation.findMany({
      where: { validatorId },
      include: {
        loan: {
          include: {
            borrower: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        milestone: true,
      },
      orderBy: { validatedAt: 'desc' },
    });

    return validations;
  }

  /**
   * Actualiza la reputación del borrower
   */
  private async updateBorrowerReputation(borrowerId: string, loan: any) {
    // Obtener reputación existente
    const existingReputation = await prisma.reputation.findUnique({
      where: { userId: borrowerId },
    });

    const reputation = await prisma.reputation.upsert({
      where: { userId: borrowerId },
      update: {
        completedLoans: {
          increment: 1,
        },
        totalImpact: {
          increment: loan.impactAchieved,
        },
        nftIds: JSON.stringify([
          ...JSON.parse(existingReputation?.nftIds || '[]'),
          Number(loan.loanIdOnChain)
        ]),
      },
      create: {
        userId: borrowerId,
        completedLoans: 1,
        totalImpact: loan.impactAchieved,
        nftIds: JSON.stringify([Number(loan.loanIdOnChain)]),
      },
    });

    // Calcular reputation score
    const score = this.calculateReputationScore(reputation);

    await prisma.reputation.update({
      where: { userId: borrowerId },
      data: { reputationScore: score },
    });

    return reputation;
  }

  /**
   * Calcula el score de reputación
   */
  private calculateReputationScore(reputation: any): number {
    // Fórmula simple: (préstamos completados * 10) + (impacto / 100) + on_time_rate
    const loanScore = reputation.completedLoans * 10;
    const impactScore = Number(reputation.totalImpact) / 100;
    const timeScore = reputation.onTimeRate;

    return Math.min(Math.round(loanScore + impactScore + timeScore), 1000);
  }
}

export default new ValidationService();
