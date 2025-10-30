use soroban_sdk::{contracttype, Address, Vec};

/// Score de reputación de un usuario
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReputationScore {
    pub user: Address,
    pub completed_loans: u32,
    pub total_impact: i128,
    pub on_time_rate: u32, // Porcentaje (0-100)
    pub nft_ids: Vec<u64>,
}

/// Metadata de un NFT de reputación
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReputationNFT {
    pub id: u64,
    pub owner: Address,
    pub loan_id: u64,
    pub amount: i128,
    pub impact: i128,
    pub timestamp: u64,
}
