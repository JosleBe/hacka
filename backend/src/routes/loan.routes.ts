import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import loanService from '../services/loan.service';

const router = Router();

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Crear un nuevo préstamo
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalAmount:
 *                 type: number
 *               numMilestones:
 *                 type: integer
 *               impactDescription:
 *                 type: string
 *               impactUnit:
 *                 type: string
 *               impactTarget:
 *                 type: number
 *               borrowerSecret:
 *                 type: string
 *     responses:
 *       201:
 *         description: Préstamo creado exitosamente
 */
router.post(
  '/',
  authenticate,
  authorize('PRODUCER'),
  [
    body('totalAmount').isFloat({ min: 0 }),
    body('numMilestones').isInt({ min: 1 }),
    body('impactDescription').notEmpty(),
    body('impactUnit').notEmpty(),
    body('impactTarget').isFloat({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const loan = await loanService.createLoan({
        borrowerId: req.userId!,
        ...req.body,
      });

      res.status(201).json({
        success: true,
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Listar préstamos
 *     tags: [Loans]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de préstamos
 */
router.get('/', async (req, res, next) => {
  try {
    const { status, limit, offset } = req.query;

    const result = await loanService.listLoans({
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Obtener detalles de un préstamo
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del préstamo
 */
router.get('/:id', async (req, res, next) => {
  try {
    const loan = await loanService.getLoan(req.params.id);
    const progress = loanService.calculateProgress(loan);

    res.json({
      success: true,
      data: {
        ...loan,
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/loans/user/{userId}:
 *   get:
 *     summary: Obtener préstamos de un usuario
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Préstamos del usuario
 */
router.get('/user/:userId', async (req, res, next) => {
  try {
    const loans = await loanService.getUserLoans(req.params.userId);

    res.json({
      success: true,
      data: loans,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/loans/{id}/qr/{milestoneIndex}:
 *   get:
 *     summary: Generar código QR para validación de milestone
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: milestoneIndex
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Código QR generado
 */
router.get(
  '/:id/qr/:milestoneIndex',
  authenticate,
  async (req, res, next) => {
    try {
      const result = await loanService.generateMilestoneQR(
        req.params.id,
        parseInt(req.params.milestoneIndex)
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
