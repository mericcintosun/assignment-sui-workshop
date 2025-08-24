# Sui dApp Workshop

A comprehensive collection of modern, minimal dark theme Next.js 15 dApps built with Sui dApp Kit, featuring 5 different blockchain applications.

## Features

### 🎨 **Modern Dark Theme** - Built with Sui's official color palette
### 🔗 **Wallet Integration** - Connect with any Sui wallet using dApp Kit
### 📱 **Responsive Design** - Optimized for desktop and mobile devices
### 🎯 **TypeScript** - Full type safety throughout the application
### ⚡ **Gasless Transactions** - All transactions sponsored by Enoki for seamless UX

## dApps Included

### 1. 🖼️ **NFT Minting dApp**
- Create and mint NFTs with custom metadata
- Real-time NFT preview before minting
- View and explore owned NFTs with detailed information
- Execute NFT minting transactions with gasless sponsorship

### 2. 🗳️ **Voting dApp**
- Decentralized voting with multiple options
- Real-time voting results and statistics
- One vote per user per proposal
- Live updated voting results fetched from blockchain
- Gasless proposal creation and voting

### 3. 📖 **Guestbook dApp**
- Leave messages on-chain (max 100 characters)
- View all messages in real-time guestbook feed
- Permanent message storage on Sui blockchain
- Connected wallet authentication
- Gasless message posting

### 4. 🚰 **Token Faucet dApp**
- Claim 10 SUI tokens for testing (Devnet)
- Prevent multiple claims from same wallet
- Display remaining faucet balance
- One-time claim per wallet address
- Gasless token claiming

### 5. 💰 **Tip Jar dApp**
- Send tips to contract owner
- Optional message with tip
- Display total tips received
- Recent tips history
- Gasless tip sending

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Blockchain**: Sui dApp Kit & Sui SDK
- **State Management**: TanStack React Query
- **Language**: TypeScript
- **Gas Sponsorship**: Enoki (for gasless transactions)

## Color Palette

Following Sui's official media kit:

- **Deep Ocean** `#030F1C` - Background
- **Ocean** `#011829` - Surfaces
- **Sea** `#4DA2FF` - Accent
- **Aqua** `#C0E6FF` - Soft text
- **Cloud** `#FFFFFF` - Primary text

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- Sui CLI (for local development)
- Move compiler (included with Sui CLI)
- Enoki API Key (for sponsored transactions)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd assignment-sui-workshop
```

2. Install dependencies:

```bash
yarn install
```

3. Create environment file:

```bash
# Create .env.local file with the following content:
NEXT_PUBLIC_SUI_NETWORK=testnet
ENOKI_API_KEY=your_enoki_private_api_key_here
ENOKI_DEFAULT_NETWORK=testnet
```

4. Get Enoki API Key:
   - Visit [Enoki Portal](https://portal.enoki.mystenlabs.com/)
   - Create a new project
   - Generate a PRIVATE API key with SPONSORED_TRANSACTIONS feature
   - For faucet functionality, also enable Devnet network
   - Add the API key to your `.env.local` file

5. Deploy the Move modules (required for dApp functionality):

```bash
# NFT Minting Module
cd move/nft_mint
sui move build
sui client publish --gas-budget 10000000

# Voting Module
cd ../voting
sui move build
sui client publish --gas-budget 10000000

# Guestbook Module
cd ../guestbook
sui move build
sui client publish --gas-budget 10000000

# Faucet Module
cd ../faucet
sui move build
sui client publish --gas-budget 10000000

# Tip Jar Module
cd ../tipjar
sui move build
sui client publish --gas-budget 10000000
```

### Deployed Contract Addresses

The following contracts have been deployed to Sui testnet:

- **NFT Minting Module**: `0x47ef68ddf317e93617667b1858c2e2dfaaf1fbbcb069bad299caacd8c8cb8417`
- **Voting Module**: `0xa1818ad3bd428551eb1b6330dabe007270065630b2694cc26982afab0bb1cb07`
- **Guestbook Module**: `0xcb381d2853694ec22e2fdc33c172d9bca36897e9ddd20784608b1af6f7a1df45`
- **Faucet Module**: `0xfcc18222140ac7eb4988223d7064153e90393f1117b338865bbaa111a3eef265`
- **Tip Jar Module**: `0x5e67a89ce855640722974ce148dab73935348447e7c9de67e0dd4483dbdb6855`

### Troubleshooting

If you encounter wallet extension conflicts (chrome-extension errors), try:
1. Disable other wallet extensions temporarily
2. Refresh the page
3. Use a different browser
4. Clear browser cache and cookies

5. Start the development server:

```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: After deployment, update the module addresses in the respective page files with your deployed module addresses. See `DEPLOYMENT.md` for detailed instructions.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page with wallet connection and dApp navigation
│   ├── providers.tsx           # Sui dApp Kit providers setup
│   ├── objects/
│   │   ├── page.tsx            # Objects list page
│   │   └── [id]/page.tsx       # Object detail page
│   ├── tx/page.tsx             # Transactions page (placeholder)
│   ├── mint/page.tsx           # NFT minting page with form and preview
│   ├── voting/page.tsx         # Voting dApp with proposals and results
│   ├── guestbook/page.tsx      # Guestbook dApp for leaving messages
│   ├── faucet/page.tsx         # Token faucet for claiming SUI
│   ├── tipjar/page.tsx         # Tip jar for sending tips
│   └── settings/page.tsx       # Network settings page
├── components/
│   └── TxButton.tsx            # Reusable transaction button
└── globals.css                 # Global styles with Sui palette

move/
├── nft_mint/                   # NFT minting module
├── voting/                     # Voting module
├── guestbook/                  # Guestbook module
├── faucet/                     # Token faucet module
└── tipjar/                     # Tip jar module
```

## Pages & Features

### Home (`/`)

- Wallet connection with ConnectButton
- Display connected account address
- NFT gallery showing owned NFTs
- Quick access to mint new NFTs
- Navigation to other pages

### Objects (`/objects`)

- List all owned objects and NFTs
- Click to view detailed object information
- Shows object type, version, and display data
- Filter and search functionality

### Object Detail (`/objects/[id]`)

- Detailed view of individual objects
- Shows object fields, owner, version
- Raw object data display
- Object content and display information

### Transactions (`/tx`)

- Placeholder page with implementation guidance
- Code examples for fetching recent transactions
- Transaction filtering and display patterns

### Mint (`/mint`)

- Mint NFTs with custom name, image URL, and description
- Real-time NFT preview before minting
- Form validation and error handling
- Integration with Move NFT minting module

### Voting (`/voting`)

- Decentralized voting with multiple options
- Real-time voting results and statistics
- One vote per user per proposal
- Live updated voting results fetched from blockchain

### Guestbook (`/guestbook`)

- Leave messages on-chain (max 100 characters)
- View all messages in real-time guestbook feed
- Permanent message storage on Sui blockchain
- Connected wallet authentication

### Faucet (`/faucet`)

- Claim 10 SUI tokens for testing
- Prevent multiple claims from same wallet
- Display remaining faucet balance
- One-time claim per wallet address

### Tip Jar (`/tipjar`)

- Send tips to contract owner
- Optional message with tip
- Display total tips received
- Recent tips history

### Settings (`/settings`)

- Network switcher (localnet/testnet/mainnet)
- Network information and configuration
- Environment variable documentation
- Links to Sui explorers

## Network Configuration

### Testnet (Default)

- Use CLI faucet: `sui client faucet`
- Explorer: [Sui Explorer Testnet](https://suiexplorer.com/txblock?network=testnet)
- Network URL: `https://fullnode.testnet.sui.io`

### Mainnet

- No faucet available - use real SUI
- Explorer: [Sui Explorer Mainnet](https://suiexplorer.com/txblock?network=mainnet)
- Network URL: `https://fullnode.mainnet.sui.io`

### Localnet

- Requires local Sui node: `sui start`
- Network URL: `http://127.0.0.1:9000`
- Use for local development and testing

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Sui Network Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet

# Enoki Configuration (server-side only - NEVER expose with NEXT_PUBLIC)
ENOKI_API_KEY=your_enoki_private_api_key_here
ENOKI_DEFAULT_NETWORK=testnet

# Contract Package IDs (Testnet)
NEXT_PUBLIC_NFT_MINT_PACKAGE_ID=0x5d07a98be794c07aff92b1d725e3a2bee1e46c1a8f46f21ba35cda93352c2b09
NEXT_PUBLIC_NFT_MINT_OBJECT_ID=0x02e96ab32da0778534c94940a5a98b15653f5124f532f077466d7162a570da1e

NEXT_PUBLIC_VOTING_PACKAGE_ID=0xa1818ad3bd428551eb1b6330dabe007270065630b2694cc26982afab0bb1cb07
NEXT_PUBLIC_VOTING_PROPOSAL_CREATOR_OBJECT=0x60b07a041537c9b590297e11876fcb20e50526d97480c8429ae74d75eedc581a

NEXT_PUBLIC_GUESTBOOK_PACKAGE_ID=0xcb381d2853694ec22e2fdc33c172d9bca36897e9ddd20784608b1af6f7a1df45
NEXT_PUBLIC_GUESTBOOK_OBJECT_ID=0x3ad6d6632c94a6480dcec19d6870c22620ea320b9c72d02336141e8cf50cd65c
NEXT_PUBLIC_GUESTBOOK_MANAGER_OBJECT=0x91237bddf543b5f136c93071b2542dac4b6d34665aa38e1a33f4b512dcf05cfc

NEXT_PUBLIC_FAUCET_PACKAGE_ID=0xfcc18222140ac7eb4988223d7064153e90393f1117b338865bbaa111a3eef265
NEXT_PUBLIC_FAUCET_OBJECT_ID=0x4737dd246537d91c9f4bd6679c7c846e222b33a6dea96b955ad934429598d63a
NEXT_PUBLIC_FAUCET_MANAGER_OBJECT=0x52c44095c1a9ed156efdb585e56d281d2ac475c65f056830fb28a9ff2ee7ff74

NEXT_PUBLIC_TIP_JAR_PACKAGE_ID=0x5e67a89ce855640722974ce148dab73935348447e7c9de67e0dd4483dbdb6855
NEXT_PUBLIC_TIP_JAR_OBJECT_ID=0x92f16348ff35fb02189ca8f166962f7a9bb8e44b6762a31c93d5ce557047435f
NEXT_PUBLIC_TIP_JAR_MANAGER_OBJECT=0xe4e0cf6cb39599997cf07d8c0fefab7ab524becdea0a348c01b5305808fa63c8
```

**Important Notes:**
- `ENOKI_API_KEY` should be kept private and never exposed to the client
- For faucet functionality, you need a separate Enoki API key with Devnet access
- Available network options: `localnet`, `testnet`, `mainnet`

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Key Components

### useEnokiSponsor

A custom hook for executing gasless sponsored transactions:

```tsx
const sponsorAndExecute = useEnokiSponsor();

const digest = await sponsorAndExecute(tx, {
  network: "testnet",
  allowedMoveCallTargets: [`${CONTRACTS.NFT_MINT.PACKAGE_ID}::nft_mint::mint_nft`],
});
```

### TxButton (Legacy)

A reusable component for executing transactions (still available):

```tsx
<TxButton onExecute={createTransaction}>Execute Transaction</TxButton>
```

### Providers Setup

The app uses the following providers:

- `QueryClientProvider` - TanStack React Query
- `SuiClientProvider` - Sui client with network configuration
- `WalletProvider` - Wallet connection management

## Development Notes

- The app uses Next.js 15 with App Router
- All pages are client-side rendered for wallet interaction
- Tailwind CSS 4 is used for styling
- TypeScript provides full type safety
- The dApp Kit handles all Sui interactions
- Enoki provides gasless transaction sponsorship
- Move modules provide blockchain functionality
- NFTs are stored on-chain with metadata (name, image URL, description)
- All transactions are now gasless for better user experience

## Troubleshooting

### Wallet Connection Issues

- Ensure you have a Sui wallet installed (Sui Wallet, Suiet, etc.)
- Check that you're on the correct network
- Try refreshing the page

### Transaction Failures

- Check network connectivity
- Verify transaction parameters
- Ensure Enoki API key is properly configured
- Check that the API key has the correct network permissions

### Enoki Issues

- Verify your Enoki API key is valid and has SPONSORED_TRANSACTIONS feature
- Check that the API key has access to the correct network (testnet/devnet)
- Ensure the API key is not exposed to the client (no NEXT_PUBLIC prefix)
- Check Enoki dashboard for usage limits and quotas

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && yarn install`
- Check TypeScript errors: `yarn lint`
- Ensure all dependencies are properly installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
