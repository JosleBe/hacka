import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import stellarService from '../services/stellar.service';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [PRODUCER, VALIDATOR, INVESTOR]
 *               stellarPublicKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post(
  '/register',
  [
    body('email').isEmail(),
    body('name').notEmpty(),
    body('role').isIn(['PRODUCER', 'VALIDATOR', 'INVESTOR']),
    body('stellarPublicKey').notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, role, stellarPublicKey, phone, location } = req.body;

      // TODO: Reactivar validación de cuenta Stellar para producción
      // const accountExists = await stellarService.accountExists(stellarPublicKey);
      // if (!accountExists) {
      //   throw new AppError('Stellar account does not exist', 400);
      // }

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { stellarPublicKey },
      });

      if (existingUser) {
        throw new AppError('Usuario ya registrado con esta cuenta de Stellar', 400);
      }

      // Verificar si el email ya existe
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        throw new AppError('Email ya registrado', 400);
      }

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          email,
          name,
          role,
          stellarPublicKey,
          phone,
          location,
        },
      });

      // Generar token JWT
      const jwtSecret = process.env.JWT_SECRET as string;
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpiresIn } as any
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            stellarPublicKey: user.stellarPublicKey,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stellarPublicKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión iniciada exitosamente
 */
router.post('/login', [body('stellarPublicKey').notEmpty()], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stellarPublicKey } = req.body;

    const user = await prisma.user.findUnique({
      where: { stellarPublicKey },
      include: {
        reputation: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const jwtSecret = process.env.JWT_SECRET as string;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as any
    );

    res.json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
