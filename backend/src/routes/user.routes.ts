import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obtener perfil del usuario actual
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 */
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        reputation: true,
        loansAsBorrower: {
          where: { status: 'ACTIVE' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del usuario
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        role: true,
        stellarPublicKey: true,
        location: true,
        verified: true,
        reputation: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.put('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { name, phone, location, profileImage } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(location && { location }),
        ...(profileImage && { profileImage }),
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/notifications:
 *   get:
 *     summary: Obtener notificaciones del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 */
router.get('/me/notifications', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
