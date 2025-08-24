module nft_mint::nft_mint;

use std::string::{Self, String};
use sui::event;
use sui::object::{Self, UID, ID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

/// NFT object with metadata
public struct NFT has key, store {
    id: UID,
    name: String,
    image_url: String,
    description: String,
    creator: address,
    created_at: u64,
}

/// Capability for minting NFTs
public struct NFTMinter has key {
    id: UID,
}

/// Events
public struct NFTMinted has copy, drop {
    nft_id: ID,
    name: String,
    creator: address,
}

public struct NFTDeleted has copy, drop {
    nft_id: ID,
    creator: address,
}

public struct NFTUpdated has copy, drop {
    nft_id: ID,
    name: String,
    creator: address,
}

// === Functions ===

/// Initialize the module and create the minter capability
fun init(ctx: &mut TxContext) {
    transfer::share_object(NFTMinter {
        id: object::new(ctx),
    })
}

/// Mint a new NFT
public entry fun mint_nft(
    _minter: &NFTMinter,
    name: vector<u8>,
    image_url: vector<u8>,
    description: vector<u8>,
    ctx: &mut TxContext,
) {
    let nft = NFT {
        id: object::new(ctx),
        name: string::utf8(name),
        image_url: string::utf8(image_url),
        description: string::utf8(description),
        creator: tx_context::sender(ctx),
        created_at: tx_context::epoch(ctx),
    };

    // Emit event
    event::emit(NFTMinted {
        nft_id: object::uid_to_inner(&nft.id),
        name: string::utf8(name),
        creator: tx_context::sender(ctx),
    });

    // Transfer NFT to creator
    transfer::transfer(nft, tx_context::sender(ctx));
}

/// Delete an NFT (only creator can delete)
public entry fun delete_nft(
    nft: NFT,
    ctx: &mut TxContext,
) {
    let NFT { id, name: _, image_url: _, description: _, creator, created_at: _ } = nft;
    
    // Only creator can delete the NFT
    assert!(creator == tx_context::sender(ctx), 0);
    
    // Emit deletion event
    event::emit(NFTDeleted {
        nft_id: object::uid_to_inner(&id),
        creator,
    });
    
    // Delete the NFT object
    object::delete(id);
}

/// Update NFT metadata (only creator can update)
public entry fun update_nft(
    nft: &mut NFT,
    new_name: vector<u8>,
    new_image_url: vector<u8>,
    new_description: vector<u8>,
    ctx: &mut TxContext,
) {
    // Only creator can update the NFT
    assert!(nft.creator == tx_context::sender(ctx), 0);
    
    // Update the NFT fields
    nft.name = string::utf8(new_name);
    nft.image_url = string::utf8(new_image_url);
    nft.description = string::utf8(new_description);
    
    // Emit update event
    event::emit(NFTUpdated {
        nft_id: object::uid_to_inner(&nft.id),
        name: string::utf8(new_name),
        creator: tx_context::sender(ctx),
    });
}

// === View Functions ===

/// Get NFT name
public fun get_name(nft: &NFT): &String {
    &nft.name
}

/// Get NFT image URL
public fun get_image_url(nft: &NFT): &String {
    &nft.image_url
}

/// Get NFT description
public fun get_description(nft: &NFT): &String {
    &nft.description
}

/// Get NFT creator
public fun get_creator(nft: &NFT): address {
    nft.creator
}

/// Get NFT creation timestamp
public fun get_created_at(nft: &NFT): u64 {
    nft.created_at
}
