# Capital Raíz 🌱💰

## Plataforma de Microcréditos DeFi con Colateral de Impacto Sostenible

**Capital Raíz** redefine el concepto de garantía financiera: en lugar de propiedades o historial crediticio, los usuarios garantizan préstamos con **compromisos verificables de prácticas sostenibles**.

---

## 🎯 El Problema

La inclusión financiera falla porque micro-empresarios, campesinos y jóvenes no tienen:
- Historial crediticio
- Propiedades para colateral
- Acceso a préstamos tradicionales

## 💡 La Solución

Un sistema de microcréditos donde el colateral es un **"Contrato de Impacto Sostenible"**:
- Gestión de residuos agrícolas (bagazo de caña)
- Uso de biofertilizantes
- Recolección de sargazo
- Reciclaje verificado

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Smart Contracts**: Rust + Soroban (Stellar)
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: Next.js 14 + React + TailwindCSS
- **Blockchain**: Stellar (Testnet/Mainnet)
- **Base de Datos**: PostgreSQL + Prisma ORM

### Componentes Principales

#### 1. Smart Contract (Soroban)
- Gestión de pools de liquidez
- Contratos de préstamo con liberación progresiva
- Validación de tokens de impacto
- Sistema de reputación NFT

#### 2. Backend API
- Gestión de usuarios (productores, validadores, inversionistas)
- CRUD de préstamos y contratos
- Integración con Stellar SDK
- Oráculos de verificación
- Sistema de notificaciones

#### 3. Frontend
- Dashboard para productores
- Panel de validadores con escaneo QR
- Portal de inversionistas
- Wallet integration (Freighter, Albedo)
- Visualización de impacto en tiempo real

---

## 🚀 Flujo de Usuario

### Para Productores (Agricultores/Empresarios)

1. **Solicitud de Préstamo**
   - Conectar wallet de Stellar
   - Especificar monto (ej: 10,000 USDC)
   - Crear "Contrato de Impacto": comprometerse a entregar X toneladas de bagazo

2. **Tokenización**
   - El smart contract bloquea fondos del pool de liquidez
   - Se crea un contrato divisible en milestones

3. **Entrega y Verificación**
   - El productor entrega bagazo a la cooperativa (Validador)
   - Validador escanea QR y aprueba entrega

4. **Liberación Progresiva**
   - Smart contract libera fondos automáticamente por cada milestone
   - El productor recibe USDC en su wallet

### Para Validadores (ONGs/Cooperativas)

1. Recibir notificación de entrega
2. Verificar físicamente el material (bagazo, residuos, etc.)
3. Escanear QR del productor en la app
4. Firmar transacción de validación (genera token `IMPACTO_VERIFICADO`)

### Para Inversionistas

1. Conectar wallet
2. Depositar USDC/XLM al pool de liquidez
3. Ver dashboard de préstamos activos
4. Recibir intereses + impacto medible

---

## 📦 Estructura del Proyecto

```
capital-raiz/
├── contracts/              # Smart Contracts Soroban (Rust)
│   ├── src/
│   │   ├── lib.rs         # Contrato principal
│   │   ├── loan.rs        # Lógica de préstamos
│   │   ├── validation.rs  # Sistema de validación
│   │   └── reputation.rs  # NFTs de reputación
│   ├── Cargo.toml
│   └── README.md
│
├── backend/               # API Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores REST
│   │   ├── services/      # Lógica de negocio
│   │   ├── models/        # Modelos Prisma
│   │   ├── stellar/       # SDK Stellar integration
│   │   ├── middleware/    # Auth, validación
│   │   └── routes/        # Definición de rutas
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/              # Next.js App
│   ├── src/
│   │   ├── app/           # App Router (Next.js 14)
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilidades
│   │   ├── styles/        # TailwindCSS
│   │   └── types/         # TypeScript types
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── shared/                # Tipos compartidos
│   └── types.ts
│
└── docs/                  # Documentación adicional
    ├── PITCH.md
    ├── TECHNICAL.md
    └── DEPLOYMENT.md
```

---

## 🛠️ Setup e Instalación

### Prerequisitos
- Node.js 18+
- Rust 1.70+ (para Soroban)
- PostgreSQL 14+
- Stellar CLI (`stellar-cli`)
- Docker (opcional)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/capital-raiz.git
cd capital-raiz
```

### 2. Configurar Smart Contracts
```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
stellar contract build
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/capital_raiz.wasm --network testnet
```

### 3. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales

# Setup base de datos
npx prisma migrate dev
npx prisma generate

npm run dev
```

### 4. Configurar Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configurar variables de entorno

npm run dev
```

### 5. Acceder a la aplicación
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Docs API: http://localhost:4000/api-docs

---

## 🔑 Variables de Entorno

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/capital_raiz"
STELLAR_NETWORK="testnet"
STELLAR_HORIZON_URL="https://horizon-testnet.stellar.org"
CONTRACT_ID="CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
SECRET_KEY="tu_clave_secreta_jwt"
PORT=4000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_STELLAR_NETWORK="testnet"
NEXT_PUBLIC_CONTRACT_ID="CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

---

## 🌟 Características Principales

### 1. Contratos de Impacto Tokenizados
- NFTs únicos por cada contrato de préstamo
- Metadata on-chain con compromisos sostenibles
- Transferibles para mercados secundarios

### 2. Liberación Progresiva de Fondos
- Smart contract divide préstamo en milestones
- Liberación automática al verificar cada entrega
- Sin intermediarios, 100% on-chain

### 3. Sistema de Reputación
- NFT de reputación por préstamos completados
- Score basado en puntualidad y cumplimiento
- Mejora acceso a préstamos futuros

### 4. Multi-Asset Support
- USDC (stablecoin principal)
- XLM (nativo Stellar)
- Custom tokens (BAGAZO_VERIFICADO, etc.)

### 5. Dashboard de Impacto
- Visualización de toneladas de residuos gestionados
- Equivalente en CO₂ reducido
- Mapa de impacto en Xochitepec

---

## 🎪 Demo para el Hackathon

### Escenario de Demostración

**Actor**: Don José, agricultor de caña en Xochitepec

1. **Solicitud** (2 min)
   - Don José conecta su wallet Freighter
   - Solicita 10,000 USDC
   - Se compromete a entregar 5 toneladas de bagazo en 6 meses

2. **Aprobación** (1 min)
   - El smart contract verifica el pool de liquidez
   - Se crea el contrato con 6 milestones (0.83 ton c/u)
   - Estado: "Activo"

3. **Primera Entrega** (2 min)
   - Don José lleva 0.83 ton a la cooperativa
   - El validador (ONG local) escanea su QR
   - Firma la validación desde su wallet

4. **Liberación Automática** (30 seg)
   - Smart contract detecta el token `BAGAZO_VERIFICADO`
   - Libera 1,666 USDC a Don José
   - Actualiza el dashboard en tiempo real

5. **Repetir** hasta completar las 5 toneladas

---

## 🏆 Por Qué Ganamos

### Impacto Transformador
- **Nuevo primitivo financiero**: Colateral basado en impacto social
- **Inclusión real**: Sirve a quien más lo necesita
- **Escalable**: Aplica a agricultura, turismo, comercio

### Excelencia Técnica
- **Soroban Smart Contracts**: Uso avanzado de la tecnología más nueva de Stellar
- **Stellar Assets**: Múltiples tokens (USDC, tokens de verificación, NFTs)
- **Anchors**: Validadores como puente mundo real → blockchain
- **Micro-transacciones**: Comisiones bajísimas de Stellar = viable a escala

### Multi-Track
- ✅ **Track 1 (Sostenibilidad)**: Gestión de residuos agrícolas
- ✅ **Track 3 (Inclusión)**: Microcréditos sin colateral tradicional
- ✅ **Track 4 (Turismo)**: Aplicable a hoteles/restaurantes comprometidos con reciclaje

---

## 🤝 Contribuciones

Este proyecto fue desarrollado para el Hackathon [NOMBRE] 2025.

### Equipo
- [Tu Nombre] - Full Stack & Blockchain Developer

### Contacto
- Email: tu@email.com
- Twitter: @tuhandle
- GitHub: @tuusuario

---

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

## 🙏 Agradecimientos

- Stellar Foundation por Soroban
- BAF por infraestructura
- Comunidad de Xochitepec
- Cooperativas locales de agricultura sostenible

---

**Capital Raíz** - Financiando el futuro desde las raíces 🌱
#   h a c k a  
 