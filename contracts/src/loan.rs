use soroban_sdk::{contracttype, Address, Vec};

/// Estados posibles de un préstamo
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LoanStatus {
    Active,
    Completed,
    Defaulted,
}

/// Representación de un milestone dentro de un préstamo
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub index: u32,
    pub amount: i128,
    pub impact_required: i128, // ej: 830 kg de bagazo
    pub validated: bool,
    pub validator: Option<Address>,
    pub validation_timestamp: Option<u64>,
}

/// Estructura principal de un préstamo
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Loan {
    pub id: u64,
    pub borrower: Address,
    pub total_amount: i128,
    pub amount_released: i128,
    pub num_milestones: u32,
    pub milestones: Vec<Milestone>,
    pub status: LoanStatus,
    pub impact_description: soroban_sdk::String,
    pub impact_unit: soroban_sdk::String, // "kg_bagazo", "kg_sargazo", etc.
    pub impact_target: i128,
    pub impact_achieved: i128,
    pub creation_timestamp: u64,
}
