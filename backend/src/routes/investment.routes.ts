import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import stellarService from '../services/stellar.service';

const router = Router();

/**
 * @swagger
 * /api/investments:
 *   post:
 *     summary: Añadir liquidez al pool
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               investorSecret:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inversión realizada exitosamente
 */
router.post(
  '/',
  authenticate,
  authorize('INVESTOR'),
  [body('amount').isFloat({ min: 0 }), body('investorSecret').notEmpty()],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { amount, investorSecret } = req.body;

      const investor = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      if (!investor) {
        return res.status(404).json({ success: false, message: 'Investor not found' });
      }

      // Añadir liquidez en blockchain
      const blockchainResult = await stellarService.addLiquidity(
        investor.stellarPublicKey,
        investorSecret,
        (amount * 10000000).toString()
      );

      // Registrar inversión
      const investment = await prisma.investment.create({
        data: {
          investorId: req.userId!,
          amount,
          txHash: blockchainResult.txHash,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          investment,
          poolBalance: blockchainResult.newPoolBalance,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * @swagger
 * /api/investments/me:
 *   get:
 *     summary: Obtener inversiones del usuario actual
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inversiones
 */
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const investments = await prisma.investment.findMany({
      where: { investorId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    const totalInvested = investments.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0
    );

    res.json({
      success: true,
      data: {
        investments,
        totalInvested,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
