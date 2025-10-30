# 🌱 **Capital Raíz**

### Plataforma de Microcréditos DeFi con Colateral de Impacto Sostenible

> **Capital Raíz** redefine el concepto de garantía financiera:  
> en lugar de propiedades o historial crediticio, los usuarios garantizan préstamos con **compromisos verificables de prácticas sostenibles**.

---

## 🎯 **1. Problema**

La inclusión financiera tradicional falla porque microempresarios, campesinos y jóvenes carecen de:

- Historial crediticio  
- Propiedades para usar como colateral  
- Acceso a préstamos tradicionales

---

## 💡 **2. Solución**

Un sistema de **microcréditos descentralizados** donde el colateral es un **Contrato de Impacto Sostenible**, respaldado por acciones reales como:

- Gestión de residuos agrícolas (bagazo de caña)  
- Uso de biofertilizantes  
- Recolección de sargazo  
- Reciclaje verificado

---

## 🧱 **3. Arquitectura Técnica**

### 🧩 Stack Tecnológico

| Componente       | Tecnología                                 |
|------------------|---------------------------------------------|
| **Smart Contracts** | Rust + Soroban (Stellar)                |
| **Backend**         | Node.js + Express + TypeScript           |
| **Frontend**        | Next.js 14 + React + TailwindCSS         |
| **Blockchain**      | Stellar (Testnet/Mainnet)                |
| **Base de Datos**   | PostgreSQL + Prisma ORM                  |

---

### ⚙️ Componentes Principales

#### 🔐 Smart Contracts (Soroban)
- Pools de liquidez y préstamos con hitos (milestones)
- Validación de tokens de impacto
- Sistema de reputación NFT

#### 🧠 Backend API
- CRUD de usuarios, préstamos y contratos
- Integración con Stellar SDK y oráculos de validación
- Sistema de notificaciones

#### 💻 Frontend
- Dashboard para productores  
- Panel de validadores con QR  
- Portal de inversionistas  
- Integración con wallets (Freighter, Albedo)  
- Visualización de impacto en tiempo real

---

## 🔄 **4. Flujo de Usuario**

### 👨‍🌾 Productores (Agricultores / Microempresarios)
1. Conectan su wallet Stellar  
2. Solicitan préstamo (ej. 10,000 USDC)  
3. Crean contrato de impacto (ej. entrega de 5 ton de bagazo)  
4. Reciben fondos por etapas tras cada verificación

### 🏢 Validadores (ONGs / Cooperativas)
1. Reciben notificación de entrega  
2. Verifican físicamente el material  
3. Escanean el QR del productor  
4. Firman validación → genera token `IMPACTO_VERIFICADO`

### 💸 Inversionistas
1. Conectan wallet  
2. Aportan USDC/XLM al pool  
3. Visualizan préstamos activos  
4. Reciben intereses + métricas de impacto
