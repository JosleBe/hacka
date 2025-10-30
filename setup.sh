#!/bin/bash

# Script de Setup Automático para Capital Raíz
# Este script configura todo el proyecto desde cero

set -e  # Exit on error

echo "🌱 Capital Raíz - Setup Automático"
echo "=================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mensajes
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Verificar prerequisitos
info "Verificando prerequisitos..."

command -v node >/dev/null 2>&1 || error "Node.js no está instalado. Descarga desde https://nodejs.org"
command -v npm >/dev/null 2>&1 || error "npm no está instalado"
command -v cargo >/dev/null 2>&1 || warn "Rust no está instalado. El smart contract no se compilará"
command -v psql >/dev/null 2>&1 || warn "PostgreSQL no está instalado"

info "✓ Prerequisitos OK"
echo ""

# 1. Setup de Smart Contract
if command -v cargo >/dev/null 2>&1; then
    info "Compilando Smart Contract..."
    cd contracts
    
    # Add wasm target
    rustup target add wasm32-unknown-unknown 2>/dev/null || true
    
    # Build
    cargo build --target wasm32-unknown-unknown --release
    
    info "✓ Smart contract compilado"
    cd ..
else
    warn "Saltando compilación de smart contract (Rust no instalado)"
fi

echo ""

# 2. Setup de Backend
info "Configurando Backend..."
cd backend

# Instalar dependencias
info "Instalando dependencias de backend..."
npm install

# Crear .env si no existe
if [ ! -f .env ]; then
    info "Creando archivo .env..."
    cp .env.example .env
    warn "⚠️  Edita backend/.env con tus credenciales antes de continuar"
else
    info ".env ya existe"
fi

# Generar Prisma client
info "Generando Prisma client..."
npx prisma generate

warn "⚠️  Recuerda ejecutar 'npx prisma migrate dev' después de configurar la base de datos"

cd ..
echo ""

# 3. Setup de Frontend
info "Configurando Frontend..."
cd frontend

# Instalar dependencias
info "Instalando dependencias de frontend..."
npm install

# Crear .env.local si no existe
if [ ! -f .env.local ]; then
    info "Creando archivo .env.local..."
    cp .env.local.example .env.local
    warn "⚠️  Edita frontend/.env.local con tu CONTRACT_ID después del deploy"
else
    info ".env.local ya existe"
fi

cd ..
echo ""

# Resumen final
echo "=================================="
echo -e "${GREEN}✅ Setup completado!${NC}"
echo "=================================="
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Configurar Base de Datos:"
echo "   cd backend"
echo "   npx prisma migrate dev"
echo ""
echo "2. Desplegar Smart Contract:"
echo "   cd contracts"
echo "   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/capital_raiz.wasm --network testnet"
echo ""
echo "3. Actualizar variables de entorno:"
echo "   - backend/.env → CONTRACT_ID, ADMIN_SECRET_KEY"
echo "   - frontend/.env.local → NEXT_PUBLIC_CONTRACT_ID"
echo ""
echo "4. Iniciar servicios:"
echo "   # Terminal 1 - Backend"
echo "   cd backend && npm run dev"
echo ""
echo "   # Terminal 2 - Frontend"
echo "   cd frontend && npm run dev"
echo ""
echo "🎉 Visita http://localhost:3000 para ver Capital Raíz"
echo ""
