#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Symbol, Vec, String};

mod loan;
mod validation;
mod reputation;

use loan::{Loan, LoanStatus, Milestone};
use validation::Validation;
use reputation::ReputationScore;

/// Evento emitido cuando se crea un nuevo préstamo
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LoanCreatedEvent {
    pub loan_id: u64,
    pub borrower: Address,
    pub amount: i128,
    pub milestones: u32,
}

/// Evento emitido cuando se valida un milestone
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MilestoneValidatedEvent {
    pub loan_id: u64,
    pub milestone_index: u32,
    pub amount_released: i128,
    pub validator: Address,
}

/// Evento emitido cuando se completa un préstamo
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LoanCompletedEvent {
    pub loan_id: u64,
    pub borrower: Address,
    pub total_amount: i128,
    pub reputation_nft_id: u64,
}

/// Almacenamiento de datos del contrato
#[contracttype]
pub enum DataKey {
    Admin,
    LoanCounter,
    Loan(u64),
    UserLoans(Address),
    LiquidityPool,
    USDCToken,
    ValidatorRegistry(Address),
    ReputationScore(Address),
}

#[contract]
pub struct CapitalRaizContract;

#[contractimpl]
impl CapitalRaizContract {
    /// Inicializa el contrato con el admin y el token USDC
    pub fn initialize(env: Env, admin: Address, usdc_token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::USDCToken, &usdc_token);
        env.storage().instance().set(&DataKey::LoanCounter, &0u64);
        env.storage().instance().set(&DataKey::LiquidityPool, &0i128);
    }

    /// Registra un validador autorizado
    pub fn register_validator(env: Env, admin: Address, validator: Address, name: String) {
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        stored_admin.require_auth();

        if stored_admin != admin {
            panic!("Only admin can register validators");
        }

        env.storage().persistent().set(&DataKey::ValidatorRegistry(validator.clone()), &name);
    }

    /// Añade liquidez al pool (inversionistas)
    pub fn add_liquidity(env: Env, investor: Address, amount: i128) -> i128 {
        investor.require_auth();

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let usdc_token: Address = env.storage().instance().get(&DataKey::USDCToken).unwrap();
        let contract_address = env.current_contract_address();

        // Transferir USDC del inversionista al contrato
        let client = token::Client::new(&env, &usdc_token);
        client.transfer(&investor, &contract_address, &amount);

        // Actualizar el pool
        let mut pool_balance: i128 = env.storage().instance().get(&DataKey::LiquidityPool).unwrap_or(0);
        pool_balance += amount;
        env.storage().instance().set(&DataKey::LiquidityPool, &pool_balance);

        pool_balance
    }

    /// Crea un nuevo préstamo con contrato de impacto
    pub fn create_loan(
        env: Env,
        borrower: Address,
        amount: i128,
        num_milestones: u32,
        impact_description: String,
        impact_unit: String, // ej: "toneladas_bagazo"
        impact_target: i128,  // ej: 5000 (5 toneladas = 5000 kg)
    ) -> u64 {
        borrower.require_auth();

        if amount <= 0 || num_milestones == 0 {
            panic!("Invalid loan parameters");
        }

        // Verificar liquidez disponible
        let pool_balance: i128 = env.storage().instance().get(&DataKey::LiquidityPool).unwrap_or(0);
        if pool_balance < amount {
            panic!("Insufficient liquidity in pool");
        }

        // Crear milestones
        let amount_per_milestone = amount / num_milestones as i128;
        let impact_per_milestone = impact_target / num_milestones as i128;
        let mut milestones: Vec<Milestone> = Vec::new(&env);

        for i in 0..num_milestones {
            milestones.push_back(Milestone {
                index: i,
                amount: amount_per_milestone,
                impact_required: impact_per_milestone,
                validated: false,
                validator: None,
                validation_timestamp: None,
            });
        }

        // Incrementar contador
        let mut loan_counter: u64 = env.storage().instance().get(&DataKey::LoanCounter).unwrap_or(0);
        loan_counter += 1;

        // Crear préstamo
        let loan = Loan {
            id: loan_counter,
            borrower: borrower.clone(),
            total_amount: amount,
            amount_released: 0,
            num_milestones,
            milestones: milestones.clone(),
            status: LoanStatus::Active,
            impact_description: impact_description.clone(),
            impact_unit: impact_unit.clone(),
            impact_target,
            impact_achieved: 0,
            creation_timestamp: env.ledger().timestamp(),
        };

        // Guardar préstamo
        env.storage().persistent().set(&DataKey::Loan(loan_counter), &loan);
        env.storage().instance().set(&DataKey::LoanCounter, &loan_counter);

        // Actualizar préstamos del usuario
        let mut user_loans: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::UserLoans(borrower.clone()))
            .unwrap_or(Vec::new(&env));
        user_loans.push_back(loan_counter);
        env.storage().persistent().set(&DataKey::UserLoans(borrower.clone()), &user_loans);

        // Bloquear fondos del pool
        let mut pool_balance: i128 = env.storage().instance().get(&DataKey::LiquidityPool).unwrap();
        pool_balance -= amount;
        env.storage().instance().set(&DataKey::LiquidityPool, &pool_balance);

        // Emitir evento
        env.events().publish(
            (Symbol::new(&env, "loan_created"),),
            LoanCreatedEvent {
                loan_id: loan_counter,
                borrower: borrower.clone(),
                amount,
                milestones: num_milestones,
            },
        );

        loan_counter
    }

    /// Valida un milestone y libera fondos
    pub fn validate_milestone(
        env: Env,
        loan_id: u64,
        milestone_index: u32,
        validator: Address,
        impact_delivered: i128,
    ) -> i128 {
        validator.require_auth();

        // Verificar que el validador esté registrado
        if !env.storage().persistent().has(&DataKey::ValidatorRegistry(validator.clone())) {
            panic!("Validator not registered");
        }

        // Obtener préstamo
        let mut loan: Loan = env
            .storage()
            .persistent()
            .get(&DataKey::Loan(loan_id))
            .expect("Loan not found");

        if loan.status != LoanStatus::Active {
            panic!("Loan is not active");
        }

        if milestone_index >= loan.num_milestones {
            panic!("Invalid milestone index");
        }

        // Obtener milestone
        let mut milestone = loan.milestones.get(milestone_index).expect("Milestone not found");

        if milestone.validated {
            panic!("Milestone already validated");
        }

        if impact_delivered < milestone.impact_required {
            panic!("Insufficient impact delivered");
        }

        // Marcar como validado
        milestone.validated = true;
        milestone.validator = Some(validator.clone());
        milestone.validation_timestamp = Some(env.ledger().timestamp());
        loan.milestones.set(milestone_index, milestone.clone());

        // Actualizar progreso
        loan.amount_released += milestone.amount;
        loan.impact_achieved += impact_delivered;

        // Transferir USDC al borrower
        let usdc_token: Address = env.storage().instance().get(&DataKey::USDCToken).unwrap();
        let contract_address = env.current_contract_address();
        let client = token::Client::new(&env, &usdc_token);
        client.transfer(&contract_address, &loan.borrower, &milestone.amount);

        // Verificar si todos los milestones están completados
        let all_validated = (0..loan.num_milestones)
            .all(|i| loan.milestones.get(i).unwrap().validated);

        if all_validated {
            loan.status = LoanStatus::Completed;

            // Crear NFT de reputación
            let reputation_nft_id = Self::mint_reputation_nft(
                env.clone(),
                loan.borrower.clone(),
                loan.id,
                loan.total_amount,
                loan.impact_achieved,
            );

            // Emitir evento de completado
            env.events().publish(
                (Symbol::new(&env, "loan_completed"),),
                LoanCompletedEvent {
                    loan_id: loan.id,
                    borrower: loan.borrower.clone(),
                    total_amount: loan.total_amount,
                    reputation_nft_id,
                },
            );
        }

        // Guardar préstamo actualizado
        env.storage().persistent().set(&DataKey::Loan(loan_id), &loan);

        // Emitir evento
        env.events().publish(
            (Symbol::new(&env, "milestone_validated"),),
            MilestoneValidatedEvent {
                loan_id,
                milestone_index,
                amount_released: milestone.amount,
                validator: validator.clone(),
            },
        );

        loan.amount_released
    }

    /// Obtiene los detalles de un préstamo
    pub fn get_loan(env: Env, loan_id: u64) -> Loan {
        env.storage()
            .persistent()
            .get(&DataKey::Loan(loan_id))
            .expect("Loan not found")
    }

    /// Obtiene los préstamos de un usuario
    pub fn get_user_loans(env: Env, user: Address) -> Vec<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::UserLoans(user))
            .unwrap_or(Vec::new(&env))
    }

    /// Obtiene el balance del pool de liquidez
    pub fn get_pool_balance(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::LiquidityPool)
            .unwrap_or(0)
    }

    /// Obtiene el score de reputación de un usuario
    pub fn get_reputation_score(env: Env, user: Address) -> ReputationScore {
        env.storage()
            .persistent()
            .get(&DataKey::ReputationScore(user.clone()))
            .unwrap_or(ReputationScore {
                user: user.clone(),
                completed_loans: 0,
                total_impact: 0,
                on_time_rate: 100,
                nft_ids: Vec::new(&env),
            })
    }

    /// Función interna para crear NFT de reputación
    fn mint_reputation_nft(
        env: Env,
        user: Address,
        loan_id: u64,
        amount: i128,
        impact: i128,
    ) -> u64 {
        let nft_id = loan_id; // Simplificado: usar loan_id como NFT id

        // Actualizar score de reputación
        let mut score = Self::get_reputation_score(env.clone(), user.clone());
        score.completed_loans += 1;
        score.total_impact += impact;
        score.nft_ids.push_back(nft_id);

        env.storage()
            .persistent()
            .set(&DataKey::ReputationScore(user.clone()), &score);

        nft_id
    }
}

#[cfg(test)]
mod test;
