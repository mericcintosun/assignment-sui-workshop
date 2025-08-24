module tipjar::tipjar;

use std::string::{Self, String};
use sui::coin::{Self, Coin};
use sui::event;
use sui::object::{Self, UID, ID};
use sui::sui::SUI;
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use sui::table::{Self, Table};

/// Tip jar that collects tips
public struct TipJar has key {
    id: UID,
    owner: address,
    total_tips: u64,
    tip_count: u64,
    tips: Table<ID, Tip>,
}

/// Individual tip record
public struct Tip has key, store {
    id: UID,
    tipper: address,
    amount: u64,
    message: String,
    timestamp: u64,
}

/// Capability for managing tip jar
public struct TipJarManager has key {
    id: UID,
}

/// Events
public struct TipReceived has copy, drop {
    tip_jar_id: ID,
    tipper: address,
    amount: u64,
    message: String,
}

public struct TipsWithdrawn has copy, drop {
    tip_jar_id: ID,
    owner: address,
    amount: u64,
}

// === Functions ===

/// Initialize the module
fun init(ctx: &mut TxContext) {
    let tip_jar = TipJar {
        id: object::new(ctx),
        owner: tx_context::sender(ctx),
        total_tips: 0,
        tip_count: 0,
        tips: table::new(ctx),
    };

    transfer::share_object(tip_jar);

    transfer::share_object(TipJarManager {
        id: object::new(ctx),
    });
}

/// Send a tip to the tip jar
public entry fun send_tip(
    tip_jar: &mut TipJar,
    payment: Coin<SUI>,
    message: vector<u8>,
    ctx: &mut TxContext,
) {
    let amount = coin::value(&payment);
    assert!(amount > 0, 0);

    let tip = Tip {
        id: object::new(ctx),
        tipper: tx_context::sender(ctx),
        amount,
        message: string::utf8(message),
        timestamp: tx_context::epoch(ctx),
    };

    let tip_id = object::uid_to_inner(&tip.id);
    table::add(&mut tip_jar.tips, tip_id, tip);
    
    tip_jar.total_tips = tip_jar.total_tips + amount;
    tip_jar.tip_count = tip_jar.tip_count + 1;

    // Transfer payment to tip jar owner
    transfer::public_transfer(payment, tip_jar.owner);

    // Emit event
    event::emit(TipReceived {
        tip_jar_id: object::uid_to_inner(&tip_jar.id),
        tipper: tx_context::sender(ctx),
        amount,
        message: string::utf8(message),
    });
}

/// Withdraw all tips (only owner can do this)
public entry fun withdraw_tips(
    tip_jar: &mut TipJar,
    _manager: &TipJarManager,
    ctx: &mut TxContext,
) {
    assert!(tx_context::sender(ctx) == tip_jar.owner, 0);
    assert!(tip_jar.total_tips > 0, 1);

    let amount = tip_jar.total_tips;
    tip_jar.total_tips = 0;

    // Emit event
    event::emit(TipsWithdrawn {
        tip_jar_id: object::uid_to_inner(&tip_jar.id),
        owner: tip_jar.owner,
        amount,
    });
}

// === View Functions ===

/// Get tip jar owner
public fun get_owner(tip_jar: &TipJar): address {
    tip_jar.owner
}

/// Get total tips received
public fun get_total_tips(tip_jar: &TipJar): u64 {
    tip_jar.total_tips
}

/// Get tip count
public fun get_tip_count(tip_jar: &TipJar): u64 {
    tip_jar.tip_count
}

/// Get tip by ID
public fun get_tip(tip_jar: &TipJar, tip_id: ID): &Tip {
    table::borrow(&tip_jar.tips, tip_id)
}

/// Get tip amount
public fun get_tip_amount(tip: &Tip): u64 {
    tip.amount
}

/// Get tip message
public fun get_tip_message(tip: &Tip): &String {
    &tip.message
}

/// Get tip tipper
public fun get_tip_tipper(tip: &Tip): address {
    tip.tipper
}

/// Get tip timestamp
public fun get_tip_timestamp(tip: &Tip): u64 {
    tip.timestamp
}
