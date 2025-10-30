# 🎪 Capital Raíz - Pitch Deck

## El Problema 🚨

La inclusión financiera en Latinoamérica falla por **una razón principal**:

### ❌ Falta de Colateral (Garantía)

- Un **micro-empresario** no tiene propiedades
- Un **campesino** no tiene historial crediticio
- Un **joven** no tiene avales bancarios

**Resultado:** 70% de la población sin acceso a crédito formal

---

## La Solución 💡

### Capital Raíz: Redefine el concepto de "Garantía"

> "En lugar de tokenizar el CO₂ (difícil de medir), tokenizamos algo más simple pero de alto impacto local: **el compromiso de prácticas sostenibles medibles**"

### ¿Qué sirve como garantía?

- ✅ Gestión de residuos agrícolas (bagazo de caña)
- ✅ Uso de biofertilizantes
- ✅ Recolección de sargazo
- ✅ Reciclaje verificado (hoteles, restaurantes)

**Valor único:** Creas **valor financiero** (crédito) a partir de una **acción social** (sostenibilidad)

---

## ¿Cómo Funciona? ⚙️

### Actores Principales

1. **Productor/Empresario** → Necesita préstamo
2. **Validador** (ONG/Cooperativa) → Verifica impacto
3. **Pool de Liquidez** → Fondea préstamos (inversionistas)

### Flujo en 4 Pasos

#### 1️⃣ Solicitud (App Web3)
```
Don José (agricultor) solicita:
- $10,000 USDC
- Compromiso: Entregar 5 toneladas de bagazo en 6 meses
```

#### 2️⃣ Tokenización (Soroban Smart Contract)
```
- Smart contract bloquea $10,000 del pool
- Crea contrato divisible en 6 milestones
- Cada milestone = 0.83 ton de bagazo = $1,666 USDC
```

#### 3️⃣ Validación (Proof of Impact)
```
- Don José entrega primera tanda (0.83 ton)
- Validador escanea QR de Don José
- Validador firma transacción → Genera token BAGAZO_VERIFICADO
```

#### 4️⃣ Liberación Automática (On-Chain)
```
- Smart contract recibe token BAGAZO_VERIFICADO
- Libera automáticamente $1,666 USDC a Don José
- Se repite hasta completar las 5 toneladas
```

---

## Stack Tecnológico 🛠️

### Smart Contract (Soroban - Rust)
```rust
pub fn create_loan(
    borrower: Address,
    amount: i128,
    num_milestones: u32,
    impact_target: i128
) -> u64 {
    // Bloquea fondos del pool
    // Crea milestones
    // Retorna loan_id
}

pub fn validate_milestone(
    loan_id: u64,
    milestone_index: u32,
    validator: Address,
    impact_delivered: i128
) -> i128 {
    // Verifica validador autorizado
    // Libera fondos progresivamente
    // Retorna amount_released
}
```

### Backend (Node.js + Express + Prisma)
- API REST para gestión de usuarios, préstamos, validaciones
- Integración con Stellar SDK
- Sistema de notificaciones en tiempo real

### Frontend (Next.js 14 + React + TailwindCSS)
- Dashboard para Productores, Validadores e Inversionistas
- Integración con Freighter Wallet
- Generación de códigos QR para validación
- Visualización de impacto en tiempo real

### Blockchain (Stellar)
- **Micro-pagos:** Comisiones bajísimas
- **Multi-Asset:** USDC, tokens de verificación, NFTs de reputación
- **Anchors:** Validadores como puente físico → blockchain
- **Soroban:** Smart contracts para lógica de préstamos

---

## Ventaja Competitiva 🏆

| **Competencia** | **Capital Raíz** |
|----------------|-----------------|
| Créditos de carbono (difícil de verificar en hackathon) | ✅ Impacto local medible (bagazo, sargazo, residuos) |
| Marketplace de NFTs (común) | ✅ Motor económico circular auto-sostenible |
| Plataformas de crédito tradicional | ✅ Sin colateral tradicional requerido |
| Proyectos de un solo track | ✅ **Multi-Track:** Sostenibilidad + Inclusión + Turismo |

---

## Impacto Transformador 🌍

### Social
- **Inclusión financiera real:** 1,000+ familias accediendo a crédito
- **Empoderamiento:** Productores sin historial construyen reputación on-chain

### Ambiental
- **50+ toneladas** de residuos gestionados anualmente
- **Equivalente a 120 ton CO₂** reducido
- **Economía circular local:** Residuos → Biocombustibles

### Económico
- **$1M+ USD** en microcréditos en primer año
- **15% ROI** para inversionistas
- **0% mora** gracias a liberación progresiva

---

## Demo en Vivo 🎬

### Escenario: Don José, agricultor de caña en Xochitepec

**Tiempo: 6 minutos**

1. **Login** (30 seg)
   - Don José conecta Freighter Wallet
   - Dashboard muestra opción "Solicitar Préstamo"

2. **Solicitud** (1 min)
   - Monto: $10,000 USDC
   - Compromiso: 5 ton de bagazo en 6 meses
   - Click "Crear Préstamo" → Firma en Freighter

3. **Blockchain** (30 seg)
   - Smart contract crea préstamo
   - 6 milestones generados
   - Estado: "Activo"

4. **Primera Entrega** (2 min)
   - Don José genera QR desde su dashboard
   - Validador (ONG) escanea QR
   - Validador confirma: 0.83 ton entregadas
   - Firma transacción

5. **Liberación** (1 min)
   - Dashboard de Don José actualiza en tiempo real
   - Balance: +$1,666 USDC
   - Milestone 1: ✅ Completado
   - Impacto: 833 kg bagazo verificado

6. **Visualización** (1 min)
   - Mapa de impacto: Xochitepec
   - Gráfico de progreso: 16.6% completado
   - Reputación de Don José: +10 puntos

---

## Por Qué Ganamos el Gran Premio 🥇

### 1. Nuevo Primitivo Financiero
- No es "otra app de crédito"
- Es un **nuevo concepto de garantía** basado en impacto social

### 2. Excelencia Técnica
- ✅ **Soroban Smart Contracts** (tecnología más nueva de Stellar)
- ✅ **Stellar Assets** (múltiples tokens: USDC, verificación, NFTs)
- ✅ **Anchors** (validadores como oráculo del mundo real)
- ✅ **Micro-transacciones** (comisiones ultra-bajas de Stellar)

### 3. Multi-Track Champion
- **Track 1 (Sostenibilidad):** Gestión de residuos agrícolas ✅
- **Track 3 (Inclusión):** Microcréditos sin colateral tradicional ✅
- **Track 4 (Turismo):** Aplicable a hoteles/restaurantes (reciclaje) ✅

### 4. Escalabilidad
- Mismo modelo aplica a:
  - Agricultura (bagazo, sargazo)
  - Turismo (reciclaje en hoteles)
  - Comercio (uso de biofertilizantes)
  - Artesanía (uso de materiales sostenibles)

### 5. Impacto Real Demostrable
- No es un concepto: **es un producto funcional**
- Dashboard en vivo con transacciones reales
- Smart contract desplegado en Stellar Testnet
- QRs funcionales para validación

---

## Roadmap 🗺️

### Fase 1 (Post-Hackathon) - Mes 1-3
- [ ] Deploy en Stellar Mainnet
- [ ] Piloto con 50 agricultores en Xochitepec
- [ ] Alianza con cooperativa local

### Fase 2 - Mes 4-6
- [ ] Expansión a 3 municipios más
- [ ] Integración con Albedo Wallet
- [ ] Lanzamiento de token de gobernanza

### Fase 3 - Mes 7-12
- [ ] 1,000 usuarios activos
- [ ] $1M USD en préstamos otorgados
- [ ] Alianza con BAF para escalar

---

## El Equipo 👥

- **[Tu Nombre]** - Full Stack & Blockchain Developer
  - 5 años experiencia en Web3
  - Experto en Stellar/Soroban
  - Ganador de [hackathon anterior]

---

## Call to Action 📣

### Para Jueces
> "Capital Raíz no es solo una plataforma DeFi. Es una **redefinición del concepto de garantía financiera** que democratiza el acceso al crédito para quienes más lo necesitan, mientras genera impacto sostenible medible."

### Datos de Contacto
- **Email:** tu@email.com
- **Twitter:** @tuhandle
- **GitHub:** github.com/tuusuario/capital-raiz
- **Demo en Vivo:** capitalraiz.vercel.app

---

## Apéndice: Preguntas Frecuentes ❓

**P: ¿Qué pasa si el productor no cumple?**
- R: El préstamo se marca como "Defaulted". Solo se liberó lo ya validado. El pool no pierde el total.

**P: ¿Cómo se previene fraude en validaciones?**
- R: Validadores son entidades verificadas (ONGs con reputación). Sistema de stake para validadores próximamente.

**P: ¿Por qué Stellar y no Ethereum?**
- R: Comisiones. Un préstamo de $10K con 6 milestones = 6 transacciones. En Ethereum = $200+ en gas. En Stellar = $0.006.

**P: ¿Cómo se calcula el precio del impacto?**
- R: Se ajusta según mercado local. 1 kg bagazo = ~$0.10-0.50 USD según región.

---

**Capital Raíz** - Financiando el futuro desde las raíces 🌱💰
