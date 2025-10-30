# Backend API README

## Capital Raíz - Backend API

API REST construida con Node.js, Express, TypeScript y Prisma ORM.

### Estructura

```
backend/
├── src/
│   ├── config/         # Configuración (DB, Stellar)
│   ├── controllers/    # Lógica de endpoints
│   ├── middleware/     # Auth, validación, errores
│   ├── models/         # Modelos Prisma
│   ├── routes/         # Definición de rutas
│   ├── services/       # Lógica de negocio
│   └── index.ts        # Entry point
├── prisma/
│   └── schema.prisma   # Schema de base de datos
├── package.json
├── tsconfig.json
└── .env.example
```

### Endpoints Principales

#### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

#### Loans
- `POST /api/loans` - Crear préstamo
- `GET /api/loans` - Listar préstamos
- `GET /api/loans/:id` - Obtener préstamo
- `GET /api/loans/:id/qr/:milestoneIndex` - Generar QR para validación

#### Validations
- `POST /api/validations` - Validar milestone
- `GET /api/validations/loan/:loanId` - Validaciones de un préstamo

#### Investments
- `POST /api/investments` - Añadir liquidez
- `GET /api/investments/me` - Mis inversiones

#### Stats
- `GET /api/stats/overview` - Estadísticas generales
- `GET /api/stats/impact` - Impacto por tipo
- `GET /api/stats/leaderboard` - Top usuarios

### Instalación

```bash
npm install
cp .env.example .env
# Editar .env con tus valores

npx prisma generate
npx prisma migrate dev

npm run dev
```

### Variables de Entorno

```env
DATABASE_URL="postgresql://..."
STELLAR_NETWORK="testnet"
CONTRACT_ID="..."
JWT_SECRET="..."
PORT=4000
```

### Documentación API

Visita `http://localhost:4000/api-docs` para ver la documentación Swagger interactiva.

### Testing

```bash
npm test
```
