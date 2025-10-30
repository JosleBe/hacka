# Smart Contract README

## Capital Raíz - Soroban Smart Contract

Este directorio contiene el smart contract de Capital Raíz implementado en Rust usando Soroban (Stellar).

### Estructura

```
contracts/
├── src/
│   ├── lib.rs          # Contrato principal
│   ├── loan.rs         # Estructuras de préstamos
│   ├── validation.rs   # Sistema de validación
│   ├── reputation.rs   # Sistema de reputación
│   └── test.rs         # Tests unitarios
├── Cargo.toml
└── README.md
```

### Funciones Principales

#### `initialize`
Inicializa el contrato con admin y token USDC.

```rust
fn initialize(env: Env, admin: Address, usdc_token: Address)
```

#### `create_loan`
Crea un nuevo préstamo con contrato de impacto.

```rust
fn create_loan(
    env: Env,
    borrower: Address,
    amount: i128,
    num_milestones: u32,
    impact_description: String,
    impact_unit: String,
    impact_target: i128
) -> u64
```

#### `validate_milestone`
Valida un milestone y libera fondos automáticamente.

```rust
fn validate_milestone(
    env: Env,
    loan_id: u64,
    milestone_index: u32,
    validator: Address,
    impact_delivered: i128
) -> i128
```

#### `add_liquidity`
Añade liquidez al pool (para inversionistas).

```rust
fn add_liquidity(
    env: Env,
    investor: Address,
    amount: i128
) -> i128
```

### Compilación

```bash
# Compilar
cargo build --target wasm32-unknown-unknown --release

# Optimizar
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/capital_raiz.wasm

# Desplegar en Testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/capital_raiz_optimized.wasm \
  --source ADMIN_SECRET_KEY \
  --network testnet
```

### Testing

```bash
cargo test
```

### Inicialización

```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source ADMIN_SECRET_KEY \
  --network testnet \
  -- initialize \
  --admin ADMIN_PUBLIC_KEY \
  --usdc_token USDC_TOKEN_ADDRESS
```

### Eventos

El contrato emite los siguientes eventos:

- `loan_created`: Cuando se crea un préstamo
- `milestone_validated`: Cuando se valida un milestone
- `loan_completed`: Cuando se completa un préstamo

### Seguridad

- Todos los métodos que modifican estado requieren autenticación
- Los validadores deben estar registrados por el admin
- Los fondos solo se liberan con validación verificada
- Uso de tipos seguros y manejo de errores robusto
