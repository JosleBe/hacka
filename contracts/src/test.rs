#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CapitalRaizContract);
    let client = CapitalRaizContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let usdc_token = Address::generate(&env);

    client.initialize(&admin, &usdc_token);

    let pool_balance = client.get_pool_balance();
    assert_eq!(pool_balance, 0);
}

#[test]
fn test_create_loan() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CapitalRaizContract);
    let client = CapitalRaizContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let usdc_token = Address::generate(&env);
    let borrower = Address::generate(&env);
    let investor = Address::generate(&env);

    // Inicializar contrato
    client.initialize(&admin, &usdc_token);

    // Añadir liquidez
    client.add_liquidity(&investor, &10_000_0000000); // 10,000 USDC

    // Crear préstamo
    let loan_id = client.create_loan(
        &borrower,
        &10_000_0000000,
        &6,
        &String::from_str(&env, "Entrega de bagazo de caña"),
        &String::from_str(&env, "kg_bagazo"),
        &5000,
    );

    assert_eq!(loan_id, 1);

    // Verificar préstamo
    let loan = client.get_loan(&loan_id);
    assert_eq!(loan.total_amount, 10_000_0000000);
    assert_eq!(loan.num_milestones, 6);
    assert_eq!(loan.status, LoanStatus::Active);
}

#[test]
fn test_validate_milestone() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CapitalRaizContract);
    let client = CapitalRaizContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let usdc_token = Address::generate(&env);
    let borrower = Address::generate(&env);
    let investor = Address::generate(&env);
    let validator = Address::generate(&env);

    // Setup
    client.initialize(&admin, &usdc_token);
    client.register_validator(&admin, &validator, &String::from_str(&env, "Cooperativa Local"));
    client.add_liquidity(&investor, &10_000_0000000);

    let loan_id = client.create_loan(
        &borrower,
        &10_000_0000000,
        &6,
        &String::from_str(&env, "Entrega de bagazo"),
        &String::from_str(&env, "kg_bagazo"),
        &5000,
    );

    // Validar primer milestone
    let released = client.validate_milestone(&loan_id, &0, &validator, &833);

    let loan = client.get_loan(&loan_id);
    assert_eq!(loan.amount_released, released);
    assert!(loan.milestones.get(0).unwrap().validated);
}
