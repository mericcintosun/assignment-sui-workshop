module voting::voting;

use std::string::{Self, String};
use sui::event;
use sui::object::{Self, UID, ID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use sui::table::{Self, Table};

/// Voting proposal
public struct Proposal has key, store {
    id: UID,
    title: String,
    description: String,
    options: vector<String>,
    total_votes: u64,
    created_at: u64,
}

/// Vote record for a user
public struct Vote has key, store {
    id: UID,
    proposal_id: ID,
    voter: address,
    option_index: u64,
    voted_at: u64,
}

/// Voting results for a proposal
public struct VotingResults has key {
    id: UID,
    proposal_id: ID,
    option_counts: Table<u64, u64>, // option_index -> count
}

/// Capability for creating proposals
public struct ProposalCreator has key {
    id: UID,
}

/// Events
public struct ProposalCreated has copy, drop {
    proposal_id: ID,
    title: String,
    creator: address,
}

public struct VoteCast has copy, drop {
    proposal_id: ID,
    voter: address,
    option_index: u64,
}

// === Functions ===

/// Initialize the module
fun init(ctx: &mut TxContext) {
    transfer::share_object(ProposalCreator {
        id: object::new(ctx),
    })
}

/// Create a new voting proposal
public entry fun create_proposal(
    _creator: &ProposalCreator,
    title: vector<u8>,
    description: vector<u8>,
    options: vector<vector<u8>>,
    ctx: &mut TxContext,
) {
    let mut option_strings = vector::empty<String>();
    let mut i = 0;
    while (i < vector::length(&options)) {
        vector::push_back(&mut option_strings, string::utf8(*vector::borrow(&options, i)));
        i = i + 1;
    };

    let proposal = Proposal {
        id: object::new(ctx),
        title: string::utf8(title),
        description: string::utf8(description),
        options: option_strings,
        total_votes: 0,
        created_at: tx_context::epoch(ctx),
    };

    let results = VotingResults {
        id: object::new(ctx),
        proposal_id: object::uid_to_inner(&proposal.id),
        option_counts: table::new(ctx),
    };

    // Emit event
    event::emit(ProposalCreated {
        proposal_id: object::uid_to_inner(&proposal.id),
        title: string::utf8(title),
        creator: tx_context::sender(ctx),
    });

    // Share the proposal and results
    transfer::share_object(proposal);
    transfer::share_object(results);
}

/// Cast a vote on a proposal
public entry fun cast_vote(
    proposal: &mut Proposal,
    results: &mut VotingResults,
    option_index: u64,
    ctx: &mut TxContext,
) {
    // Check if option index is valid
    assert!(option_index < vector::length(&proposal.options), 0);

    let voter = tx_context::sender(ctx);
    let proposal_id = object::uid_to_inner(&proposal.id);

    // Create vote record
    let vote = Vote {
        id: object::new(ctx),
        proposal_id,
        voter,
        option_index,
        voted_at: tx_context::epoch(ctx),
    };

    // Update vote count
    proposal.total_votes = proposal.total_votes + 1;

    // Update results
    if (table::contains(&results.option_counts, option_index)) {
        let current_count = table::borrow_mut(&mut results.option_counts, option_index);
        *current_count = *current_count + 1;
    } else {
        table::add(&mut results.option_counts, option_index, 1);
    };

    // Emit event
    event::emit(VoteCast {
        proposal_id,
        voter,
        option_index,
    });

    // Transfer vote to voter (as proof of voting)
    transfer::transfer(vote, voter);
}

// === View Functions ===

/// Get proposal title
public fun get_title(proposal: &Proposal): &String {
    &proposal.title
}

/// Get proposal description
public fun get_description(proposal: &Proposal): &String {
    &proposal.description
}

/// Get proposal options
public fun get_options(proposal: &Proposal): &vector<String> {
    &proposal.options
}

/// Get total votes
public fun get_total_votes(proposal: &Proposal): u64 {
    proposal.total_votes
}

/// Get vote count for an option
public fun get_option_vote_count(results: &VotingResults, option_index: u64): u64 {
    if (table::contains(&results.option_counts, option_index)) {
        *table::borrow(&results.option_counts, option_index)
    } else {
        0
    }
}
