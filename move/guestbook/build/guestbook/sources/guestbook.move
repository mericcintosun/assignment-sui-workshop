module guestbook::guestbook;

use std::string::{Self, String};
use sui::event;
use sui::object::{Self, UID, ID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use sui::table::{Self, Table};

/// Guestbook message
public struct Message has key, store {
    id: UID,
    author: address,
    content: String,
    timestamp: u64,
}

/// Guestbook container
public struct Guestbook has key {
    id: UID,
    messages: Table<ID, Message>,
    total_messages: u64,
}

/// Capability for managing guestbook
public struct GuestbookManager has key {
    id: UID,
}

/// Events
public struct MessageAdded has copy, drop {
    message_id: ID,
    author: address,
    content: String,
}

// === Functions ===

/// Initialize the module
fun init(ctx: &mut TxContext) {
    let guestbook = Guestbook {
        id: object::new(ctx),
        messages: table::new(ctx),
        total_messages: 0,
    };

    transfer::share_object(guestbook);

    transfer::share_object(GuestbookManager {
        id: object::new(ctx),
    });
}

/// Add a message to the guestbook
public entry fun add_message(
    guestbook: &mut Guestbook,
    _manager: &GuestbookManager,
    content: vector<u8>,
    ctx: &mut TxContext,
) {
    // Limit message length to 100 characters
    assert!(vector::length(&content) <= 100, 0);

    let message = Message {
        id: object::new(ctx),
        author: tx_context::sender(ctx),
        content: string::utf8(content),
        timestamp: tx_context::epoch(ctx),
    };

    let message_id = object::uid_to_inner(&message.id);
    table::add(&mut guestbook.messages, message_id, message);
    guestbook.total_messages = guestbook.total_messages + 1;

    // Emit event
    event::emit(MessageAdded {
        message_id,
        author: tx_context::sender(ctx),
        content: string::utf8(content),
    });
}

// === View Functions ===

/// Get message content
public fun get_content(message: &Message): &String {
    &message.content
}

/// Get message author
public fun get_author(message: &Message): address {
    message.author
}

/// Get message timestamp
public fun get_timestamp(message: &Message): u64 {
    message.timestamp
}

/// Get total message count
public fun get_total_messages(guestbook: &Guestbook): u64 {
    guestbook.total_messages
}

/// Check if message exists
public fun has_message(guestbook: &Guestbook, message_id: ID): bool {
    table::contains(&guestbook.messages, message_id)
}

/// Get message by ID
public fun get_message(guestbook: &Guestbook, message_id: ID): &Message {
    table::borrow(&guestbook.messages, message_id)
}
