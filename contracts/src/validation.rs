use soroban_sdk::{contracttype, Address};

/// Registro de una validación de impacto
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Validation {
    pub loan_id: u64,
    pub milestone_index: u32,
    pub validator: Address,
    pub impact_delivered: i128,
    pub timestamp: u64,
    pub proof_hash: soroban_sdk::String, // Hash de evidencia (foto, documento, etc.)
}

/// Información de un validador
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ValidatorInfo {
    pub address: Address,
    pub name: soroban_sdk::String,
    pub validations_count: u32,
    pub reputation_score: u32, // 0-100
}
