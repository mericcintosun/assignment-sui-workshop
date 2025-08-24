module faucet::faucet;

use std::string::{Self, String};
use sui::coin::{Self, Coin};
use sui::event;
use sui::object::{Self, UID, ID};
use sui::sui::SUI;
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use sui::table::{Self, Table};

/// Faucet object that holds SUI tokens
public struct Faucet has key {
    id: UID,
    balance: Coin<SUI>,
    claimed_addresses: Table<address, bool>,
    total_claims: u64,
    claim_amount: u64,
}

/// Capability for managing faucet
public struct FaucetManager has key {
    id: UID,
}

/// Events
public struct TokensClaimed has copy, drop {
    faucet_id: ID,
    recipient: address,
    amount: u64,
}

public struct FaucetRefilled has copy, drop {
    faucet_id: ID,
    amount: u64,
}

// === Functions ===

/// Initialize the module
fun init(ctx: &mut TxContext) {
    // Create initial faucet with 1000 SUI (1000000000 micros)
    let faucet = Faucet {
        id: object::new(ctx),
        balance: coin::zero(ctx),
        claimed_addresses: table::new(ctx),
        total_claims: 0,
        claim_amount: 10000000, // 10 SUI in micros
    };

    transfer::share_object(faucet);

    transfer::share_object(FaucetManager {
        id: object::new(ctx),
    });
}

/// Refill the faucet with SUI tokens
public entry fun refill_faucet(
    faucet: &mut Faucet,
    _manager: &FaucetManager,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
) {
    let payment_amount = coin::value(&payment);
    coin::join(&mut faucet.balance, payment);

    // Emit event
    event::emit(FaucetRefilled {
        faucet_id: object::uid_to_inner(&faucet.id),
        amount: payment_amount,
    });
}

/// Claim tokens from the faucet
public entry fun claim_tokens(
    faucet: &mut Faucet,
    ctx: &mut TxContext,
) {
    let recipient = tx_context::sender(ctx);
    
    // Check if address has already claimed
    assert!(!table::contains(&faucet.claimed_addresses, recipient), 0);
    
    // Check if faucet has enough balance
    let faucet_balance = coin::value(&faucet.balance);
    assert!(faucet_balance >= faucet.claim_amount, 1);

    // Split tokens from faucet
    let tokens = coin::split(&mut faucet.balance, faucet.claim_amount, ctx);
    
    // Mark address as claimed
    table::add(&mut faucet.claimed_addresses, recipient, true);
    faucet.total_claims = faucet.total_claims + 1;

    // Transfer tokens to recipient
    transfer::public_transfer(tokens, recipient);

    // Emit event
    event::emit(TokensClaimed {
        faucet_id: object::uid_to_inner(&faucet.id),
        recipient,
        amount: faucet.claim_amount,
    });
}

// === View Functions ===

/// Get faucet balance
public fun get_balance(faucet: &Faucet): u64 {
    coin::value(&faucet.balance)
}

/// Get total claims
public fun get_total_claims(faucet: &Faucet): u64 {
    faucet.total_claims
}

/// Get claim amount
public fun get_claim_amount(faucet: &Faucet): u64 {
    faucet.claim_amount
}

/// Check if address has claimed
public fun has_claimed(faucet: &Faucet, address: address): bool {
    table::contains(&faucet.claimed_addresses, address)
}
