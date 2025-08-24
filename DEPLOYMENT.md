# NFT Minting Module Deployment Guide

## Prerequisites

1. Install Sui CLI: https://docs.sui.io/build/install
2. Set up a Sui wallet (Sui Wallet, Suiet, etc.)
3. Get testnet SUI: `sui client faucet`

## Deployment Steps

### 1. Build the Move Module

```bash
cd move/nft_mint
sui move build
```

### 2. Deploy to Testnet

```bash
sui client publish --gas-budget 10000000
```

### 3. Get Module Address

After deployment, you'll see output like:

```
Transaction Digest: 0x...
Created Objects:
  - ID: 0x... , Owner: Immutable
  - ID: 0x... , Owner: Shared
```

The first object is your module package, the second is the NFTMinter capability.

### 4. Update Frontend Configuration

Update the transaction in `src/app/mint/page.tsx`:

```typescript
const createNFTMintTransaction = () => {
  const tx = new Transaction();

  // Replace with your actual module address and NFTMinter capability ID
  tx.moveCall({
    target: "YOUR_MODULE_ADDRESS::nft_mint::mint_nft",
    arguments: [
      tx.object("YOUR_NFTMINTER_CAPABILITY_ID"),
      tx.pure(nftName),
      tx.pure(imageUrl),
      tx.pure(description),
    ],
  });

  return tx;
};
```

### 5. Test NFT Minting

1. Start the frontend: `yarn dev`
2. Connect your wallet
3. Fill in NFT details
4. Click "Mint NFT"

## Enoki Sponsorship (Optional)

To enable gasless transactions, integrate with Enoki:

1. Get your Enoki API key
2. Add to `.env.local`:

```
NEXT_PUBLIC_ENOKI_API_KEY=your_api_key_here
```

3. Update transaction to use sponsored gas:

```typescript
// Add sponsorship to your transaction
tx.setGasPayment([sponsoredGasObject]);
```

## Troubleshooting

- **Build errors**: Check Move syntax and dependencies
- **Deployment errors**: Ensure sufficient gas balance
- **Transaction errors**: Verify module addresses and capability IDs
- **Frontend errors**: Check console for detailed error messages
