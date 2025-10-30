import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import validationService from '../services/validation.service';

const router = Router();

/**
 * @swagger
 * /api/validations:
 *   post:
 *     summary: Validar un milestone
 *     tags: [Validations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loanId:
 *                 type: string
 *               milestoneIndex:
 *                 type: integer
 *               impactDelivered:
 *                 type: number
 *               validatorSecret:
 *                 type: string
 *               proofHash:
 *                 type: string
 *               proofImages:
 *                 type: array
 *                 items:
 *                   type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Milestone validado exitosamente
 */
router.post(
  '/',
  authenticate,
  authorize('VALIDATOR'),
  [
    body('loanId').notEmpty(),
    body('milestoneIndex').isInt({ min: 0 }),
    body('impactDelivered').isFloat({ min: 0 }),
    body('validatorSecret').notEmpty(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await validationService.validateMilestone({
        validatorId: req.userId!,
        ...req.body,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/validations/loan/{loanId}:
 *   get:
 *     summary: Obtener validaciones de un préstamo
 *     tags: [Validations]
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de validaciones
 */
router.get('/loan/:loanId', async (req, res, next) => {
  try {
    const validations = await validationService.getLoanValidations(req.params.loanId);

    res.json({
      success: true,
      data: validations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/validations/validator/{validatorId}:
 *   get:
 *     summary: Obtener validaciones realizadas por un validador
 *     tags: [Validations]
 *     parameters:
 *       - in: path
 *         name: validatorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de validaciones del validador
 */
router.get('/validator/:validatorId', async (req, res, next) => {
  try {
    const validations = await validationService.getValidatorValidations(req.params.validatorId);

    res.json({
      success: true,
      data: validations,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
