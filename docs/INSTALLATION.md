# 🚀 Guía de Instalación y Despliegue - Capital Raíz

Esta guía te llevará paso a paso para configurar y ejecutar Capital Raíz en tu máquina local y desplegarlo en producción.

---

## 📋 Prerequisitos

### Software Requerido

- **Node.js** v18+ ([Descargar](https://nodejs.org/))
- **Rust** v1.70+ ([Instalar](https://rustup.rs/))
- **PostgreSQL** v14+ ([Descargar](https://www.postgresql.org/download/))
- **Stellar CLI** ([Instrucciones](https://soroban.stellar.org/docs/getting-started/setup))
- **Git** ([Descargar](https://git-scm.com/))

### Wallets de Stellar

- **Freighter** ([Extensión de Chrome](https://www.freighter.app/))
- Cuenta de Stellar Testnet con fondos (usa [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test))

---

## 🛠️ Instalación Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/capital-raiz.git
cd capital-raiz
```

### 2. Configurar Base de Datos PostgreSQL

```bash
# Crear base de datos
createdb capital_raiz

# O desde psql:
psql -U postgres
CREATE DATABASE capital_raiz;
\q
```

### 3. Configurar Smart Contract (Soroban)

```bash
cd contracts

# Instalar target para Wasm
rustup target add wasm32-unknown-unknown

# Compilar el contrato
cargo build --target wasm32-unknown-unknown --release

# Optimizar el contrato
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/capital_raiz.wasm

# Desplegar en Testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/capital_raiz_optimized.wasm \
  --source ADMIN_SECRET_KEY \
  --network testnet

# Guardar el CONTRACT_ID que se muestra
```

**Nota:** Guarda el `CONTRACT_ID` que devuelve el comando. Lo necesitarás para configurar el backend y frontend.

### 4. Inicializar el Contrato

```bash
# Inicializar con admin y token USDC
stellar contract invoke \
  --id CONTRACT_ID \
  --source ADMIN_SECRET_KEY \
  --network testnet \
  -- initialize \
  --admin ADMIN_PUBLIC_KEY \
  --usdc_token USDC_TOKEN_ADDRESS
```

### 5. Configurar Backend

```bash
cd ../backend

# Instalar dependencias
npm install

# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
nano .env
```

Edita `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/capital_raiz"
STELLAR_NETWORK="testnet"
STELLAR_HORIZON_URL="https://horizon-testnet.stellar.org"
CONTRACT_ID="TU_CONTRACT_ID_AQUI"
ADMIN_PUBLIC_KEY="TU_PUBLIC_KEY"
ADMIN_SECRET_KEY="TU_SECRET_KEY"
USDC_TOKEN_ADDRESS="USDC_TOKEN_ADDRESS_TESTNET"
JWT_SECRET="genera_una_clave_secreta_aleatoria"
PORT=4000
```

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Seed de datos de prueba
npx prisma db seed

# Iniciar servidor en modo desarrollo
npm run dev
```

El backend estará corriendo en `http://localhost:4000`

### 6. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Copiar archivo de ejemplo
cp .env.local.example .env.local

# Editar .env.local
nano .env.local
```

Edita `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ID=TU_CONTRACT_ID_AQUI
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

```bash
# Iniciar en modo desarrollo
npm run dev
```

El frontend estará corriendo en `http://localhost:3000`

---

## 🧪 Probar la Aplicación

### Flujo de Prueba Completo

#### 1. Registro de Usuarios

**Productor (Agricultor):**
```bash
# Abre http://localhost:3000
# Click en "Registrarse"
# Conecta Freighter Wallet
# Selecciona rol: "Productor"
# Completa formulario
```

**Validador (ONG):**
```bash
# Repite el proceso con otra cuenta de Stellar
# Selecciona rol: "Validador"
```

**Inversionista:**
```bash
# Repite con otra cuenta
# Selecciona rol: "Inversionista"
```

#### 2. Añadir Liquidez (como Inversionista)

```bash
# Login como inversionista
# Ve a Dashboard > "Añadir Liquidez"
# Ingresa cantidad (ej: 50000 USDC)
# Firma transacción en Freighter
```

#### 3. Crear Préstamo (como Productor)

```bash
# Login como productor
# Dashboard > "Solicitar Préstamo"
# Completa formulario:
  - Monto: 10000 USDC
  - Milestones: 6
  - Impacto: "Entrega de bagazo de caña"
  - Unidad: "kg_bagazo"
  - Meta: 5000 kg
# Firma transacción
```

#### 4. Validar Milestone (como Validador)

```bash
# Login como validador
# Dashboard > "Préstamos Activos"
# Selecciona préstamo
# Click en "Validar Milestone 1"
# Escanea QR del productor (o ingresa datos manualmente)
# Confirma entrega de 833 kg
# Firma transacción
```

#### 5. Verificar Liberación de Fondos

```bash
# Vuelve al dashboard del productor
# Verifica que se liberaron 1,666 USDC
# Milestone 1 marcado como "Completado"
```

---

## 📦 Despliegue en Producción

### Backend (Railway/Heroku/DigitalOcean)

#### Opción A: Railway

```bash
# Instalar CLI de Railway
npm i -g @railway/cli

# Login
railway login

# Iniciar proyecto
cd backend
railway init

# Añadir PostgreSQL
railway add

# Set variables de entorno
railway variables set STELLAR_NETWORK=mainnet
railway variables set CONTRACT_ID=tu_contract_id
# ... (todas las demás variables)

# Deploy
railway up
```

#### Opción B: Docker

```bash
cd backend

# Crear Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
EOF

# Build
docker build -t capital-raiz-backend .

# Run
docker run -p 4000:4000 --env-file .env capital-raiz-backend
```

### Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

cd frontend

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard:
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_STELLAR_NETWORK
# - NEXT_PUBLIC_CONTRACT_ID
# - NEXT_PUBLIC_HORIZON_URL

# Deploy a producción
vercel --prod
```

### Smart Contract (Stellar Mainnet)

```bash
cd contracts

# Cambiar a Mainnet
stellar network add mainnet \
  --rpc-url https://soroban-rpc.mainnet.stellar.org \
  --network-passphrase "Public Global Stellar Network ; September 2015"

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/capital_raiz_optimized.wasm \
  --source ADMIN_SECRET_KEY_MAINNET \
  --network mainnet

# Inicializar
stellar contract invoke \
  --id NEW_CONTRACT_ID \
  --source ADMIN_SECRET_KEY_MAINNET \
  --network mainnet \
  -- initialize \
  --admin ADMIN_PUBLIC_KEY_MAINNET \
  --usdc_token USDC_MAINNET_ADDRESS
```

---

## 🔧 Troubleshooting

### Error: "Contrato no encontrado"
- Verifica que el `CONTRACT_ID` en `.env` sea correcto
- Asegúrate de que el contrato esté desplegado en la red correcta (testnet/mainnet)

### Error: "Insufficient liquidity in pool"
- Añade más liquidez al pool como inversionista
- Verifica que la transacción de añadir liquidez se haya completado

### Error: "Validator not registered"
- Registra al validador usando el endpoint `/api/auth/register`
- Asegúrate de que el rol sea `VALIDATOR`

### Error: "Freighter not connected"
- Instala la extensión Freighter
- Asegúrate de tener una cuenta con fondos
- Verifica que estás en la red correcta (testnet/mainnet)

---

## 📚 Documentación Adicional

- [Stellar Docs](https://developers.stellar.org/)
- [Soroban Docs](https://soroban.stellar.org/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)

---

## 🤝 Soporte

Si encuentras problemas:
1. Revisa los logs del backend: `cd backend && npm run dev`
2. Revisa la consola del navegador para errores del frontend
3. Verifica transacciones en [Stellar Explorer](https://stellar.expert/explorer/testnet)
4. Abre un issue en GitHub con detalles del error

---

**¡Listo!** Ya tienes Capital Raíz funcionando completamente 🎉
