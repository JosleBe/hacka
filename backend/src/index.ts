import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import loanRoutes from './routes/loan.routes';
import validationRoutes from './routes/validation.routes';
import investmentRoutes from './routes/investment.routes';
import statsRoutes from './routes/stats.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Capital Raíz API',
      version: '1.0.0',
      description: 'API para plataforma de microcréditos DeFi con colateral de impacto sostenible',
      contact: {
        name: 'Capital Raíz Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/validations', validationRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Capital Raíz API is running' });
});

// Error handler
app.use(errorHandler);

// Start server
const HOST = '0.0.0.0'; // Listen on all network interfaces
app.listen(Number(PORT), HOST, () => {
  logger.info(`🚀 Server running on ${HOST}:${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info(`🌐 Network: ${process.env.STELLAR_NETWORK}`);
});

export default app;
