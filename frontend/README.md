# Frontend README

## Capital Raíz - Frontend

Aplicación web construida con Next.js 14, React, TailwindCSS y TypeScript.

### Estructura

```
frontend/
├── src/
│   ├── app/            # App Router (Next.js 14)
│   │   ├── page.tsx    # Homepage
│   │   ├── layout.tsx  # Root layout
│   │   ├── auth/       # Páginas de auth
│   │   └── dashboard/  # Dashboards
│   ├── components/     # Componentes React
│   │   ├── ui/         # Componentes UI base
│   │   └── providers/  # Providers (React Query, etc.)
│   ├── lib/            # Utilidades
│   ├── services/       # API services
│   ├── store/          # Zustand stores
│   └── styles/         # Estilos globales
├── public/             # Assets estáticos
├── package.json
├── tailwind.config.js
└── next.config.js
```

### Características

- 🎨 Interfaz moderna con TailwindCSS
- 🔐 Autenticación con Freighter Wallet
- 📊 Dashboards interactivos para cada rol
- 📱 Responsive design
- ⚡ Server-side rendering con Next.js 14
- 🔄 React Query para caché y fetching
- 🎭 Animaciones con Framer Motion

### Roles y Vistas

#### Productor (Agricultor/Empresario)
- Dashboard con préstamos activos
- Formulario para solicitar préstamos
- Generación de códigos QR para validación
- Historial de impacto generado

#### Validador (ONG/Cooperativa)
- Lista de préstamos pendientes de validación
- Escáner QR para validar entregas
- Formulario de validación con evidencia
- Historial de validaciones realizadas

#### Inversionista
- Dashboard con resumen de inversiones
- Formulario para añadir liquidez
- Estadísticas de retorno y impacto
- Portfolio de préstamos fondeados

### Instalación

```bash
npm install
cp .env.local.example .env.local
# Editar .env.local

npm run dev
```

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ID=...
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Build para Producción

```bash
npm run build
npm start
```

### Deploy en Vercel

```bash
vercel
```
