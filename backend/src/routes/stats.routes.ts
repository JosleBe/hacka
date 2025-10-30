import { Router } from 'express';
import prisma from '../config/database';

const router = Router();

/**
 * @swagger
 * /api/stats/overview:
 *   get:
 *     summary: Obtener estadísticas generales de la plataforma
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Estadísticas generales
 */
router.get('/overview', async (req, res, next) => {
  try {
    const [
      totalLoans,
      activeLoans,
      completedLoans,
      totalUsers,
      totalInvestments,
      totalImpact,
    ] = await Promise.all([
      prisma.loan.count(),
      prisma.loan.count({ where: { status: 'ACTIVE' } }),
      prisma.loan.count({ where: { status: 'COMPLETED' } }),
      prisma.user.count(),
      prisma.investment.aggregate({
        _sum: { amount: true },
      }),
      prisma.loan.aggregate({
        _sum: { impactAchieved: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        loans: {
          total: totalLoans,
          active: activeLoans,
          completed: completedLoans,
        },
        totalUsers,
        totalInvested: totalInvestments._sum.amount || 0,
        totalImpact: totalImpact._sum.impactAchieved || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/stats/impact:
 *   get:
 *     summary: Obtener estadísticas de impacto por tipo
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Estadísticas de impacto
 */
router.get('/impact', async (req, res, next) => {
  try {
    const impactByType = await prisma.loan.groupBy({
      by: ['impactUnit'],
      _sum: {
        impactAchieved: true,
        impactTarget: true,
      },
      _count: true,
    });

    res.json({
      success: true,
      data: impactByType,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/stats/leaderboard:
 *   get:
 *     summary: Obtener tabla de líderes por reputación
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Top usuarios por reputación
 */
router.get('/leaderboard', async (req, res, next) => {
  try {
    const topUsers = await prisma.reputation.findMany({
      take: 10,
      orderBy: { reputationScore: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: topUsers,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
